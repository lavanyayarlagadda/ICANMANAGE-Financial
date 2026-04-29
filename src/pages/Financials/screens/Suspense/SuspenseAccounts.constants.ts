import { themeConfig } from '@/theme/themeConfig';

export const SUSPENSE_ACCOUNTS = [
  { key: 'medicare_part_a', label: 'Medicare Part A Suspense', color: themeConfig.colors.suspense.medicare.bg, textColor: themeConfig.colors.suspense.medicare.text },
  { key: 'patient_responsibility', label: 'Patient Responsibility Suspense', color: themeConfig.colors.suspense.patient.bg, textColor: themeConfig.colors.suspense.patient.text },
  { key: 'tax_holding', label: 'Tax Holding Suspense', color: themeConfig.colors.suspense.tax.bg, textColor: themeConfig.colors.suspense.tax.text },
  { key: 'cross_entity', label: 'Cross-Entity Suspense', color: themeConfig.colors.suspense.cross.bg, textColor: themeConfig.colors.suspense.cross.text },
  { key: 'remittance_clearing', label: 'Remittance Clearing Suspense', color: themeConfig.colors.suspense.remittance.bg, textColor: themeConfig.colors.suspense.remittance.text },
];

export const BY_ACCOUNT_DATA = [
  { account: 'Medicare Part A Suspense', items: 7, '2026-04': null, '2026-03': 178469.34, '2026-02': null, '2026-01': 191903.55, '2025-12': 70161.13, '2025-11': 23739.78, total: 464273.80 },
  { account: 'Patient Responsibility Suspense', items: 6, '2026-04': 124834.66, '2026-03': 94869.43, '2026-02': 29223.96, '2026-01': 79962.45, '2025-12': 45285.37, '2025-11': 7747.28, total: 381923.15 },
  { account: 'Tax Holding Suspense', items: 5, '2026-04': null, '2026-03': 16849.10, '2026-02': 64081.36, '2026-01': 119121.28, '2025-12': 48858.83, '2025-11': 93680.60, total: 342591.17 },
  { account: 'Cross-Entity Suspense', items: 6, '2026-04': 35361.24, '2026-03': 13625.66, '2026-02': 45246.04, '2026-01': 75091.07, '2025-12': 47693.76, '2025-11': 118516.21, total: 335533.98 },
  { account: 'Remittance Clearing Suspense', items: 6, '2026-04': 25190.15, '2026-03': 38705.01, '2026-02': 94753.75, '2026-01': 34182.42, '2025-12': 33268.27, '2025-11': null, total: 226099.60 },
];

export const BY_PAYER_DATA = [
  { payer: 'North Star Health', items: 2, medicare: null, remittance: null, patient: 124834.66, cross: 118516.21, tax: null, total: 243350.87 },
  { payer: 'Summit Health Systems', items: 2, medicare: 138648.96, remittance: null, patient: null, cross: 13625.66, tax: null, total: 152274.62 },
  { payer: 'Unity Health Group', items: 2, medicare: 89983.46, remittance: 51806.50, patient: null, cross: null, tax: null, total: 141789.96 },
  { payer: 'Valley View Medical Center', items: 2, medicare: null, remittance: null, patient: null, cross: 35361.24, tax: 93680.60, total: 129041.84 },
  { payer: 'Pinecrest Medical Group', items: 1, medicare: null, remittance: null, patient: null, cross: null, tax: 119121.28, total: 119121.28 },
];

export const BY_MONTH_DATA = [
  { month: '2026-04', medicare: null, remittance: 25190.15, patient: 124834.66, cross: 35361.24, tax: null, total: 185386.05 },
  { month: '2026-03', medicare: 178469.34, remittance: 38705.01, patient: 94869.43, cross: 13625.66, tax: 16849.10, total: 342518.54 },
  { month: '2026-02', medicare: null, remittance: 94753.75, patient: 29223.96, cross: 45246.04, tax: 64081.36, total: 233305.11 },
  { month: '2026-01', medicare: 191903.55, remittance: 34182.42, patient: 79962.45, cross: 75091.07, tax: 119121.28, total: 500260.77 },
  { month: '2025-12', medicare: 70161.13, remittance: 33268.27, patient: 45285.37, cross: 47693.76, tax: 48858.83, total: 245267.36 },
];
