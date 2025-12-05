import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExchangeRateCronService } from './exchange-rate-cron.service';
import { CreateExchangeRateCronDto } from './dto/create-exchange-rate.dto';
import { UpdateExchangeRateCronDto } from './dto/update-exchange-rate-cron.dto';

@Controller('exchange-rate-cron')
export class ExchangeRateCronController {
  constructor(
    private readonly exchangeRateCronService: ExchangeRateCronService,
  ) {}

  @Post()
  create(@Body() createExchangeRateCronDto: CreateExchangeRateCronDto) {
    return this.exchangeRateCronService.create(createExchangeRateCronDto);
  }

  @Get()
  findAll() {
    return this.exchangeRateCronService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exchangeRateCronService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExchangeRateCronDto: UpdateExchangeRateCronDto,
  ) {
    return this.exchangeRateCronService.update(+id, updateExchangeRateCronDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exchangeRateCronService.remove(+id);
  }
}
