import { Module } from '@nestjs/common';
import { ExchangeRateCronService } from './exchange-rate-cron.service';
import { ExchangeRateService } from './exchange-rate.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ExchangeRateCronService, ExchangeRateService],
  exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
