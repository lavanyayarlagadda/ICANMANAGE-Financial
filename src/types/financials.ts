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
  id: string;
  effectiveDate: string;
  type: string;
  description: string;
  sourceProvider: string;
  amount: number;
  openBalance: number | null;
  status: TransactionStatus;
}

export interface ClaimAllocation {
  claimId: string;
  patientName: string;
  allowedAmt: number;
  appliedToPipBalance: number;
}

export interface NpiAllocation {
  npi: string;
  name: string;
  allocatedAmount: number;
  allocatedPercent: number;
  claims: ClaimAllocation[];
}

export interface PipRecord {
  id: string;
  ptan: string;
  paymentDate: string;
  checkEftNumber: string;
  paymentAmount: number;
  suspenseBalance: number;
  status: TransactionStatus;
  npiAllocations: NpiAllocation[];
}

export interface ServiceLine {
  lineNumber: number;
  procedureCode: string;
  modifiers: string;
  revenueCode: string;
  dateOfServiceStart: string;
  dateOfServiceEnd: string;
  units: number;
  chargeAmount: number;
  allowedAmount: number;
  paidAmount: number;
  adjustmentAmount: number;
  adjGroup: string;
  adjReasonCode: string;
  remarkCode: string;
}

export interface RemittanceDetail {
  paymentDate: string;
  checkEftNumber: string;
  paymentAmount: number;
  payerName: string;
  patientName: string;
  patientCtlNo: string;
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
  billedCharge: number;
  expectedAllowed: number;
  actualAllowed: number;
  variance: number;
  reasonCode: string;
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
  reconCheckCount: number;
  unreconCheckCount: number;
  reconAmountPercent: number;
  unreconAmountPercent: number;
  totalAmountPosted: number;
  totalAmountNotPosted: number;
  avgDaysToReconcile: number;
}

export interface ForecastRow {
  metric: string;
  actual: string;
  month1: string;
  month2: string;
  month3: string;
  trend: TrendDirection;
}

export interface TrendsData {
  kpis: KpiCard[];
  teams: TeamPerformance[];
  reconRateTrend: { month: string; rate: number }[];
  avgDaysTrend: { month: string; days: number }[];
  forecast: ForecastRow[];
}

export interface ForwardBalanceRecord {
  id: string;
  payer: string;
  patientName: string;
  claimId: string;
  originalPaymentDate: string;
  forwardedDate: string;
  forwardedAmount: number;
  appliedAmount: number;
  remainingBalance: number;
  status: TransactionStatus;
  aging: string;
}

export interface RecoupmentRecord {
  id: string;
  recoupmentId: string;
  payer: string;
  claimId: string;
  patientName: string;
  originalPaymentAmount: number;
  recoupmentAmount: number;
  recoupmentDate: string;
  reason: string;
  status: TransactionStatus;
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
  transactionType: TransactionType;
  type: string;
  description: string;
  sourceProvider: string;
  amount: number;
  openBalance: number | null;
  status: TransactionStatus;
}

export interface CollectionAccount {
  id: string;
  accountNumber: string;
  patientName: string;
  payer: string;
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

