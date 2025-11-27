import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { calculatePriceDto, IdParamDto } from './dto/query-book.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'size',
    required: false,
    type: 'number',
    description: 'Tamaño de página',
  })
  @Get()
  findAll(@Query('page') page?: string, @Query('size') size?: string) {
    let pageQuery: number | null = null;
    let sizeQuery: number | null = null;

    if (page && size) {
      pageQuery = parseInt(page, 10) || 1;
      sizeQuery = parseInt(size, 10) || 10;
    }

    return this.booksService.findAll(pageQuery, sizeQuery);
  }

  @Get('search')
  searchByCategory(@Query('category') category: string) {
    return this.booksService.searchByCategory(category);
  }

  @Get('low-stock')
  lowStock(@Query('threshold') threshold: string) {
    const thresholdNumber = parseInt(threshold, 10);

    if (isNaN(thresholdNumber) || !threshold) {
      throw new BadRequestException(
        'El umbral de stock debe ser un número entero válido.',
      );
    }

    return this.booksService.low_stock(thresholdNumber);
  }

  @Get(':id')
  findOne(@Param() params: IdParamDto) {
    return this.booksService.findOne(params.id);
  }

  @Post(':id/calculate-price')
  calculatePrice(
    @Param() params: IdParamDto,
    @Body() body?: calculatePriceDto,
  ) {
    return this.booksService.calculate_price(
      params.id,
      body?.currency || 'VES',
      body?.conversion_rate_manual,
      body?.profit_margin_manual,
    );
  }

  @Put(':id')
  @ApiBody({ type: UpdateBookDto })
  update(@Param() params: IdParamDto, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(params.id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param() params: IdParamDto) {
    return this.booksService.remove(params.id);
  }
}
