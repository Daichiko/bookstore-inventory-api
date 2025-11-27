import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class IdParamDto {
  @ApiPropertyOptional({
    description: 'ID del libro',
    default: 1,
    required: true,
  })
  @Type(() => Number)
  @Min(1, { message: 'El ID debe ser mayor que 0.' })
  @IsInt({ message: 'El ID debe ser un número entero.' })
  id: number;
}

export class calculatePriceDto {
  @ApiPropertyOptional({
    description: 'Moneda local',
    default: 'VES',
    required: false,
  })
  @IsString({ message: 'La moneda debe ser una cadena de texto.' })
  @IsOptional()
  currency: string;

  @ApiPropertyOptional({
    description: 'Ratio de converion de USD a moneda local',
    default: 250.0,
    required: false,
  })
  @Min(0.0, { message: 'El ratio debe ser mayor que 0.' })
  @IsNumber({}, { message: 'El ratio debe ser un número.' })
  @IsOptional()
  conversion_rate_manual?: number;

  @ApiPropertyOptional({
    description: 'Porcentaje de ganancia de venta',
    default: 0.4,
    required: false,
  })
  @Min(0.01, { message: 'El ratio debe ser mayor que 0.' })
  @IsNumber({}, { message: 'La ganancia debe ser un número.' })
  @IsOptional()
  profit_margin_manual?: number;
}
