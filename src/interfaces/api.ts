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
  PayerPerformanceRecord,
  RecoupmentRecord,
  OtherAdjustmentRecord,
  AllTransaction,
  ForwardBalanceNotice,
  BankDepositItem
} from './financials';

export type {
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
  PayerPerformanceRecord,
  RecoupmentRecord,
  OtherAdjustmentRecord,
  AllTransaction,
  ForwardBalanceNotice,
  BankDepositItem
};

export type RawRemittanceClaimsResponse =
  | RemittanceDetail
  | { data: RemittanceDetail[] }
  | RemittanceDetail[];

export type RemittanceClaimsResponse = RemittanceDetail[];

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
  status?: string | null;
  category?: string | null;
  type?: string | null;
  payer?: string | null;
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
  data: {
    content: PayerPerformanceRecord[];
    page: number;
    size: number;
    totalElements: number;
  };
  message: string | null;
}
export interface AllTransactionSearchResponse {
  data: {
    content: AllTransaction[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
}

export interface RecoupmentSearchResponse {
  data: {
    content: RecoupmentRecord[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
}

export interface OtherAdjustmentSearchResponse {
  data: {
    content: OtherAdjustmentRecord[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
}

export interface BankDepositSearchRequest {
  startDate: string;
  endDate: string;
  payerList: string[];
  stateList: string[];
  transactionNo: string;
  transactionsList: string[];
  accountList: string[];
  stateId: number;
  batchOwnerIds: string[];
  icanManageId: number | string;
  pageNumber: number;
  pageSize: number;
  sort: string;
  desc: boolean;
  clientName: string;
  statusList: string[];
}

export interface BankDepositResponse {
  data: BankDepositItem[];
}

export interface BankDepositWidgetResponse {
  data: {
    totalRecords: number;
    totalBaiAmount: number;
    reconciledRecords: number;
    reconciledBaiAmount: number;
    nonReconciledRecords: number;
    nonReconciledBaiAmount: number;
    actionRequiredCount: number;
    reconciliationRatePercentage: number;
  };
  message: string | null;
}

export type BankDepositSearchResponse = BankDepositItem[];

export interface ForwardBalanceNoticeSearchResponse {
  data: {
    content: ForwardBalanceNotice[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }
}

// Reusing PipSearchRequest for simple table searches
export type TableSearchRequest = PipSearchRequest;

export interface SuspenseAccountSearchResponse {
  data: {
    summary: {
      totalOpenSuspense: number;
      openItems: number;
      oldestItemAgeDays: number;
      oldestItemNote: string;
      avgDaysInSuspense: number;
      avgDaysLabel: string;
      atRiskCount: number;
      atRiskLabel: string;
    };
    periods: string[];
    rows: {
      id: string;
      accountType: string;
      items: number;
      balances: Record<string, number | null>;
      totalBalance: number;
    }[];
    page: number;
    size: number;
    totalElements: number;
  }
}


export interface TableQueryParams {
  page: number;
  size: number;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  fromDate: string;
  toDate: string;
  status?: string | null;
  category?: string | null;
  type?: string | null;
  payer?: string | null;
  sourceProvider?: string | null;
}

export interface PaymentQueryParams extends TableQueryParams {
  status: string | null;
}

export interface PaymentPostingStatus {
  postingStatusMasterId: number;
  postingStatus: string;
}

export interface PaymentStatusResponse {
  data: PaymentPostingStatus[];
  message: string | null;
}

export interface DynamicColumn {
  displayName: string;
  active?: boolean;
  orderId?: number;
  fkConfigurableFieldsId?: number | null;
  fkHospitalId?: number | null;
}

export interface MappedHeadersResponse {
  data: DynamicColumn[];
  message: string | null;
}

export interface DynamicTab {
  fkHospitalMasterId: number;
  hospitalAbbr: string;
  hospitalName: string;
  active?: boolean;
  orderId?: number;
}

export interface DynamicTabsResponse {
  data: DynamicTab[];
  message: string | null;
}
