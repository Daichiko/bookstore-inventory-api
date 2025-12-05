export interface ExchangeRateBatch {
  id: number;

  result: string;
  timeLastUpdateUnix: bigint;
  timeLastUpdateUtc: Date;
  timeNextUpdateUnix: bigint;
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
