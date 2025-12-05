import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ExchangeRateModule } from './exchange-rate/exchange-rate.module';

@Module({
  imports: [
    BooksModule,
    PrismaModule,
    ScheduleModule.forRoot(),
    ExchangeRateModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
