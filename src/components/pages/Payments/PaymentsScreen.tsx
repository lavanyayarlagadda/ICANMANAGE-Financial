import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { PaymentTransaction } from '@/interfaces/financials';
import { formatCurrency } from '@/utils/formatters';
import { openEditDialog, openConfirmDelete } from '@/store/slices/uiSlice';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ScreenWrapper, TransactionNumber, MonospaceBox } from './PaymentsScreen.styles';
import { usePaymentsScreen } from './PaymentsScreen.hook';

const PaymentsScreen: React.FC = () => {
    const {
        payments,
        totalElements,
        queryParams,
        handleDrillDown,
        handleRangeChange,
        handleFilterChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        isError,
        dispatch,
    } = usePaymentsScreen();

    const columns = useMemo<DataColumn<PaymentTransaction>[]>(() => [
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 60,
            render: (r) => (
                <RowActionMenu
                    onView={() => handleDrillDown(r)}
                    onEdit={() => dispatch(openEditDialog(r as unknown as Record<string, unknown>))}
                    onDelete={() => dispatch(openConfirmDelete({ id: r.id, type: 'payment' }))}
                    extraActions={[
                        { label: 'Copy ID', icon: <ContentCopyIcon fontSize="small" />, onClick: () => navigator.clipboard.writeText(r.id) },
                    ]}
                />
            ),
        },
        { id: 'effectiveDate', label: 'Effective Date', minWidth: 120 },
        { id: 'type', label: 'Type', minWidth: 90 },
        {
            id: 'transactionNo',
            label: 'Transaction Number',
            minWidth: 220,
            render: (r) => (
                <TransactionNumber variant="body2" onClick={() => handleDrillDown(r)}>
                    {r.transactionNo}
                </TransactionNumber>
            ),
        },
        { id: 'payer', label: 'Payer', minWidth: 180 },
        { id: 'amount', label: 'Amount', minWidth: 110, align: 'right', render: (r) => <MonospaceBox>{formatCurrency(r.amount)}</MonospaceBox> },
        { id: 'openBalance', label: 'Open Balance', minWidth: 120, align: 'right', render: (r) => r.openBalance != null ? formatCurrency(r.openBalance) : 'N/A' },
        { id: 'status', label: 'Status', minWidth: 120, filterOptions: ['All', 'Reconciled', 'Partially Applied', 'Pending'], render: (r) => <StatusBadge status={r.status} /> },
    ], [dispatch, handleDrillDown]);

    if (isError) return <Box sx={{ p: 4, color: 'error.main' }}>Error loading payments.</Box>;

    return (
        <ScreenWrapper>
            <DataTable
                columns={columns}
                data={payments}
                rowKey={(r) => r.id}
                exportTitle="Payments"
                customToolbarContent={<RangeDropdown onChange={handleRangeChange} />}
                dictionaryId="all-transactions"
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

