import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from '@prisma/client';
import { solicitudGet } from 'src/common/helpers/consultasExternas';
import { ExchangeResponse } from 'src/common/interface/exchange-response.interface';
import { api_exchange_url } from 'src/common/config/config';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const uniqueISBN = await this.prisma.book.findUnique({
      where: { isbn: createBookDto.isbn },
    });

    if (uniqueISBN) {
      throw new ConflictException(
        `Ya existe un libro con el ISBN ${createBookDto.isbn}.`,
      );
    }

    const { isbn } = createBookDto;
    const cleanIsbn = isbn.replace(/-/g, '');

    // Regex explicada:
    // ^           -> Inicio de la cadena
    // (?:         -> Grupo no capturador (opción A o B)
    //   \d{9}     -> 9 dígitos exactos
    //   [\dX]     -> Seguidos de un dígito o una 'X' (para ISBN-10)
    //   |         -> O
    //   \d{13}    -> 13 dígitos exactos (para ISBN-13)
    // )           -> Cierre del grupo
    // $           -> Fin de la cadena
    const isValidFormat = /^(?:\d{9}[\dX]|\d{13})$/.test(cleanIsbn);

    if (!isValidFormat) {
      throw new BadRequestException(
        `El ISBN '${isbn}' no tiene un formato válido. Debe tener 10 o 13 dígitos (sin contar guiones).`,
      );
    }

    try {
      const createdBook: Book = await this.prisma.book.create({
        data: createBookDto,
      });

      return createdBook;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear el libro.');
    }
  }

  async findAll(
    page?: number | null,
    size?: number | null,
  ): Promise<{ data: Book[]; count: number }> {
    try {
      if (page && size) {
        const [data, count] = await Promise.all([
          this.prisma.book.findMany({
            skip: (page - 1) * size,
            take: size,
          }),
          this.prisma.book.count(),
        ]);

        return { data, count };
      } else {
        const books = await this.prisma.book.findMany();
        return { data: books, count: books.length };
      }
    } catch (error) {
      console.error('Error al obtener todos los libros:', error);
      throw new InternalServerErrorException(
        'Error al obtener los libros. Intente nuevamente más tarde.',
      );
    }
  }

  async findOne(id: number): Promise<Book | null> {
    try {
      const book = await this.prisma.book.findUnique({
        where: { id },
      });

      if (!book) {
        throw new NotFoundException(`No se encontró el libro con ID ${id}.`);
      }
      return book;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error(`Error al obtener el libro con id ${id}:`, error);
      throw new InternalServerErrorException(
        'Error al obtener el libro. Intente nuevamente más tarde.',
      );
    }
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    if (updateBookDto.isbn !== undefined && updateBookDto.isbn !== null) {
      const { isbn } = updateBookDto;
      const cleanIsbn = isbn.replace(/-/g, '');

      const isValidFormat = /^(?:\d{9}[\dX]|\d{13})$/.test(cleanIsbn);

      if (!isValidFormat) {
        throw new BadRequestException(
          `El ISBN '${isbn}' no tiene un formato válido. Debe tener 10 o 13 dígitos (sin contar guiones).`,
        );
      }

      const uniqueISBN = await this.prisma.book.findFirst({
        where: {
          isbn: isbn,
          id: { not: id },
        },
      });

      if (uniqueISBN) {
        throw new ConflictException(
          `Ya existe otro libro con el ISBN ${isbn}.`,
        );
      }
    }

    try {
      const updatedBook = await this.prisma.book.update({
        where: { id },
        data: updateBookDto,
      });

      return updatedBook;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          `No se encontró el libro con ID ${id} para actualizar.`,
        );
      }

      console.error(`Error al actualizar el libro con id ${id}:`, error);
      throw new InternalServerErrorException('Error al actualizar el libro.');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(
        `No se encontró el libro con ID ${id} para eliminar.`,
      );
    }

    try {
      await this.prisma.book.delete({
        where: { id },
      });

      return { message: 'Libro eliminado correctamente' };
    } catch (error) {
      console.error(`Error al eliminar el libro con id ${id}:`, error);
      throw new InternalServerErrorException('Error al eliminar el libro.');
    }
  }

  async searchByCategory(category: string): Promise<Book[]> {
    if (!category) {
      throw new BadRequestException('Debe proporcionar una categoría.');
    }

    try {
      return await this.prisma.book.findMany({
        where: {
          category: {
            contains: category,
            mode: 'insensitive',
          },
        },
      });
    } catch (error) {
      console.error('Error al buscar libros por categoría:', error);
      throw new InternalServerErrorException(
        'Error al buscar libros por categoría. Intente nuevamente más tarde.',
      );
    }
  }

  async low_stock(threshold: number): Promise<Book[]> {
    if (threshold <= 0) {
      throw new BadRequestException(
        'El umbral de stock debe ser un número positivo.',
      );
    }

    try {
      return await this.prisma.book.findMany({
        where: { stockQuantity: { lte: threshold } },
      });
    } catch (error) {
      console.error('Error al obtener libros con bajo stock:', error);
      throw new InternalServerErrorException(
        'Error al obtener libros con bajo stock. Intente nuevamente más tarde.',
      );
    }
  }

  async calculate_price(
    bookId: number,
    currency: string,
    conversion_rate_manual?: number,
    profit_margin_manual?: number,
  ) {
    let conversion_rate: number = conversion_rate_manual || 250.0;
    const profit_margin: number = profit_margin_manual || 0.4;

    let book: Book | null;
    try {
      book = await this.prisma.book.findUnique({
        where: { id: bookId },
      });
    } catch (error) {
      console.error(`Error al obtener el libro con id ${bookId}:`, error);
      throw new InternalServerErrorException(
        'Error al obtener el libro. Intente nuevamente más tarde.',
      );
    }

    if (!book) {
      throw new BadRequestException(
        `No se encontró el libro con ID ${bookId}.`,
      );
    }

    if (!conversion_rate_manual) {
      try {
        if (api_exchange_url) {
          const data = await solicitudGet<ExchangeResponse>({
            url: api_exchange_url,
          });

          conversion_rate = data.conversion_rates.VES;
        }
      } catch (error) {
        console.log(error);
      }
    }

    let newBook: Book;
    try {
      newBook = await this.prisma.book.update({
        where: { id: bookId },
        data: {
          sellingPriceLocal: Number(book.costUsd) * (profit_margin + 1),
        },
      });
    } catch (error) {
      console.error(`Error al actualizar el libro con id ${bookId}:`, error);
      throw new InternalServerErrorException(
        'Error al actualizar el precio del libro. Intente nuevamente más tarde.',
      );
    }

    return {
      book_id: bookId,
      cost_usd: Number(book.costUsd),
      exchange_rate: conversion_rate,
      cost_local: Number((Number(book.costUsd) * conversion_rate).toFixed(4)),
      margin_percentage: profit_margin * 100,
      selling_price_local: Number(book.costUsd) * (profit_margin + 1),
      currency,
      calculation_timestamp: new Date(),
    };
  }
}
