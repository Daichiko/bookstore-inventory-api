export interface ExchangeRateBatch {
  id: number;

  result: string;
  timeLastUpdateUnix: string;
  timeLastUpdateUtc: Date;
  timeNextUpdateUnix: string;
  timeNextUpdateUtc: Date;

  baseCode: string;

  createdAt: Date;

  conversionRates?: ConversionRate[];
}

export interface ConversionRate {
  id: number;

  batchId: number;

  targetCode: string;
  rate: number;

  createdAt: Date;
}
