import React, { useMemo } from 'react';
import { Chip, Typography, useTheme } from '@mui/material';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { AllTransaction } from '@/interfaces/financials';
import { formatCurrency } from '@/utils/formatters';
import { AmountText, BalanceText, transactionTypeColors } from './AllTransactionsScreen.styles';
import { useAllTransactionsScreen } from './AllTransactionsScreen.hook';

const AllTransactionsScreen: React.FC = () => {
    const {
        filteredTransactions,
        isMindPath,
        handleView,
        // handleEdit,
        // handleDelete,
    } = useAllTransactionsScreen();
    const theme = useTheme();
    const columns = useMemo<DataColumn<AllTransaction>[]>(() => [
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 60,
            render: (r) => (
                <RowActionMenu
                    onView={() => handleView(r)}
                />
            ),
        },
        { id: 'effectiveDate', label: 'Effective Date', minWidth: 120, accessor: (r) => r.effectiveDate, render: (r) => r.effectiveDate },
        {
            id: 'transactionType',
            label: 'Category',
            minWidth: 140,
            accessor: (r) => r.transactionType,
            filterOptions: ['PAYMENT', 'RECOUPMENT', 'FORWARD_BALANCE', 'ADJUSTMENT', ...(!isMindPath ? ['PIP'] : [])],
            render: (r) => {
                const colors = transactionTypeColors[r.transactionType] || { bg: '#F5F5F5', text: '#616161' };
                return (
                    <Chip
                        label={r.transactionType.replace('_', ' ')}
                        size="small"
                        sx={{ backgroundColor: colors.bg, color: colors.text, fontWeight: 600, fontSize: '0.7rem' }}
                    />
                );
            },
        },
        { id: 'type', label: 'Type', minWidth: 100, accessor: (r) => r.type, render: (r) => r.type },
        { id: 'description', label: 'Description', minWidth: 240, accessor: (r) => r.description, render: (r) => r.description },
        { id: 'sourceProvider', label: 'Source / Provider', minWidth: 180, accessor: (r) => r.sourceProvider, render: (r) => r.sourceProvider },
        {
            id: 'amount',
            label: 'Amount',
            minWidth: 120,
            align: 'right',
            accessor: (r) => r.amount,
            render: (r) => (
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        color: r.amount < 0 ? theme.palette.error.main : theme.palette.text.primary,
                    }}
                >
                    {formatCurrency(r.amount)}
                </Typography>
            ),
        },
        {
            id: 'openBalance',
            label: 'Open Balance',
            minWidth: 120,
            align: 'right',
            accessor: (r) => r.openBalance ?? 0,
            render: (r) => r.openBalance != null ? (
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.openBalance)}</Typography>
            ) : '–',
        },
        { id: 'status', label: 'Status', minWidth: 120, accessor: (r) => r.status, filterOptions: ['Reconciled', 'Open', 'Pending', 'Partially Applied', 'Disputed'], render: (r) => <StatusBadge status={r.status} /> },
    ], [isMindPath, handleView]);

    return (
        <DataTable
            columns={columns}
            data={filteredTransactions}
            rowKey={(r) => r.id}
            exportTitle="All Transactions"
            customToolbarContent={<RangeDropdown />}
            dictionaryId="all-transactions"
        />
    );
};

export default AllTransactionsScreen;

