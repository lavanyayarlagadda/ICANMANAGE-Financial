import React, { useMemo } from 'react';
import { Box, Typography, InputAdornment, Button, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { PaymentTransaction } from '@/interfaces/financials';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { openEditDialog, openConfirmDelete } from '@/store/slices/uiSlice';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { ScreenWrapper, TransactionNumber, MonospaceBox, ToolbarWrapper, SearchField } from './PaymentsScreen.styles';
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
        statusOptions,
        searchTerm,
        setSearchTerm,
        onSearch
    } = usePaymentsScreen({ skip });

    const theme = useTheme();

    const columns = useMemo<DataColumn<PaymentTransaction>[]>(() => [
        {
            id: 'actions',
            label: 'ACTIONS',
            minWidth: 60,
            render: (r) => (
                <RowActionMenu
                    onView={() => handleDrillDown(r)}
                />
            ),
        },
        { id: 'effectiveDate', label: 'EFFECTIVE DATE', minWidth: 120, accessor: (r) => r.effectiveDate ?? '', render: (r) => formatDate(r.effectiveDate) },
        { id: 'type', label: 'TYPE', minWidth: 90, accessor: (r) => r.type ?? '', render: (r) => r.type },
        // { id: 'description', label: 'DESCRIPTION', minWidth: 200, accessor: (r) => r.description ?? '-', render: (r) => r.description ?? '-' },
        {
            id: 'transactionNo',
            label: 'TRANSACTION NUMBER',
            minWidth: 220,
            align: 'center',
            accessor: (r) => r.transactionNo ?? '',
            render: (r) => (
                <Typography
                    variant="body2"
                >
                    {r.transactionNo}
                </Typography>
            ),
        },
        { id: 'payer', label: 'PAYER', minWidth: 180, accessor: (r) => r.payer ?? '', render: (r) => r.payer },
        { id: 'amount', label: 'AMOUNT', minWidth: 110, align: 'center', accessor: (r) => r.amount ?? 0, render: (r) => <Box sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.amount ?? 0)}</Box> },
        { id: 'openBalance', label: 'OPEN BALANCE', minWidth: 120, align: 'center', accessor: (r) => r.openBalance ?? 0, render: (r) => formatCurrency(r.openBalance) },
        {
            id: 'status', label: 'STATUS', minWidth: 120, accessor: (r) => r.status ?? '', filterOptions: statusOptions,
            render: (r) => <StatusBadge status={r.status} />
        },
    ], [dispatch, handleDrillDown, statusOptions]);

    return (
        <ScreenWrapper>
            <ToolbarWrapper>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <SearchField
                        size="small"
                        placeholder="Search by Transaction #"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch(searchTerm)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => onSearch(searchTerm)}
                        sx={{ height: '36px', borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 2 }}
                    >
                        Search
                    </Button>
                </Box>
            </ToolbarWrapper>
            <DataTable
                columns={columns}
                data={payments || []}
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

