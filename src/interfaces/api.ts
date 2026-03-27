import { 
  PaymentTransaction, 
  CollectionAccount, 
  BankDepositEntity, 
  PipRecord, 
  RemittanceDetail, 
  ServiceLine, 
  FeeScheduleVariance, 
  PaymentVariance, 
  FeeScheduleVarianceSummary, 
  PaymentVarianceSummary, 
  PayerPerformanceRecord 
} from './financials';

export interface PaymentSearchRequest {
  page: number;
  size: number;
  sort: string;
  desc: boolean;
  status: string | null;
  fromDate: string;
  toDate: string;
}

export interface PaymentSearchResponse {
  data: {
    content: PaymentTransaction[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
}

export interface PipSearchRequest {
  page: number;
  size: number;
  sort: string;
  desc: boolean;
  fromDate: string;
  toDate: string;
}

export interface PipSearchResponse {
  data: {
    content: PipRecord[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
}

export interface ServiceLineSearchRequest {
  page: number;
  size: number;
  sort: string;
  desc: boolean;
  check: string;
}

export interface ServiceLineSearchResponse {
  data: {
    content: ServiceLine[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
}

export interface FeeScheduleVarianceDetailsResponse {
  data: {
    content: FeeScheduleVariance[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
}

export interface PaymentVarianceDetailsResponse {
  data: {
    content: PaymentVariance[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
}

export interface FeeScheduleVarianceSummaryResponse {
  data: FeeScheduleVarianceSummary;
}

export interface PaymentVarianceSummaryResponse {
  data: PaymentVarianceSummary;
}

export interface DateRangeParams {
  fromDate: string;
  toDate: string;
}

export interface PipSummaryResponse {
  data: {
    totalPaidAmount: number;
    totalSuspenseBalance: number;
    actionRequired: number;
  };
  message: string | null;
}

export interface ForecastSummaryResponse {
  data: {
    totalAmountReconciled: number;
    totalAmountUnreconciled: number;
    globalReconciliationRate: number;
    avgDaysToReconcile: number;
  };
  message: string | null;
}

export interface ReconciliationPerformanceResponse {
  data: {
    month: string;
    actualReconciledAmount: string | null;
    forecastAmount: string | null;
  }[];
  message: string | null;
}

export interface ForecastDashboardResponse {
  data: {
    team: string;
    reconciledCheckCountPct: string;
    unreconciledCheckCountPct: string;
    checkCountPctByTeam: string;
    reconciledCheckCount: string;
    unreconciledCheckCount: string;
    reconciledAmountPct: string;
    unreconciledAmountPct: string;
    amountPctByTeam: string;
    totalAmountPosted: string;
    totalAmountNotPosted: string;
    avgDaysToReconcile: string | null;
  }[];
  message: string | null;
}

export interface ExecutiveSummaryResponse {
  data: {
    totalCollectionsMtd: number;
    collectionsSubtext: string;
    reconciliationRate: number;
    reconSubtext: string;
    openSuspense: number;
    suspenseSubtext: string;
    avgDaysToReconcile: number;
    avgDaysSubtext: string;
  };
  message: string | null;
}

export interface PaymentMixResponse {
  data: {
    eftCount: number;
    otherCount: number;
  };
  message: string | null;
}

export interface AdjustmentBreakdownResponse {
  data: {
    denialCount: number;
    patientRespCount: number;
    contractualCount: number;
    otherAdjCount: number;
  };
  message: string | null;
}

export interface PayerPerformanceResponse {
  data: PayerPerformanceRecord[];
  message: string | null;
}
