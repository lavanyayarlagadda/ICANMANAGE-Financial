import {
  PaymentTransaction,
  PipRecord,
  RemittanceDetail,
  VarianceRecord,
  TrendsData,
  ForwardBalanceRecord,
  RecoupmentRecord,
  OtherAdjustmentRecord,
  AllTransaction,
  CollectionAccount,
} from '@/types/financials';

export const mockPayments: PaymentTransaction[] = [
  { id: '1', effectiveDate: '01/25/2026', type: 'PAYMENT', description: 'Claim Payment - MC10677', sourceProvider: 'HOSPICE OF THE SOUTH', amount: 3729.12, openBalance: null, status: 'Posted' },
  { id: '2', effectiveDate: '01/25/2026', type: 'PAYMENT', description: 'EFT Payment - EFT1559917', sourceProvider: 'JM MAC SCHEMES', amount: 4421.92, openBalance: null, status: 'Completed' },
  { id: '3', effectiveDate: '01/24/2026', type: 'PAYMENT', description: 'Claim Payment - MC20451', sourceProvider: 'AETNA MEDICARE', amount: 3200.00, openBalance: null, status: 'Reconciled' },
  { id: '4', effectiveDate: '01/23/2026', type: 'PAYMENT', description: 'PAYMENT - Auto Generated 19', sourceProvider: 'UHC MEDICARE', amount: 1685.88, openBalance: null, status: 'Posted' },
  { id: '5', effectiveDate: '01/23/2026', type: 'PAYMENT', description: 'PAYMENT - Auto Generated 24', sourceProvider: 'MOLINA', amount: 4966.15, openBalance: null, status: 'Needs Review' },
  { id: '6', effectiveDate: '01/20/2026', type: 'PAYMENT', description: 'PAYMENT - Auto Generated 22', sourceProvider: 'BLUE CROSS', amount: 788.94, openBalance: null, status: 'Completed' },
  { id: '7', effectiveDate: '01/19/2026', type: 'PAYMENT', description: 'PAYMENT - Auto Generated 21', sourceProvider: 'AETNA', amount: 1481.38, openBalance: null, status: 'Completed' },
  { id: '8', effectiveDate: '01/14/2026', type: 'PAYMENT', description: 'PAYMENT - Auto Generated 28', sourceProvider: 'CIGNA', amount: 2787.83, openBalance: null, status: 'Reconciled' },
  { id: '9', effectiveDate: '01/10/2026', type: 'PAYMENT', description: 'PAYMENT - Auto Generated 16', sourceProvider: 'MOLINA', amount: 4917.26, openBalance: null, status: 'Posted' },
];

export const mockPipRecords: PipRecord[] = [
  {
    id: 'pip1', ptan: 'PTAN12345', paymentDate: '01/15/2026', checkEftNumber: 'EFT998877', paymentAmount: 150000.00, suspenseBalance: 138648.96, status: 'Completed',
    npiAllocations: [
      { npi: '1987191887', name: 'CRESCENT HOSPICE INC', allocatedAmount: 90000.00, allocatedPercent: 60.00, claims: [
        { claimId: 'MC10677', patientName: 'ELLIS, MARTHA', allowedAmt: 3729.12, appliedToPipBalance: -3729.12 },
        { claimId: '1894716', patientName: 'GRANTHAM, ELISE', allowedAmt: 6999.16, appliedToPipBalance: -4421.92 },
      ]},
      { npi: '1234567890', name: 'SUNCOAST HOSPICE CARE', allocatedAmount: 60000.00, allocatedPercent: 40.00, claims: [
        { claimId: 'MC20451', patientName: 'WILLIAMS, JAMES', allowedAmt: 3850.00, appliedToPipBalance: -3200.00 },
      ]},
    ],
  },
  {
    id: 'pip2', ptan: 'PTAN10030', paymentDate: '12/31/2025', checkEftNumber: 'EFT998830', paymentAmount: 130636.78, suspenseBalance: 88305.27, status: 'Pending Review',
    npiAllocations: [
      { npi: '1000000030', name: 'HOSPICE FACILITY 30', allocatedAmount: 130636.78, allocatedPercent: 100.00, claims: [
        { claimId: 'MC80030', patientName: 'PATIENT, TEST 30', allowedAmt: 42331.51, appliedToPipBalance: -42331.51 },
      ]},
    ],
  },
  { id: 'pip3', ptan: 'PTAN10029', paymentDate: '12/30/2025', checkEftNumber: 'EFT998829', paymentAmount: 192001.70, suspenseBalance: 94564.81, status: 'Completed', npiAllocations: [] },
  { id: 'pip4', ptan: 'PTAN10028', paymentDate: '12/29/2025', checkEftNumber: 'EFT998828', paymentAmount: 194769.70, suspenseBalance: 162505.99, status: 'Completed', npiAllocations: [] },
  { id: 'pip5', ptan: 'PTAN10027', paymentDate: '12/28/2025', checkEftNumber: 'EFT998827', paymentAmount: 103860.80, suspenseBalance: 44188.10, status: 'Completed', npiAllocations: [] },
  { id: 'pip6', ptan: 'PTAN10026', paymentDate: '12/27/2025', checkEftNumber: 'EFT998826', paymentAmount: 144018.34, suspenseBalance: 46807.84, status: 'Completed', npiAllocations: [] },
  { id: 'pip7', ptan: 'PTAN10025', paymentDate: '12/26/2025', checkEftNumber: 'EFT998825', paymentAmount: 158927.08, suspenseBalance: 84226.32, status: 'Pending Review', npiAllocations: [] },
  { id: 'pip8', ptan: 'PTAN10024', paymentDate: '12/25/2025', checkEftNumber: 'EFT998824', paymentAmount: 196723.10, suspenseBalance: 32951.45, status: 'Completed', npiAllocations: [] },
];

export const mockRemittanceDetail: RemittanceDetail = {
  paymentDate: '2026-01-25',
  checkEftNumber: '20232456812400',
  paymentAmount: 0.00,
  payerName: 'DHR',
  patientName: 'ELLIS, MARTHA',
  patientCtlNo: 'MC10677',
  payerIcn: '26851033728800',
  statementPeriod: '2025-07-01 to 2025-07-12',
  claimCharge: 3729.12,
  allowedAmount: 0.00,
  claimPayment: 0.00,
  contractAdj: 0.00,
  adjustmentCodes: 'CO 45',
  remitRemarks: 'N153',
  providerAdjAmount: -125.00,
  providerAdjCodes: 'PI',
  providerName: 'HOSPICE OF THE SOUTH HOLDINGS LLC',
  providerNpi: '1538040900',
  claimStatusCode: '4',
  serviceLines: [
    { lineNumber: 1, procedureCode: '99801', modifiers: 'GW', revenueCode: '0650', dateOfServiceStart: '2025-07-01', dateOfServiceEnd: '2025-07-12', units: 1, chargeAmount: 1243.04, allowedAmount: 0.00, paidAmount: 0.00, adjustmentAmount: 1243.04, adjGroup: 'CO', adjReasonCode: '45', remarkCode: 'N211' },
    { lineNumber: 2, procedureCode: '99802', modifiers: 'OV', revenueCode: '0651', dateOfServiceStart: '2025-07-01', dateOfServiceEnd: '2025-07-12', units: 2, chargeAmount: 1243.04, allowedAmount: 0.00, paidAmount: 0.00, adjustmentAmount: 1243.04, adjGroup: 'PR', adjReasonCode: '253', remarkCode: 'N381' },
    { lineNumber: 3, procedureCode: 'T2042', modifiers: '', revenueCode: '0652', dateOfServiceStart: '2025-07-01', dateOfServiceEnd: '2025-07-12', units: 3, chargeAmount: 1243.04, allowedAmount: 0.00, paidAmount: 0.00, adjustmentAmount: 1243.04, adjGroup: 'OA', adjReasonCode: '97', remarkCode: 'N153' },
  ],
};

export const mockVarianceRecords: VarianceRecord[] = [
  { id: 'v1', claimId: 'MC10677', patientName: 'ELLIS, MARTHA', payer: 'DHR', billedCharge: 3729.12, expectedAllowed: 0.00, actualAllowed: 0.00, variance: 0.00, reasonCode: 'Match' },
  { id: 'v2', claimId: '1894716', patientName: 'GRANTHAM, ELISE', payer: 'JM MAC', billedCharge: 6999.56, expectedAllowed: 7798.33, actualAllowed: 6999.16, variance: -799.17, reasonCode: 'CO 97, CO 45, CO 42.1' },
  { id: 'v3', claimId: '894618', patientName: 'JOHNSON, VERONICA', payer: 'JM MAC', billedCharge: 7406.29, expectedAllowed: 1306.29, actualAllowed: 1306.29, variance: 0.00, reasonCode: 'Match' },
  { id: 'v4', claimId: '1894719', patientName: 'MOORING, RONALD', payer: 'JM MAC', billedCharge: 6524.59, expectedAllowed: 6524.18, actualAllowed: 6524.18, variance: 0.00, reasonCode: 'Match' },
  { id: 'v5', claimId: '1834815', patientName: 'MURRAY, DORIS', payer: 'JM MAC', billedCharge: 5625.50, expectedAllowed: 5983.46, actualAllowed: 5625.50, variance: -357.96, reasonCode: 'CO 97, CO 94, CO 42.1' },
  { id: 'v6', claimId: '1894705', patientName: 'ANDRUS, JEFFREY', payer: 'JM MAC', billedCharge: 5826.88, expectedAllowed: 826.88, actualAllowed: 826.88, variance: 0.00, reasonCode: 'Match' },
  { id: 'v7', claimId: '1894703', patientName: 'BATES, FRANCE', payer: 'JM MAC', billedCharge: 880.96, expectedAllowed: 880.96, actualAllowed: 880.96, variance: 0.00, reasonCode: 'Match' },
  { id: 'v8', claimId: 'MC20451', patientName: 'WILLIAMS, JAMES', payer: 'AETNA MEDICARE', billedCharge: 4200.00, expectedAllowed: 3850.00, actualAllowed: 3850.00, variance: 0.00, reasonCode: 'Match' },
  { id: 'v9', claimId: 'MC20452', patientName: 'THOMPSON, SARAH', payer: 'AETNA MEDICARE', billedCharge: 3100.00, expectedAllowed: 3257.21, actualAllowed: 2900.00, variance: -357.21, reasonCode: 'CO 97, CO 45' },
  { id: 'v10', claimId: 'HM33021', patientName: 'MARTINEZ, ROSA', payer: 'HUMANA', billedCharge: 5620.00, expectedAllowed: 5503.95, actualAllowed: 5100.00, variance: -403.95, reasonCode: 'CO 45, PR 1, PR 2' },
  { id: 'v11', claimId: 'HM33022', patientName: 'CHEN, DAVID', payer: 'HUMANA', billedCharge: 2800.75, expectedAllowed: 2650.00, actualAllowed: 2650.00, variance: 0.00, reasonCode: 'Match' },
  { id: 'v12', claimId: 'CG44501', patientName: 'PATEL, ANITA', payer: 'CIGNA HEALTH', billedCharge: 7800.00, expectedAllowed: 7200.00, actualAllowed: 7200.00, variance: 0.00, reasonCode: 'Match' },
  { id: 'v13', claimId: 'CG44502', patientName: 'JACKSON, ROBERT', payer: 'CIGNA HEALTH', billedCharge: 4500.00, expectedAllowed: 4200.00, actualAllowed: 4200.00, variance: 0.00, reasonCode: 'Match' },
  { id: 'v14', claimId: 'UH55601', patientName: 'DAVIS, MARGARET', payer: 'UNITED', billedCharge: 6200.00, expectedAllowed: 5800.00, actualAllowed: 5800.00, variance: 0.00, reasonCode: 'Match' },
  { id: 'v15', claimId: 'BC86701', patientName: 'TAYLOR, ELIZABETH', payer: 'BLUE CROSS', billedCharge: 5100.00, expectedAllowed: 5157.27, actualAllowed: 4800.00, variance: -357.27, reasonCode: 'CO 45, CO 253' },
];

export const mockTrendsData: TrendsData = {
  kpis: [
    { label: 'Total Checks Processed', value: '434', change: '↑ 12% vs prior month', changeType: 'positive' },
    { label: 'Reconciliation Rate', value: '99.54%', change: '↑ 0.2% vs prior month', changeType: 'positive' },
    { label: 'Total Amount Posted', value: '$9.77M', change: '↑ 8% vs prior month', changeType: 'positive' },
    { label: 'Avg. Days to Reconcile', value: '5.39', change: 'Improved from 6.1 days', changeType: 'positive' },
  ],
  teams: [
    { teamName: 'iCAN / Outsourced RCM', reconCheckPercent: 99.44, unreconCheckPercent: 0.56, reconCheckCount: 355, unreconCheckCount: 2, reconAmountPercent: 99.66, unreconAmountPercent: 0.34, totalAmountPosted: 7989655.36, totalAmountNotPosted: 26872.02, avgDaysToReconcile: 3.73 },
    { teamName: 'Care Hospice / Internal Team', reconCheckPercent: 100.00, unreconCheckPercent: 0.00, reconCheckCount: 79, unreconCheckCount: 0, reconAmountPercent: 100.00, unreconAmountPercent: 0.00, totalAmountPosted: 1776750.57, totalAmountNotPosted: 0.00, avgDaysToReconcile: 13.06 },
  ],
  reconRateTrend: [
    { month: 'Jul', rate: 98.2 }, { month: 'Aug', rate: 98.8 }, { month: 'Sep', rate: 99.1 },
    { month: 'Oct', rate: 98.9 }, { month: 'Nov', rate: 99.3 }, { month: 'Dec', rate: 99.5 },
  ],
  avgDaysTrend: [
    { month: 'Jul', days: 7.0 }, { month: 'Aug', days: 6.5 }, { month: 'Sep', days: 6.1 },
    { month: 'Oct', days: 5.8 }, { month: 'Nov', days: 5.4 }, { month: 'Dec', days: 5.39 },
  ],
  forecast: [
    { metric: 'Reconciliation Rate', actual: '99.54%', month1: '99.62%', month2: '99.68%', month3: '99.72%', trend: 'Improving' },
    { metric: 'Total Checks Processed', actual: '434', month1: '448', month2: '461', month3: '472', trend: 'Growing' },
    { metric: 'Total Amount Posted', actual: '$9,766,405', month1: '$1.01M', month2: '$1.04M', month3: '$1.06M', trend: 'Growing' },
    { metric: 'Avg. Days to Reconcile', actual: '5.39', month1: '5.10', month2: '4.85', month3: '4.62', trend: 'Improving' },
    { metric: 'Unreconciled Amount', actual: '$26,872', month1: '$24,100', month2: '$21,800', month3: '$19,500', trend: 'Decreasing' },
  ],
};

export const mockForwardBalances: ForwardBalanceRecord[] = [
  { id: 'fb1', payer: 'AETNA MEDICARE', patientName: 'WILLIAMS, JAMES', claimId: 'MC20451', originalPaymentDate: '12/15/2025', forwardedDate: '01/05/2026', forwardedAmount: 3200.00, appliedAmount: 1800.00, remainingBalance: 1400.00, status: 'Open', aging: '30-60 days' },
  { id: 'fb2', payer: 'UHC MEDICARE', patientName: 'BROWN, WILLIAM', claimId: 'UH55602', originalPaymentDate: '12/10/2025', forwardedDate: '01/02/2026', forwardedAmount: 5600.00, appliedAmount: 5600.00, remainingBalance: 0.00, status: 'Closed', aging: 'N/A' },
  { id: 'fb3', payer: 'HUMANA', patientName: 'MARTINEZ, ROSA', claimId: 'HM33021', originalPaymentDate: '12/20/2025', forwardedDate: '01/10/2026', forwardedAmount: 2450.00, appliedAmount: 0.00, remainingBalance: 2450.00, status: 'Open', aging: '0-30 days' },
  { id: 'fb4', payer: 'BLUE CROSS', patientName: 'TAYLOR, ELIZABETH', claimId: 'BC86701', originalPaymentDate: '11/28/2025', forwardedDate: '12/15/2025', forwardedAmount: 4800.00, appliedAmount: 3200.00, remainingBalance: 1600.00, status: 'Open', aging: '60-90 days' },
  { id: 'fb5', payer: 'CIGNA HEALTH', patientName: 'PATEL, ANITA', claimId: 'CG44501', originalPaymentDate: '12/18/2025', forwardedDate: '01/08/2026', forwardedAmount: 7200.00, appliedAmount: 7200.00, remainingBalance: 0.00, status: 'Closed', aging: 'N/A' },
  { id: 'fb6', payer: 'MOLINA', patientName: 'GARCIA, CARLOS', claimId: 'ML77201', originalPaymentDate: '12/05/2025', forwardedDate: '12/20/2025', forwardedAmount: 1950.00, appliedAmount: 950.00, remainingBalance: 1000.00, status: 'Open', aging: '30-60 days' },
  { id: 'fb7', payer: 'JM MAC SCHEMES', patientName: 'GRANTHAM, ELISE', claimId: '1894716', originalPaymentDate: '01/15/2026', forwardedDate: '01/20/2026', forwardedAmount: 4421.92, appliedAmount: 0.00, remainingBalance: 4421.92, status: 'Pending Review', aging: '0-30 days' },
  { id: 'fb8', payer: 'UNITED', patientName: 'DAVIS, MARGARET', claimId: 'UH55601', originalPaymentDate: '11/15/2025', forwardedDate: '12/01/2025', forwardedAmount: 5800.00, appliedAmount: 5800.00, remainingBalance: 0.00, status: 'Closed', aging: 'N/A' },
  { id: 'fb9', payer: 'DHR', patientName: 'ELLIS, MARTHA', claimId: 'MC10677', originalPaymentDate: '01/25/2026', forwardedDate: '01/28/2026', forwardedAmount: 3729.12, appliedAmount: 0.00, remainingBalance: 3729.12, status: 'Pending', aging: '0-30 days' },
  { id: 'fb10', payer: 'AETNA', patientName: 'THOMPSON, SARAH', claimId: 'MC20452', originalPaymentDate: '12/22/2025', forwardedDate: '01/05/2026', forwardedAmount: 2900.00, appliedAmount: 2900.00, remainingBalance: 0.00, status: 'Closed', aging: 'N/A' },
];

export const mockRecoupments: RecoupmentRecord[] = [
  { id: 'r1', recoupmentId: 'RCP-2026-001', payer: 'AETNA MEDICARE', claimId: 'MC20451', patientName: 'WILLIAMS, JAMES', originalPaymentAmount: 3200.00, recoupmentAmount: -650.00, recoupmentDate: '01/20/2026', reason: 'Overpayment recovery - duplicate billing', status: 'Recovered' },
  { id: 'r2', recoupmentId: 'RCP-2026-002', payer: 'UHC MEDICARE', claimId: 'UH55602', patientName: 'BROWN, WILLIAM', originalPaymentAmount: 5600.00, recoupmentAmount: -1200.00, recoupmentDate: '01/18/2026', reason: 'Contractual rate adjustment', status: 'Recovered' },
  { id: 'r3', recoupmentId: 'RCP-2026-003', payer: 'HUMANA', claimId: 'HM33021', patientName: 'MARTINEZ, ROSA', originalPaymentAmount: 5100.00, recoupmentAmount: -403.95, recoupmentDate: '01/15/2026', reason: 'Allowed amount correction', status: 'Partial' },
  { id: 'r4', recoupmentId: 'RCP-2026-004', payer: 'BLUE CROSS', claimId: 'BC86701', patientName: 'TAYLOR, ELIZABETH', originalPaymentAmount: 4800.00, recoupmentAmount: -357.27, recoupmentDate: '01/12/2026', reason: 'COB adjustment', status: 'Disputed' },
  { id: 'r5', recoupmentId: 'RCP-2026-005', payer: 'JM MAC SCHEMES', claimId: '1894716', patientName: 'GRANTHAM, ELISE', originalPaymentAmount: 6999.16, recoupmentAmount: -799.17, recoupmentDate: '01/10/2026', reason: 'Medical necessity denial', status: 'Under Review' },
  { id: 'r6', recoupmentId: 'RCP-2025-048', payer: 'CIGNA HEALTH', claimId: 'CG44502', patientName: 'JACKSON, ROBERT', originalPaymentAmount: 4200.00, recoupmentAmount: -500.00, recoupmentDate: '12/28/2025', reason: 'Coding error correction', status: 'Recovered' },
  { id: 'r7', recoupmentId: 'RCP-2025-049', payer: 'MOLINA', claimId: 'ML77201', patientName: 'GARCIA, CARLOS', originalPaymentAmount: 4917.26, recoupmentAmount: -250.00, recoupmentDate: '12/20/2025', reason: 'Late filing penalty', status: 'Written Off' },
  { id: 'r8', recoupmentId: 'RCP-2025-050', payer: 'AETNA', claimId: 'MC20452', patientName: 'THOMPSON, SARAH', originalPaymentAmount: 2900.00, recoupmentAmount: -357.21, recoupmentDate: '12/15/2025', reason: 'Contractual rate difference', status: 'Recovered' },
];

export const mockOtherAdjustments: OtherAdjustmentRecord[] = [
  { id: 'adj1', adjustmentId: 'ADJ-2026-001', effectiveDate: '01/25/2026', type: 'WRITE-OFF', description: 'Bad debt write-off - Patient deceased', sourceProvider: 'HOSPICE OF THE SOUTH', amount: -1250.00, referenceId: 'MC10677', status: 'Approved' },
  { id: 'adj2', adjustmentId: 'ADJ-2026-002', effectiveDate: '01/22/2026', type: 'CREDIT', description: 'Payer credit adjustment', sourceProvider: 'AETNA MEDICARE', amount: 450.00, referenceId: 'MC20451', status: 'Applied' },
  { id: 'adj3', adjustmentId: 'ADJ-2026-003', effectiveDate: '01/20/2026', type: 'INTEREST', description: 'Late payment interest charge', sourceProvider: 'UHC MEDICARE', amount: 85.50, referenceId: 'UH55601', status: 'Posted' },
  { id: 'adj4', adjustmentId: 'ADJ-2026-004', effectiveDate: '01/18/2026', type: 'CONTRACTUAL', description: 'Contractual allowance adjustment', sourceProvider: 'HUMANA', amount: -2100.00, referenceId: 'HM33021', status: 'Applied' },
  { id: 'adj5', adjustmentId: 'ADJ-2026-005', effectiveDate: '01/15/2026', type: 'REFUND', description: 'Patient refund - overpayment', sourceProvider: 'BLUE CROSS', amount: -350.00, referenceId: 'BC86701', status: 'Completed' },
  { id: 'adj6', adjustmentId: 'ADJ-2026-006', effectiveDate: '01/12/2026', type: 'TRANSFER', description: 'Balance transfer to collections', sourceProvider: 'CIGNA HEALTH', amount: -4200.00, referenceId: 'CG44502', status: 'Applied' },
  { id: 'adj7', adjustmentId: 'ADJ-2025-098', effectiveDate: '12/30/2025', type: 'RECLASSIFICATION', description: 'Revenue reclassification', sourceProvider: 'JM MAC SCHEMES', amount: 0.00, referenceId: '1894716', status: 'Reversed' },
  { id: 'adj8', adjustmentId: 'ADJ-2025-099', effectiveDate: '12/28/2025', type: 'CHARITY', description: 'Charity care adjustment', sourceProvider: 'MOLINA', amount: -3500.00, referenceId: 'ML77201', status: 'Approved' },
  { id: 'adj9', adjustmentId: 'ADJ-2025-100', effectiveDate: '12/25/2025', type: 'WRITE-OFF', description: 'Small balance write-off', sourceProvider: 'AETNA', amount: -12.45, referenceId: 'MC20452', status: 'Applied' },
  { id: 'adj10', adjustmentId: 'ADJ-2025-101', effectiveDate: '12/22/2025', type: 'CREDIT', description: 'Insurance credit memo', sourceProvider: 'UNITED', amount: 1800.00, referenceId: 'UH55602', status: 'Needs Review' },
];

export const mockAllTransactions: AllTransaction[] = [
  { id: 'at1', effectiveDate: '01/25/2026', transactionType: 'PAYMENT', type: 'PAYMENT', description: 'Claim Payment - MC10677', sourceProvider: 'HOSPICE OF THE SOUTH', amount: 3729.12, openBalance: null, status: 'Posted' },
  { id: 'at2', effectiveDate: '01/25/2026', transactionType: 'ADJUSTMENT', type: 'WRITE-OFF', description: 'Bad debt write-off - Patient deceased', sourceProvider: 'HOSPICE OF THE SOUTH', amount: -1250.00, openBalance: null, status: 'Approved' },
  { id: 'at3', effectiveDate: '01/25/2026', transactionType: 'PAYMENT', type: 'PAYMENT', description: 'EFT Payment - EFT1559917', sourceProvider: 'JM MAC SCHEMES', amount: 4421.92, openBalance: null, status: 'Completed' },
  { id: 'at4', effectiveDate: '01/24/2026', transactionType: 'PAYMENT', type: 'PAYMENT', description: 'Claim Payment - MC20451', sourceProvider: 'AETNA MEDICARE', amount: 3200.00, openBalance: null, status: 'Reconciled' },
  { id: 'at5', effectiveDate: '01/23/2026', transactionType: 'PAYMENT', type: 'PAYMENT', description: 'PAYMENT - Auto Generated 19', sourceProvider: 'UHC MEDICARE', amount: 1685.88, openBalance: null, status: 'Posted' },
  { id: 'at6', effectiveDate: '01/22/2026', transactionType: 'ADJUSTMENT', type: 'CREDIT', description: 'Payer credit adjustment', sourceProvider: 'AETNA MEDICARE', amount: 450.00, openBalance: null, status: 'Applied' },
  { id: 'at7', effectiveDate: '01/20/2026', transactionType: 'RECOUPMENT', type: 'RECOUPMENT', description: 'Overpayment recovery - MC20451', sourceProvider: 'AETNA MEDICARE', amount: -650.00, openBalance: null, status: 'Recovered' },
  { id: 'at8', effectiveDate: '01/20/2026', transactionType: 'PAYMENT', type: 'PAYMENT', description: 'PAYMENT - Auto Generated 22', sourceProvider: 'BLUE CROSS', amount: 788.94, openBalance: null, status: 'Completed' },
  { id: 'at9', effectiveDate: '01/20/2026', transactionType: 'ADJUSTMENT', type: 'INTEREST', description: 'Late payment interest charge', sourceProvider: 'UHC MEDICARE', amount: 85.50, openBalance: null, status: 'Posted' },
  { id: 'at10', effectiveDate: '01/19/2026', transactionType: 'PAYMENT', type: 'PAYMENT', description: 'PAYMENT - Auto Generated 21', sourceProvider: 'AETNA', amount: 1481.38, openBalance: null, status: 'Completed' },
  { id: 'at11', effectiveDate: '01/18/2026', transactionType: 'RECOUPMENT', type: 'RECOUPMENT', description: 'Contractual rate adjustment - UH55602', sourceProvider: 'UHC MEDICARE', amount: -1200.00, openBalance: null, status: 'Recovered' },
  { id: 'at12', effectiveDate: '01/18/2026', transactionType: 'ADJUSTMENT', type: 'CONTRACTUAL', description: 'Contractual allowance adjustment', sourceProvider: 'HUMANA', amount: -2100.00, openBalance: null, status: 'Applied' },
  { id: 'at13', effectiveDate: '01/15/2026', transactionType: 'FORWARD_BALANCE', type: 'FWD BAL', description: 'Forward balance - EFT998877', sourceProvider: 'CRESCENT HOSPICE INC', amount: 3729.12, openBalance: 3729.12, status: 'Pending' },
  { id: 'at14', effectiveDate: '01/14/2026', transactionType: 'PAYMENT', type: 'PAYMENT', description: 'PAYMENT - Auto Generated 28', sourceProvider: 'CIGNA', amount: 2787.83, openBalance: null, status: 'Reconciled' },
  { id: 'at15', effectiveDate: '01/12/2026', transactionType: 'RECOUPMENT', type: 'RECOUPMENT', description: 'COB adjustment - BC86701', sourceProvider: 'BLUE CROSS', amount: -357.27, openBalance: null, status: 'Disputed' },
  { id: 'at16', effectiveDate: '01/10/2026', transactionType: 'PAYMENT', type: 'PAYMENT', description: 'PAYMENT - Auto Generated 16', sourceProvider: 'MOLINA', amount: 4917.26, openBalance: null, status: 'Posted' },
  { id: 'at17', effectiveDate: '01/10/2026', transactionType: 'FORWARD_BALANCE', type: 'FWD BAL', description: 'Forward balance - HM33021', sourceProvider: 'HUMANA', amount: 2450.00, openBalance: 2450.00, status: 'Open' },
  { id: 'at18', effectiveDate: '01/05/2026', transactionType: 'FORWARD_BALANCE', type: 'FWD BAL', description: 'Forward balance - MC20451', sourceProvider: 'AETNA MEDICARE', amount: 3200.00, openBalance: 1400.00, status: 'Open' },
];

export const mockCollections: CollectionAccount[] = [
  { id: 'c1', accountNumber: 'COL-2026-0001', patientName: 'HARRIS, MICHAEL', payer: 'AETNA MEDICARE', totalDue: 12500.00, amountCollected: 4200.00, balance: 8300.00, lastActivityDate: '01/25/2026', assignedTo: 'Team Alpha', status: 'Open', aging: '30-60 days', priority: 'High' },
  { id: 'c2', accountNumber: 'COL-2026-0002', patientName: 'CLARK, JENNIFER', payer: 'UHC MEDICARE', totalDue: 8750.00, amountCollected: 8750.00, balance: 0.00, lastActivityDate: '01/22/2026', assignedTo: 'Team Beta', status: 'Closed', aging: 'N/A', priority: 'Low' },
  { id: 'c3', accountNumber: 'COL-2026-0003', patientName: 'LEWIS, PATRICIA', payer: 'HUMANA', totalDue: 15200.00, amountCollected: 6800.00, balance: 8400.00, lastActivityDate: '01/20/2026', assignedTo: 'Team Alpha', status: 'Open', aging: '60-90 days', priority: 'High' },
  { id: 'c4', accountNumber: 'COL-2026-0004', patientName: 'ROBINSON, CHARLES', payer: 'BLUE CROSS', totalDue: 5400.00, amountCollected: 2700.00, balance: 2700.00, lastActivityDate: '01/18/2026', assignedTo: 'Team Gamma', status: 'Open', aging: '0-30 days', priority: 'Medium' },
  { id: 'c5', accountNumber: 'COL-2025-0098', patientName: 'WALKER, DONNA', payer: 'CIGNA HEALTH', totalDue: 22000.00, amountCollected: 15000.00, balance: 7000.00, lastActivityDate: '01/15/2026', assignedTo: 'Team Beta', status: 'Open', aging: '90-120 days', priority: 'High' },
  { id: 'c6', accountNumber: 'COL-2025-0099', patientName: 'YOUNG, THOMAS', payer: 'MOLINA', totalDue: 3200.00, amountCollected: 3200.00, balance: 0.00, lastActivityDate: '01/10/2026', assignedTo: 'Team Alpha', status: 'Closed', aging: 'N/A', priority: 'Low' },
  { id: 'c7', accountNumber: 'COL-2025-0100', patientName: 'KING, SUSAN', payer: 'UNITED', totalDue: 9800.00, amountCollected: 4500.00, balance: 5300.00, lastActivityDate: '01/08/2026', assignedTo: 'Team Gamma', status: 'Needs Review', aging: '30-60 days', priority: 'Medium' },
  { id: 'c8', accountNumber: 'COL-2025-0101', patientName: 'WRIGHT, ROBERT', payer: 'AETNA', totalDue: 6300.00, amountCollected: 0.00, balance: 6300.00, lastActivityDate: '01/05/2026', assignedTo: 'Team Alpha', status: 'Open', aging: '120+ days', priority: 'High' },
];
