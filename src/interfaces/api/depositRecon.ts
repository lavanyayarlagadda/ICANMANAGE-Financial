/**
 * Mirrors {@code com.ican.rcm.platform.financials.api.dto.depositrecon.DepositReconTrendsQueryDto}.
 */
export interface DepositReconTrendsQueryParams {
  trailingWindowMonths?: number;
  forecastMonths?: number;
  compare?: string;
  asOfDate?: string;
  fromDate?: string;
  toDate?: string;
}

export interface DepositReconAgingQueryParams {
  fromDate: string;
  toDate: string;
}
