import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExchangeRateService } from './exchange-rate.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ExchangeRateCronService {
  private readonly logger = new Logger(ExchangeRateCronService.name);

  constructor(
    private readonly exchangeRateService: ExchangeRateService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'fetchRates',
    timeZone: 'UTC', // Es mejor usar UTC para evitar problemas con cambios de horario
  })
  async handleCron() {
    this.logger.log(
      'Iniciando la tarea CRON: Actualización diaria de tasas de cambio...',
    );

    try {
      // 1. Obtener datos de la API
      const apiResponse = await this.exchangeRateService.fetchLatestRates();

      // 2. Insertar en la base de datos (Usando una Transacción)
      await this.saveRatesToDatabase(apiResponse);

      this.logger.log(
        'Actualización de tasas de cambio completada exitosamente.',
      );
    } catch (error) {
      this.logger.error(
        'Error durante la actualización de tasas de cambio:',
        error.stack,
      );
    }
  }

  private async saveRatesToDatabase(data: any): Promise<void> {
    const {
      conversion_rates,
      time_last_update_utc,
      time_next_update_utc,
      ...batchData
    } = data;

    const ratesToInsert = Object.keys(conversion_rates).map((currencyCode) => ({
      targetCode: currencyCode,
      rate: conversion_rates[currencyCode].toString(),
    }));

    // Inicia una transacción para asegurar que el Batch y las Conversiones se guarden juntos
    await this.prisma.$transaction(async (tx) => {
      // 1. Insertar el Batch (Modelo Padre)
      const batch = await tx.exchangeRateBatch.create({
        data: {
          result: batchData.result,
          timeLastUpdateUnix: BigInt(batchData.time_last_update_unix),
          timeLastUpdateUtc: new Date(time_last_update_utc),
          timeNextUpdateUnix: BigInt(batchData.time_next_update_unix),
          timeNextUpdateUtc: new Date(time_next_update_utc),
          baseCode: batchData.base_code,
        },
      });

      // 2. Insertar las tasas de conversión (Modelos Hijos)
      // Mapea y conecta las tasas al ID del batch
      const conversionsData = ratesToInsert.map((rate) => ({
        batchId: batch.id,
        targetCode: rate.targetCode,
        rate: rate.rate, // Asegúrate de que esto sea un string para el tipo Decimal
      }));

      await tx.conversionRate.createMany({
        data: conversionsData,
        skipDuplicates: true, // Opcional, si quieres ignorar duplicados
      });
    });
  }
}
