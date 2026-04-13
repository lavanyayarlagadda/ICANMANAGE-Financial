import React from 'react';
import AllTransactionsScreen from '@/components/pages/AllTransactions/AllTransactionsScreen';
import PaymentsScreen from '@/components/pages/Payments/PaymentsScreen';
import RecoupmentsScreen from '@/components/pages/Recoupments/RecoupmentsScreen';
import OtherAdjustmentsScreen from '@/components/pages/OtherAdjustments/OtherAdjustmentsScreen';
import BankDepositsScreen from '@/components/pages/BankDeposits/BankDepositsScreen';
import PipScreen from '@/components/pages/Pip/PipScreen';
import SuspenseAccountsScreen from '@/components/pages/Suspense/SuspenseAccountsScreen';
import VarianceScreen from '@/components/pages/Variance/VarianceScreen';
import TrendsScreen from '@/components/pages/Trends/TrendsScreen';
import ReconciliationScreen from '@/components/pages/ReconciliationScreen/ReconciliationScreen';
import CollectionsScreen from '@/components/pages/Collections/CollectionsScreen';
import StatementsScreen from '@/components/pages/Statements/StatementsScreen';

import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DashboardIcon from '@mui/icons-material/Dashboard';

export interface NavMetadata {
    path: string;
    icon?: React.ElementType;
    component?: React.ComponentType<any>;
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
        path: '/financials/all-transactions',
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
        path: '/financials/statements/pip',
        component: StatementsScreen,
    },
    'PIP': {
        path: '/financials/statements/pip',
        component: PipScreen,
    },
    'Forward Balances': {
        path: '/financials/statements/forward-balance',
    },
    'Suspense Accounts': {
        path: '/financials/statements/suspense-accounts',
        component: SuspenseAccountsScreen,
    },
    'Variance Analysis': {
        path: '/financials/variance-analysis/fee-schedule',
    },
    'Fee Schedule Variance': {
        path: '/financials/variance-analysis/fee-schedule',
    },
    'Payment Variance': {
        path: '/financials/variance-analysis/payment',
    },
    'Trends & Forecast': {
        path: '/financials/trends-forecast/forecast',
    },
    'Forecast Trends': {
        path: '/financials/trends-forecast/forecast',
    },
    'Executive Summary': {
        path: '/financials/trends-forecast/summary',
    },
    'Payer Performance': {
        path: '/financials/trends-forecast/payer-performance',
    },
    'Reconciliation': {
        path: '/financials/reconciliation/unreconciled',
        component: ReconciliationScreen,
    }
};
