import React, { useMemo } from 'react';
import { Chip } from '@mui/material';
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
        handleEdit,
        handleDelete,
    } = useAllTransactionsScreen();

    const columns = useMemo<DataColumn<AllTransaction>[]>(() => [
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 60,
            render: (r) => (
                <RowActionMenu
                    onView={() => handleView(r as unknown as Record<string, unknown>)}
                    onEdit={() => handleEdit(r as unknown as Record<string, unknown>)}
                    onDelete={() => handleDelete(r.id)}
                />
            ),
        },
        { id: 'effectiveDate', label: 'Effective Date', minWidth: 120 },
        {
            id: 'transactionType',
            label: 'Category',
            minWidth: 140,
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
        { id: 'type', label: 'Type', minWidth: 100 },
        { id: 'description', label: 'Description', minWidth: 240 },
        { id: 'sourceProvider', label: 'Source / Provider', minWidth: 180 },
        {
            id: 'amount',
            label: 'Amount',
            minWidth: 120,
            align: 'right',
            render: (r) => (
                <AmountText variant="body2" amount={r.amount}>
                    {formatCurrency(r.amount)}
                </AmountText>
            ),
        },
        {
            id: 'openBalance',
            label: 'Open Balance',
            minWidth: 120,
            align: 'right',
            render: (r) => r.openBalance != null ? (
                <BalanceText variant="body2">{formatCurrency(r.openBalance)}</BalanceText>
            ) : '–',
        },
        { 
            id: 'status', 
            label: 'Status', 
            minWidth: 120, 
            filterOptions: ['Reconciled', 'Open', 'Pending', 'Partially Applied', 'Disputed'], 
            render: (r) => <StatusBadge status={r.status} /> 
        },
    ], [isMindPath, handleView, handleEdit, handleDelete]);

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

