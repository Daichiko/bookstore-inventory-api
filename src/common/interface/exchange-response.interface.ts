export interface ExchangeResponse {
  result: 'success' | 'error';
  base_code: string;
  time_last_update_utc: string;
  conversion_rates: {
    [currency: string]: number;
  };
}
