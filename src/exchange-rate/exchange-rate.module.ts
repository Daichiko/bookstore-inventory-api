import { Module } from '@nestjs/common';
import { ExchangeRateCronService } from './exchange-rate-cron.service';
import { ExchangeRateCronController } from './exchange-rate.controller';
import { ExchangeRateService } from './exchange-rate.service';

@Module({
  controllers: [ExchangeRateCronController],
  providers: [ExchangeRateCronService, ExchangeRateService],
})
export class ExchangeRateCronModule {}
