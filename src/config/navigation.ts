import React from 'react';
import AllTransactionsScreen from '@/pages/Financials/screens/AllTransactions/AllTransactionsScreen';
import PaymentsScreen from '@/pages/Financials/screens/Payments/PaymentsScreen';
import RecoupmentsScreen from '@/pages/Financials/screens/Recoupments/RecoupmentsScreen';
import OtherAdjustmentsScreen from '@/pages/Financials/screens/OtherAdjustments/OtherAdjustmentsScreen';
import BankDepositsScreen from '@/pages/Financials/screens/BankDeposits/BankDepositsScreen';
import PipScreen from '@/pages/Financials/screens/Pip/PipScreen';
import SuspenseAccountsScreen from '@/pages/Financials/screens/Suspense/SuspenseAccountsScreen';
import VarianceScreen from '@/pages/Financials/screens/Variance/VarianceScreen';
import TrendsScreen from '@/pages/Financials/screens/Trends/TrendsScreen';
import ReconciliationScreen from '@/pages/Financials/screens/ReconciliationScreen/ReconciliationScreen';
import CollectionsScreen from '@/pages/Financials/screens/Collections/CollectionsScreen';
import StatementsScreen from '@/pages/Financials/screens/Statements/StatementsScreen';

import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export interface NavMetadata {
    path: string;
    icon?: React.ElementType;
    component?: React.ComponentType;
}

export const NAV_CONFIG: Record<string, NavMetadata> = {
    'Collections': {
        path: '/collections',
        icon: ReceiptLongIcon,
        component: CollectionsScreen,
    },
    'Financials': {
        path: '/financials',
        icon: AccountBalanceIcon,
    },
    'Transactions': {
        path: '/financials/transactions',
    },
    'All Transactions': {
        path: '/financials/all-transactions',
        component: AllTransactionsScreen,
    },
    'Payments': {
        path: '/financials/payments',
        component: PaymentsScreen,
    },
    'Recoupments': {
        path: '/financials/recoupments',
        component: RecoupmentsScreen,
    },
    'Other Adjustments': {
        path: '/financials/other-adjustments',
        component: OtherAdjustmentsScreen,
    },
    'Bank Deposits': {
        path: '/financials/bank-deposits',
        component: BankDepositsScreen,
    },
    'Statements': {
        path: '/financials/statements',
        component: StatementsScreen,
    },
    'PIP': {
        path: '/financials/statements/pip',
        component: PipScreen,
    },
    'Forward Balances': {
        path: '/financials/statements/forward-balance',
        component: StatementsScreen,
    },
    'Suspense Accounts': {
        path: '/financials/statements/suspense-accounts',
        component: SuspenseAccountsScreen,
    },
    'Variance Analysis': {
        path: '/financials/variance-analysis/fee-schedule',
        component: VarianceScreen,
    },
    'Fee Schedule Variance': {
        path: '/financials/variance-analysis/fee-schedule',
        component: VarianceScreen,
    },
    'Payment Variance': {
        path: '/financials/variance-analysis/payment',
        component: VarianceScreen,
    },
    'Trends & Forecast': {
        path: '/financials/trends-forecast/forecast',
        component: TrendsScreen,
    },
    'Forecast Trends': {
        path: '/financials/trends-forecast/forecast',
        component: TrendsScreen,
    },
    'Executive Summary': {
        path: '/financials/trends-forecast/summary',
        component: TrendsScreen,
    },
    'Payer Performance': {
        path: '/financials/trends-forecast/payer-performance',
        component: TrendsScreen,
    },
    'Reconciliation': {
        path: '/financials/reconciliation/unreconciled',
        component: ReconciliationScreen,
    }
};
