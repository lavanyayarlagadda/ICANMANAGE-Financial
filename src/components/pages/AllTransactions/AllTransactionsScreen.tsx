import React, { useMemo } from 'react';
import { Box, Chip, Typography, useTheme } from '@mui/material';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { AllTransaction } from '@/interfaces/financials';
import { formatCurrency } from '@/utils/formatters';
import { themeConfig } from '@/theme/themeConfig';
import { AmountText, BalanceText, transactionTypeColors } from './AllTransactionsScreen.styles';
import { useAllTransactionsScreen } from './AllTransactionsScreen.hook';

const AllTransactionsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const {
        filteredTransactions,
        totalElements,
        queryParams,
        isMindPath,
        handleDrillDown,
        handleRangeChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        isError,
    } = useAllTransactionsScreen({ skip });
    const theme = useTheme();

    const columns = useMemo<DataColumn<AllTransaction>[]>(() => [
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 60,
            render: (r) => (
                <RowActionMenu
                    onView={() => handleDrillDown(r)} />
            ),
        },
        { id: 'effectiveDate', label: 'Effective Date', minWidth: 120, accessor: (r) => r.effectiveDate ?? '', render: (r) => r.effectiveDate },
        {
            id: 'transactionNo',
            label: 'Transaction Number',
            minWidth: 160,
            accessor: (r) => (r as any).transactionNo ?? '-',
            render: (r) => (r as any).transactionNo ?? '-'
        },
        {
            id: 'transactionType',
            label: 'Category',
            minWidth: 140,
            accessor: (r) => r.transactionType ?? '',
            filterOptions: ['PAYMENT', 'RECOUPMENT', 'FORWARD_BALANCE', 'ADJUSTMENT', ...(!isMindPath ? ['PIP'] : [])],
            render: (r) => {
                const colors = transactionTypeColors[r.transactionType] || { bg: themeConfig.colors.slate[100], text: themeConfig.colors.slate[600] };
                return (
                    <Chip
                        label={(r.transactionType ?? '').replace('_', ' ')}
                        size="small"
                        sx={{ backgroundColor: colors.bg, color: colors.text, fontWeight: 600, fontSize: '0.7rem' }}
                    />
                );
            },
        },
        { id: 'type', label: 'Type', minWidth: 100, accessor: (r) => r.type ?? '', filterOptions: ['CHECK', 'EFT', 'BULK'], render: (r) => r.type },
        // { id: 'description', label: 'Description', minWidth: 240, accessor: (r) => r.description ?? '', render: (r) => r.description },
        { id: 'sourceProvider', label: 'Source / Provider', minWidth: 180, accessor: (r) => r.sourceProvider ?? '', filterOptions: ['HOSPICE OF THE SOUTH', 'UNITED HEALTHCARE', 'AETNA'], render: (r) => r.sourceProvider },
        {
            id: 'amount',
            label: 'Amount',
            minWidth: 120,
            align: 'right',
            accessor: (r) => r.amount ?? 0,
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
        { id: 'status', label: 'Status', minWidth: 120, accessor: (r) => r.status ?? '', filterOptions: ['All', 'Reconciled', 'Partially Applied', 'Pending'], render: (r) => <StatusBadge status={r.status} /> },
    ], [isMindPath, theme.palette.error.main, theme.palette.text.primary]);

    if (isError) return <Box sx={{ p: 4, color: 'error.main' }}>Error loading transactions.</Box>;

    return (
        <DataTable
            columns={columns}
            data={filteredTransactions}
            rowKey={(r) => r.id ?? ''}
            exportTitle="All Transactions"
            customToolbarContent={<RangeDropdown onChange={handleRangeChange} />}
            dictionaryId="all-transaction"
            serverSide
            totalElements={totalElements}
            page={queryParams.page}
            rowsPerPage={queryParams.size}
            sortCol={queryParams.sortField}
            sortDir={queryParams.sortOrder}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            onSortChange={handleSortChange}
            download={false}
        />
    );
};

export default AllTransactionsScreen;

