import {
  PaymentTransaction,
  PipRecord,
  RemittanceDetail,
  VarianceRecord,
  TrendsData,
  RecoupmentRecord,
  OtherAdjustmentRecord,
  AllTransaction,
  CollectionAccount,
  BankDepositEntity,
  ForwardBalanceNotice,
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
    "id": "pip0",
    "ptan": "11-1513",
    "paymentDate": "2026-01-30",
    "checkEftNumber": "eft2342793, remit01947",
    "paymentAmount": "3859527.00",
    "suspenseBalance": "-269264.37",
    "status": "Applied",
    "npiDetails": [
      {
        "npiPayerName": "1821077017 - jm mac sc/hhh-palmetto gba #11001",
        "totalPayment": "4128791.37",
        "allocatedPercent": null,
        "claims": [
          {
            "claimId": "1410527",
            "patientName": "glenda mathis",
            "allowedAmt": "4633.28",
            "appliedToPipBalance": "5206.71"
          },
          {
            "claimId": "1428749",
            "patientName": "marie h steier",
            "allowedAmt": "4819.30",
            "appliedToPipBalance": "7556.20"
          }
        ]
      }
    ]
  },
  {
    id: 'pip1', ptan: 'PTAN12345', paymentDate: '01/15/2026', checkEftNumber: 'EFT998877', paymentAmount: '150000.00', suspenseBalance: '138648.96', status: 'Posted',
    npiDetails: [
      { npiPayerName: '1987191887 - CRESCENT HOSPICE INC', totalPayment: '90000.00', allocatedPercent: 60.00, claims: [
          { claimId: 'MC10677', patientName: 'ELLIS, MARTHA', allowedAmt: '3729.12', appliedToPipBalance: '3729.12' },
          { claimId: '1894716', patientName: 'GRANTHAM, ELISE', allowedAmt: '6999.16', appliedToPipBalance: '4421.92' },
      ]},
      { npiPayerName: '1234567890 - SUNCOAST HOSPICE CARE', totalPayment: '60000.00', allocatedPercent: 40.00, claims: [
          { claimId: 'MC20451', patientName: 'WILLIAMS, JAMES', allowedAmt: '3850.00', appliedToPipBalance: '3200.00' },
      ]},
    ],
  },
  {
    id: 'pip2', ptan: 'PTAN10030', paymentDate: '12/31/2025', checkEftNumber: 'EFT998830', paymentAmount: '130636.78', suspenseBalance: '88305.27', status: 'Pending Review',
    npiDetails: [
      { npiPayerName: '1000000030 - HOSPICE FACILITY 30', totalPayment: '130636.78', allocatedPercent: 100.00, claims: [
        { claimId: 'MC80030', patientName: 'PATIENT, TEST 30', allowedAmt: '42331.51', appliedToPipBalance: '42331.51' },
      ]},
    ],
  },
  { id: 'pip3', ptan: 'PTAN10029', paymentDate: '12/30/2025', checkEftNumber: 'EFT998829', paymentAmount: '192001.70', suspenseBalance: '94564.81', status: 'Posted', npiDetails: [] },
  { id: 'pip4', ptan: 'PTAN10028', paymentDate: '12/29/2025', checkEftNumber: 'EFT998828', paymentAmount: '194769.70', suspenseBalance: '162505.99', status: 'Posted', npiDetails: [] },
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
    { lineNo: 1, procCode: '99801', modifiers: 'GW', revCode: '0650', dosStart: '2025-07-01', dosEnd: '2025-07-12', units: 1, charge: 1243.04, allowed: 0.00, paid: 0.00, adjAmt: 1243.04, adjGrp: 'CO', reason: '45', remark: 'N211' },
    { lineNo: 2, procCode: '99802', modifiers: 'OV', revCode: '0651', dosStart: '2025-07-01', dosEnd: '2025-07-12', units: 2, charge: 1243.04, allowed: 0.00, paid: 0.00, adjAmt: 1243.04, adjGrp: 'PR', reason: '253', remark: 'N381' },
    { lineNo: 3, procCode: 'T2042', modifiers: '', revCode: '0652', dosStart: '2025-07-01', dosEnd: '2025-07-12', units: 3, charge: 1243.04, allowed: 0.00, paid: 0.00, adjAmt: 1243.04, adjGrp: 'OA', reason: '97', remark: 'N153' },
  ],
};

export const mockVarianceRecords: VarianceRecord[] = [
  { 
    id: 'v1', 
    claimId: 'CLM-001', 
    patientName: 'PATIENT, R17', 
    payer: 'Evergreen Medical Center', 
    paymentDate: '2026-03-11', 
    billedCharge: 3647.57, 
    expectedAllowed: 3647.57, 
    actualAllowed: 3647.57, 
    variance: 0.00, 
    reasonCode: 'Match', 
    adjustmentCodes: 'CO 45' 
  },
  { 
    id: 'v2', 
    claimId: 'CLM-002', 
    patientName: 'PATIENT, W100', 
    payer: 'Canyon Creek Medical', 
    paymentDate: '2026-03-10', 
    billedCharge: 1963.22, 
    expectedAllowed: 1963.22, 
    actualAllowed: 1963.22, 
    variance: 0.00, 
    reasonCode: 'Match', 
    adjustmentCodes: 'CO 45' 
  },
  { 
    id: 'v3', 
    claimId: 'CLM-003', 
    patientName: 'PATIENT, F57', 
    payer: 'Pinecrest Medical Group', 
    paymentDate: '2026-03-06', 
    billedCharge: 2512.72, 
    expectedAllowed: 2512.72, 
    actualAllowed: 2309.85, 
    variance: 202.87, 
    reasonCode: 'Variance', 
    adjustmentCodes: 'CO 45' 
  },
  { 
    id: 'v4', 
    claimId: 'CLM-004', 
    patientName: 'PATIENT, S18', 
    payer: 'Summit Health Systems', 
    paymentDate: '2026-03-06', 
    billedCharge: 2935.14, 
    expectedAllowed: 2935.14, 
    actualAllowed: 2935.14, 
    variance: 0.00, 
    reasonCode: 'Match', 
    adjustmentCodes: 'CO 45' 
  },
];


export const mockTrendsData: TrendsData = {
  kpis: [
    { label: 'TOTAL AMOUNT RECONCILED', value: '$9,766,405.93', change: '↑ 8% vs prior month', changeType: 'positive' },
    { label: 'GLOBAL RECONCILIATION RATE', value: '99.73%', change: '↑ 0.2% vs prior month', changeType: 'positive' },
    { label: 'TOTAL AMOUNT UNRECONCILED', value: '$26,872.02', change: '↓ 15% vs prior month', changeType: 'positive' },
    { label: 'AVG DAYS TO RECONCILE', value: '5.39', change: 'Improved from 6.1 days', changeType: 'positive' },
  ],
  teams: [
    { 
      teamName: 'iCAN', 
      reconCheckPercent: 99.44, 
      unreconCheckPercent: 0.56, 
      checkCountPercentByTeam: 82.18,
      reconCheckCount: 355, 
      unreconCheckCount: 2, 
      reconAmountPercent: 99.66, 
      unreconAmountPercent: 0.34, 
      amountPercentByTeam: 81.81,
      totalAmountPosted: 7989655.36, 
      totalAmountNotPosted: 26872.02, 
      avgDaysToReconcile: 3.73 
    },
    { 
      teamName: 'Apex Health Systems', 
      reconCheckPercent: 100.00, 
      unreconCheckPercent: 0.00, 
      checkCountPercentByTeam: 17.82,
      reconCheckCount: 77, 
      unreconCheckCount: 0, 
      reconAmountPercent: 100.00, 
      unreconAmountPercent: 0.00, 
      amountPercentByTeam: 18.19,
      totalAmountPosted: 1776750.57, 
      totalAmountNotPosted: 0.00, 
      avgDaysToReconcile: 13.06 
    },
  ],
  reconRateTrend: [
    { month: 'Jun', rate: 7.2 }, { month: 'Jul', rate: 7.55 }, { month: 'Aug', rate: 7.88 },
    { month: 'Sep', rate: 8.31 }, { month: 'Oct', rate: 8.95 }, { month: 'Nov', rate: 9.38 }, { month: 'Dec', rate: 9.77 },
  ],
  avgDaysTrend: [
    // S-curve data
    { month: 'Jan', days: 10.2 }, { month: 'Feb', days: 10.65 }, { month: 'Mar', days: 10.85 },
  ],

  payerPerformance: [
    { payerName: 'UnitedHealthcare', volume: 145, depositCount: 12, matchRate: 92.4, denialRate: 14.2, suspenseRate: 4.5, avgDaysToSettle: 18, totalVariance: 1450.00, status: 'Critical' },
    { payerName: 'BCBS Federal', volume: 88, depositCount: 5, matchRate: 98.2, denialRate: 5.1, suspenseRate: 1.2, avgDaysToSettle: 12, totalVariance: 240.50, status: 'Stable' },
    { payerName: 'Aetna Medicare', volume: 64, depositCount: 8, matchRate: 94.8, denialRate: 8.4, suspenseRate: 2.1, avgDaysToSettle: 15, totalVariance: 680.00, status: 'Improving' },
  ],
};



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

export const mockBankDeposits: BankDepositEntity[] = [
  {
    id: 'e1',
    name: 'Apex Primary Care',
    items: [
      {
        id: 'bd1',
        reference: '0374098416TC',
        date: '2026-02-07',
        payerName: 'Cedar Cares Inc',
        bankAmt: 6856.63,
        remitAmt: 6896.63,
        variance: -40.00,
        status: 'Exception',
        remittanceAdvice: [
          { reference: 'REM-991', amount: 4500.00 },
          { reference: 'REM-992', amount: 2396.63 },
        ],
        postingApplication: [
          { system: 'eClinicalWorks - EMR Posting', reference: 'BATCH-CED-2026020701', amount: 4200.00, status: 'Posted', date: '2026-02-07' },
          { system: 'QuickBooks - GL Posting', reference: 'JE-QBO-44821', amount: 2100.00, status: 'Posted', date: '2026-02-07' },
          { system: 'eClinicalWorks - Unapplied Cash', reference: 'UA-CED-0207', amount: 516.63, status: 'Review Required', date: '2026-02-07' },
          { system: 'Cedar Portal - Patient Accounting Adj', reference: 'PA-ADJ-8819', amount: 40.00, status: 'Pending', date: '2026-02-07' },
        ]
      },
      {
        id: 'bd2',
        reference: '0374098417TC',
        date: '2026-02-07',
        payerName: 'Aetna Health',
        bankAmt: 12450.00,
        remitAmt: 12450.00,
        variance: 0.00,
        status: 'Matched',
        remittanceAdvice: [
          { reference: 'EFT-112233', amount: 12450.00 },
        ],
        postingApplication: [
          { system: 'eClinicalWorks - EMR Posting', reference: 'BATCH-AET-2026020701', amount: 12450.00, status: 'Posted', date: '2026-02-07' },
        ]
      },
      {
        id: 'bd3',
        reference: '0374098421TC',
        date: '2026-02-07',
        payerName: 'Humana',
        bankAmt: 18500.00,
        remitAmt: 18500.00,
        variance: 0.00,
        status: 'Matched',
        remittanceAdvice: [
          { reference: 'EFT-445566', amount: 18500.00 },
        ],
        postingApplication: [
          { system: 'eClinicalWorks - EMR Posting', reference: 'BATCH-HUM-2026020701', amount: 18500.00, status: 'Posted', date: '2026-02-07' },
        ]
      }
    ]
  },
  {
    id: 'e2',
    name: 'Apex Surgical Center',
    items: [
      {
        id: 'bd4',
        reference: '0374098418TC',
        date: '2026-02-07',
        payerName: 'BCBS Federal',
        bankAmt: 8320.45,
        remitAmt: 8320.45,
        variance: 0.00,
        status: 'Matched',
        remittanceAdvice: [
          { reference: 'EFT-7712009', amount: 8320.45 },
        ],
        postingApplication: [
          { system: 'Epic - EMR Posting', reference: 'BATCH-BCBS-2026020701', amount: 6500.00, status: 'Posted', date: '2026-02-07' },
          { system: 'Sage Intacct - GL Posting', reference: 'JE-SI-88120', amount: 1120.45, status: 'Partially Posted', date: '2026-02-07' },
          { system: 'Epic - Unapplied Cash', reference: 'UA-BCBS-0207', amount: 700.00, status: 'Pending', date: '2026-02-07' },
        ]
      },
      {
        id: 'bd5',
        reference: '0374098420TC',
        date: '2026-02-07',
        payerName: 'Cigna',
        bankAmt: 15780.00,
        remitAmt: 15780.00,
        variance: 0.00,
        status: 'Matched',
        remittanceAdvice: [
          { reference: 'EFT-990011', amount: 15780.00 },
        ],
        postingApplication: [
          { system: 'Epic - EMR Posting', reference: 'BATCH-CIG-2026020701', amount: 15780.00, status: 'Posted', date: '2026-02-07' },
        ]
      }
    ]
  },
  {
    id: 'e3',
    name: 'Apex Home Health',
    items: [
      {
        id: 'bd6',
        reference: '0374098419TC',
        date: '2026-02-06',
        payerName: 'UnitedHealthcare',
        bankAmt: 22100.00,
        remitAmt: 22100.00,
        variance: 0.00,
        status: 'Exception',
        remittanceAdvice: [
          { reference: 'EFT-6634501', amount: 22100.00 },
        ],
        postingApplication: [
          { system: 'Cerner - EMR Posting', reference: 'BATCH-UHC-2026020601', amount: 18250.00, status: 'Posted', date: '2026-02-06' },
          { system: 'NetSuite - GL Posting', reference: 'JE-NS-10198', amount: 2600.00, status: 'Posted', date: '2026-02-06' },
          { system: 'Cerner - Unapplied Cash', reference: 'UA-UHC-0206', amount: 950.00, status: 'Review Required', date: '2026-02-07' },
        ]
      }
    ]
  }
];

export const mockForwardBalanceNotices: ForwardBalanceNotice[] = [
  {
    id: 'fbn1',
    noticeId: 'FB-2025-99110A',
    notificationDate: '11/30/2025',
    providerName: 'Canyon Creek Medical',
    npi: '1987000030',
    originalAmount: -1164.57,
    remainingBalance: -767.81,
    status: 'Posted',
    offsets: [
      {
        eftNumber: 'EFT55443030',
        date: '12/15/2025',
        amount: -396.76,
        code: 'WO',
        claims: [
          { claimId: 'MC99830', patientName: 'SMITH, TEST 30', deductedAmount: -396.76 }
        ]
      }
    ]
  },
  {
    id: 'fbn2',
    noticeId: 'FB-2025-99109A',
    notificationDate: '11/28/2025',
    providerName: 'Legacy Health Systems',
    npi: '1987000029',
    originalAmount: -1396.12,
    remainingBalance: -1391.78,
    status: 'Posted',
    offsets: []
  },
  {
    id: 'fbn3',
    noticeId: 'FB-2025-99108A',
    notificationDate: '11/26/2025',
    providerName: 'Pinnacle Care Network',
    npi: '1987000028',
    originalAmount: -3233.05,
    remainingBalance: -2836.44,
    status: 'Posted',
    offsets: []
  },
  {
    id: 'fbn4',
    noticeId: 'FB-2025-99107A',
    notificationDate: '11/24/2025',
    providerName: 'Radiant Health Services',
    npi: '1987000027',
    originalAmount: -3262.19,
    remainingBalance: -2996.71,
    status: 'Posted',
    offsets: []
  },
  {
    id: 'fbn5',
    noticeId: 'FB-2025-99106A',
    notificationDate: '11/22/2025',
    providerName: 'Horizon Specialty Care',
    npi: '1987000026',
    originalAmount: -4175.12,
    remainingBalance: -2684.38,
    status: 'Posted',
    offsets: []
  }
];


