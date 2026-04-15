import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { PaymentTransaction } from '@/interfaces/financials';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { openEditDialog, openConfirmDelete } from '@/store/slices/uiSlice';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ScreenWrapper, TransactionNumber, MonospaceBox } from './PaymentsScreen.styles';
import { usePaymentsScreen } from './PaymentsScreen.hook';

const PaymentsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const {
        payments,
        totalElements,
        queryParams,
        globalFilters,
        handleDrillDown,
        handleRangeChange,
        handleFilterChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        isError,
        dispatch,
        statusOptions
    } = usePaymentsScreen({ skip });

    const columns = useMemo<DataColumn<PaymentTransaction>[]>(() => [
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 60,
            render: (r) => (
                <RowActionMenu
                    onView={() => handleDrillDown(r)}
                // onEdit={() => dispatch(openEditDialog(r))}
                // onDelete={() => dispatch(openConfirmDelete({ id: r.id, type: 'payment' }))}
                // extraActions={[
                //     { label: 'Copy ID', icon: <ContentCopyIcon fontSize="small" />, onClick: () => navigator.clipboard.writeText(r.id) },
                // ]}
                />
            ),
        },
        { id: 'effectiveDate', label: 'Effective Date', minWidth: 120, accessor: (r) => r.effectiveDate ?? '', render: (r) => formatDate(r.effectiveDate) },
        { id: 'type', label: 'Type', minWidth: 90, accessor: (r) => r.type ?? '', filterOptions: ['PAPER_CHECK', 'EFT', 'CREDIT_CARD'], render: (r) => r.type },
        // { id: 'description', label: 'Description', minWidth: 200, accessor: (r) => r.description ?? '-', render: (r) => r.description ?? '-' },
        {
            id: 'transactionNo',
            label: 'Transaction Number',
            minWidth: 220,
            align: 'center',
            accessor: (r) => r.transactionNo ?? '',
            render: (r) => (
                <Typography
                    variant="body2"
                // sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}
                // onClick={() => handleDrillDown(r)}
                >
                    {r.transactionNo}
                </Typography>
            ),
        },
        { id: 'payer', label: 'Payer', minWidth: 180, accessor: (r) => r.payer ?? '', filterOptions: ['Aetna', 'UnitedHealthcare', 'Cigna', 'Medicare', 'Blue Shield', 'Humana', 'Kaiser Permanente'], render: (r) => r.payer },
        { id: 'amount', label: 'Amount', minWidth: 110, align: 'center', accessor: (r) => r.amount ?? 0, render: (r) => <Box sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.amount ?? 0)}</Box> },
        { id: 'openBalance', label: 'Open Balance', minWidth: 120, align: 'center', accessor: (r) => r.openBalance ?? 0, render: (r) => formatCurrency(r.openBalance) },
        {
            id: 'status', label: 'Status', minWidth: 120, accessor: (r) => r.status ?? '', filterOptions: statusOptions,
            render: (r) => <StatusBadge status={r.status} />
        },
    ], [dispatch, handleDrillDown]);

    if (isError) return <Box sx={{ p: 4, color: 'error.main' }}>Error loading payments.</Box>;

    return (
        <ScreenWrapper>
            <DataTable
                columns={columns}
                data={payments}
                rowKey={(r) => r.id ?? ''}
                exportTitle="Payments"
                customToolbarContent={<RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />}
                dictionaryId="payments"
                serverSide
                totalElements={totalElements}
                page={queryParams.page}
                rowsPerPage={queryParams.size}
                sortCol={queryParams.sortField}
                sortDir={queryParams.sortOrder}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                download={false}
            />
        </ScreenWrapper>
    );
};

export default PaymentsScreen;

