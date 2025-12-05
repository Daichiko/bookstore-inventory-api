import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ExchangeRateService } from './exchange-rate.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExchangeResponse } from 'src/common/interface/exchange-response.interface';

@Injectable()
export class ExchangeRateCronService {
  private readonly logger = new Logger(ExchangeRateCronService.name);

  constructor(
    private readonly exchangeRateService: ExchangeRateService,
    private readonly prisma: PrismaService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'fetchRates',
    timeZone: 'UTC',
  })
  async handleCron() {
    this.logger.debug(
      'Iniciando la tarea CRON: Actualización diaria de tasas de cambio...',
    );

    try {
      const apiResponse: ExchangeResponse =
        await this.exchangeRateService.fetchLatestRates();

      await this.saveRatesToDatabase(apiResponse);

      this.logger.debug(
        'Actualización de tasas de cambio completada exitosamente.',
      );
    } catch (error) {
      this.logger.error(
        'Error durante la actualización de tasas de cambio:',
        error.stack,
      );
    }
  }

  private async saveRatesToDatabase(data: ExchangeResponse): Promise<void> {
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

    await this.prisma.$transaction(async (tx) => {
      const batch = await tx.exchangeRateBatch.create({
        data: {
          timeLastUpdateUnix: batchData.time_last_update_unix.toString(),
          timeLastUpdateUtc: new Date(time_last_update_utc),
          timeNextUpdateUnix: batchData.time_next_update_unix.toString(),
          timeNextUpdateUtc: new Date(time_next_update_utc),
          baseCode: batchData.base_code,
        },
      });

      const conversionsData = ratesToInsert.map((rate) => ({
        batchId: batch.id,
        targetCode: rate.targetCode,
        rate: rate.rate,
      }));

      await tx.conversionRate.createMany({
        data: conversionsData,
        skipDuplicates: true,
      });
    });
  }
}
