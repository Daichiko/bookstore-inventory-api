export interface ExchangeResponse {
  result: 'success' | 'error';
  base_code: string;
  time_last_update_unix: string;
  time_last_update_utc: string;
  time_next_update_unix: string;
  time_next_update_utc: string;
  conversion_rates: {
    [currency: string]: number;
  };
}
