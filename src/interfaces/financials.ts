export type TransactionStatus =
  | 'Posted'
  | 'Completed'
  | 'Reconciled'
  | 'Needs Review'
  | 'Pending Review'
  | 'Open'
  | 'Closed'
  | 'Approved'
  | 'Disputed'
  | 'Pending'
  | 'Recovered'
  | 'Partial'
  | 'Written Off'
  | 'Applied'
  | 'Reversed'
  | 'Under Review';

export type TrendDirection = 'Improving' | 'Growing' | 'Decreasing' | 'Stable';

export type TransactionType = 'PAYMENT' | 'RECOUPMENT' | 'FORWARD_BALANCE' | 'ADJUSTMENT' | 'PIP';

export interface PaymentTransaction {
  id?: string;
  effectiveDate?: string;
  type?: string;
  transactionNo?: string;
  payer?: string;
  description?: string;
  amount?: number;
  openBalance?: number | null;
  status?: TransactionStatus;
}

export interface ClaimAllocation {
  claimId: string;
  patientName: string;
  allowedAmt: string | number;
  appliedToPipBalance: string | number;
}

export interface NpiAllocation {
  npiPayerName: string;
  totalPayment: string | number;
  allocatedPercent: number | null;
  claims: ClaimAllocation[];
}

export interface PipRecord {
  id?: string;
  ptan: string;
  paymentDate: string;
  checkEftNumber: string;
  paymentAmount: string | number;
  suspenseBalance: string | number;
  status: TransactionStatus;
  npiDetails: NpiAllocation[];
}

export interface ServiceLine {
  lineNo: number;
  procCode: string;
  modifiers: string;
  revCode: string;
  dosStart: string;
  dosEnd: string;
  units: number;
  charge: number;
  allowed: number;
  paid: number;
  adjAmt: number;
  adjGrp: string;
  reason: string;
  remark: string;
}

export interface RemittanceDetail {
  paymentDate: string;
  transactionNo: string;
  paymentAmount: number;
  payerName: string;
  patientName: string;
  patientCtlNo: string;
  patientCtrlNo?: string;
  payerIcn: string;
  statementPeriod: string;
  claimCharge: number;
  allowedAmount: number;
  claimPayment: number;
  contractAdj: number;
  adjustmentCodes: string;
  remitRemarks: string;
  providerAdjAmount: number;
  providerAdjCodes: string;
  providerName: string;
  providerNpi: string;
  claimStatusCode: string;
  serviceLines: ServiceLine[];
}

export interface VarianceRecord {
  id: string;
  claimId: string;
  patientName: string;
  payer: string;
  paymentDate: string;
  billedCharge: number;
  expectedAllowed: number;
  actualAllowed: number;
  variance: number;
  reasonCode: string;
  adjustmentCodes: string;
}


export interface KpiCard {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}

export interface TeamPerformance {
  teamName: string;
  reconCheckPercent: number;
  unreconCheckPercent: number;
  checkCountPercentByTeam: number;
  reconCheckCount: number;
  unreconCheckCount: number;
  reconAmountPercent: number;
  unreconAmountPercent: number;
  amountPercentByTeam: number;
  totalAmountPosted: number;
  totalAmountNotPosted: number;
  avgDaysToReconcile: number;
}



export interface PayerPerformanceRecord {
  id: string;
  payerName: string;
  description?: string;
  volume: number;
  depositCount: number;
  matchRate: number;
  denialRate: number;
  suspenseRate: number;
  avgDaysToSettle: number;
  totalVariance: number;
  status: 'Critical' | 'Stable' | 'Improving' | 'Growing' | 'Decreasing';
}

export interface TrendsData {
  kpis: KpiCard[];
  teams: TeamPerformance[];
  reconRateTrend: { month: string; rate: number }[];
  avgDaysTrend: { month: string; days: number }[];
  payerPerformance: PayerPerformanceRecord[];
}


export interface RecoupmentRecord {
  id: string;
  recoupmentId: string;
  payer: string;
  claimId: string;
  claimPatient: string;
  originalPaymentAmount: number;
  recoupmentAmount: number;
  recoupmentDate: string;
  reason: string;
  description?: string;
  status: TransactionStatus;
  transactionNo?: string;
}

export interface OtherAdjustmentRecord {
  id: string;
  adjustmentId: string;
  effectiveDate: string;
  type: string;
  description: string;
  sourceProvider: string;
  amount: number;
  referenceId: string;
  status: TransactionStatus;
}

export interface AllTransaction {
  id: string;
  effectiveDate: string;
  category: TransactionType;
  type: string;
  description: string;
  sourceProvider: string;
  amount: number;
  openBalance: number | null;
  status: TransactionStatus;
  transactionNo?: string;
}

export interface CollectionAccount {
  id: string;
  accountNumber: string;
  patientName: string;
  payer: string;
  description?: string;
  totalDue: number;
  amountCollected: number;
  balance: number;
  lastActivityDate: string;
  assignedTo: string;
  status: TransactionStatus;
  aging: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface RemittanceAdviceItem {
  reference: string;
  amount: number;
}

export interface PostingApplicationItem {
  system: string;
  reference: string;
  amount: number;
  status: 'Posted' | 'Partially Posted' | 'Review Required' | 'Pending';
  date: string;
}

export interface BankDepositItem {
  id: string;
  reference: string;
  date: string;
  payerName: string;
  description?: string;
  bankAmt: number;
  remitAmt: number;
  variance: number;
  status: 'Matched' | 'Exception';
  remittanceAdvice: RemittanceAdviceItem[];
  postingApplication: PostingApplicationItem[];
}

export interface BankDepositEntity {
  id: string;
  name: string;
  items: BankDepositItem[];
}

export interface OffsetClaim {
  claimId: string;
  patientName: string;
  deductedAmount: number;
}

export interface OffsetEvent {
  eftNumber: string;
  date: string;
  amount: number;
  code: string;
  claims: OffsetClaim[];
}

export interface ForwardBalanceNotice {
  id: string;
  noticeId: string;
  notificationDate: string;
  providerName: string;
  npi: string;
  description?: string;
  originalAmount: number;
  remainingBalance: number;
  status: TransactionStatus;
  offsets: OffsetEvent[];
}

export interface FeeScheduleVariance {
  id?: string;
  paymentDate: string;
  patientName: string;
  payerName?: string;
  description?: string;
  expectedAllowed: string | number;
  actualAllowed: string | number;
  variance: string | number;
  adjustmentCode?: string;
  claimId?: string;
  transactionNo?: string;
}

export interface PaymentVariance {
  id?: string;
  paymentDate?: string;
  patientName: string;
  payerName?: string;
  description?: string;
  expectedAllowed: string | number;
  actualAllowed: string | number;
  variance: string | number;
  adjustmentCode?: string;
  claimId?: string;
  transactionNo?: string;
}

export interface FeeScheduleVarianceSummary {
  totalExpected: number;
  totalActualAllowed: number;
  totalLeakage: number;
}

export interface PaymentVarianceSummary {
  totalExpected: number;
  totalActualPaid: number;
  totalLeakage: number;
}

export type DialogData =
  | RecoupmentRecord
  | OtherAdjustmentRecord
  | CollectionAccount
  | AllTransaction
  | PaymentTransaction;

export interface ReconciliationRow {
  id: string;
  transactionNo: string;
  transactionType: string;
  batchOwner: string;
  accountName: string;
  payor: string;
  depositDate: string;
  bankDeposit: number;
  remittance: number;
  amd: number;
  nextGenCore: number;
  nextGenPcsd: number;
  legacy: number;
  gl: number;
  unapplied: number;
  variance: number;
  status: string;
  complexStatus: string[];
  location: string;
  isEdited?: boolean;
  comment?: string;
  description?: string;
  reconcileDate?: string;
}


