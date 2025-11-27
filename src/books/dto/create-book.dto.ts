import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    description: 'Título del libro. Debe ser único.',
    example: 'El Nombre del Viento',
  })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  title: string;

  @ApiProperty({
    description: 'Nombre completo del autor.',
    example: 'Patrick Rothfuss',
  })
  @IsString({ message: 'El autor debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El autor es obligatorio.' })
  author: string;

  @ApiProperty({
    description: 'Código ISBN-13 único del libro.',
    example: '978-8401347070',
    maxLength: 17,
  })
  @IsString({ message: 'El ISBN debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El ISBN es obligatorio.' })
  isbn: string;

  @ApiProperty({
    description:
      'Costo de adquisición del libro en dólares (USD). Debe ser positivo y acepta hasta 4 decimales.',
    example: 15.99,
  })
  @Min(0.01, {
    message: 'El costo en USD debe ser un valor positivo (mayor que 0).',
  })
  @IsNumber({}, { message: 'El costo en USD debe ser un número.' })
  @IsNotEmpty({ message: 'El costo en USD es obligatorio.' })
  costUsd: number;

  @ApiProperty({
    description:
      'Precio de venta del libro en moneda local. Opcional. Acepta hasta 4 decimales. (OPCIONAL)',
    example: 25.5,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El costo en USD debe ser un número.' })
  sellingPriceLocal?: number;

  @ApiProperty({
    description:
      'Cantidad de unidades en inventario. Debe ser un entero positivo o cero.',
    example: 100,
    minimum: 0,
  })
  @Type(() => Number)
  @Min(0, { message: 'La cantidad no puede ser negativa.' })
  @IsNumber({}, { message: 'La cantidad debe ser un número entero.' })
  stockQuantity: number;

  @ApiProperty({
    description: 'Categoría o género del libro.',
    example: 'Fantasía Épica',
  })
  @IsString({ message: 'La categoría debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La categoría es obligatoria.' })
  category: string;

  @ApiProperty({
    description: 'País proveedor',
    example: 'ES',
  })
  @IsString({ message: 'El país proveedor debe ser una cadena de texto.' })
  supplierCountry: string;
}
