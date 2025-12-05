import { HttpException, Injectable } from '@nestjs/common';
import { api_exchange_url } from 'src/common/config/config';
import { solicitudGet } from 'src/common/helpers/consultasExternas';
import { ExchangeResponse } from 'src/common/interface/exchange-response.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExchangeRateService {
  constructor(private readonly prisma: PrismaService) {}

  async fetchLatestRates(): Promise<any> {
    if (!api_exchange_url) {
      throw new Error('La URL de la API de intercambio no está configurada.');
    }

    try {
      const data = await solicitudGet<ExchangeResponse>({
        url: api_exchange_url,
      });

      return data;
    } catch (error) {
      console.error('Error al obtener las tasas de cambio:', error);
      throw new HttpException(
        'Error al obtener las tasas de cambio desde la API externa.',
        500,
      );
    }
  }

  async getLatestBatch(): Promise<any> {
    try {
      const latestBatch = await this.prisma.exchangeRateBatch.findFirst({
        orderBy: { timeLastUpdateUnix: 'desc' },
        include: { conversionRates: true },
        take: 1,
      });

      return latestBatch;
    } catch (error) {
      console.error(
        'Error al obtener el último batch de tasas de cambio:',
        error,
      );
      throw new HttpException(
        'Error al obtener el último batch de tasas de cambio.',
        500,
      );
    }
  }
}
