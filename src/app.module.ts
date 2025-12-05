import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ExchangeRateCronModule } from './exchange-rate-cron/exchange-rate-cron.module';

@Module({
  imports: [BooksModule, PrismaModule, ScheduleModule.forRoot(), ExchangeRateCronModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
