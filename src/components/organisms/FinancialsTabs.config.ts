export const mainTabs = [
  { id: 0, label: 'Transactions', path: '/financials/payments' },
  // { id: 1, label: 'Bank Deposits', path: '/financials/bank-deposits' },
  { id: 2, label: 'Statements', path: '/financials/statements/pip' },
  { id: 3, label: 'Variance Analysis', path: '/financials/variance-analysis' },
  { id: 4, label: 'Trends & Forecast', path: '/financials/trends-forecast' },
  // { id: 5, label: 'Calendar', path: '/financials/calendar' },
];

export const transactionSubTabs = [
  // { id: 0, label: 'All Transactions', path: '/financials/all-transactions' },
  { id: 1, label: 'Payments', path: '/financials/payments' },
  // { id: 2, label: 'Recoupments', path: '/financials/recoupments' },
  // { id: 3, label: 'Adjustments', path: '/financials/other-adjustments' },
];

export const statementsSubTabs = [
  { id: 0, label: 'PIP Statements', path: '/financials/statements/pip' },
  // { id: 1, label: 'Forward Balance', path: '/financials/statements/forward-balance' },
  // { id: 2, label: 'Suspense Accounts', path: '/financials/statements/suspense-accounts' },
];

export const varianceSubTabs = [
  { id: 0, label: 'Fee Schedule Variance', path: '/financials/variance-analysis/fee-schedule' },
  { id: 1, label: 'Payment Variance', path: '/financials/variance-analysis/payment' },
];

export const trendsSubTabs = [
  { id: 0, label: 'Forecast Trends', path: '/financials/trends-forecast/forecast' },
  { id: 1, label: 'Executive Summary', path: '/financials/trends-forecast/summary' },
  // { id: 2, label: 'Payer Performance', path: '/financials/trends-forecast/payer-performance' },
];
