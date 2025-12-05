import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExchangeRateModule } from 'src/exchange-rate/exchange-rate.module';

@Module({
  imports: [PrismaModule, ExchangeRateModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
