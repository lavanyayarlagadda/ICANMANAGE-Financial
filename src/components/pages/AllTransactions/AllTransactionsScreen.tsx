import React, { useMemo } from 'react';
import { Box, Chip, Typography, useTheme, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { AllTransaction } from '@/interfaces/financials';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { themeConfig } from '@/theme/themeConfig';
import { AmountText, BalanceText, transactionTypeColors, ToolbarWrapper, SearchField } from './AllTransactionsScreen.styles';
import { useAllTransactionsScreen } from './AllTransactionsScreen.hook';

const AllTransactionsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const {
        filteredTransactions,
        totalElements,
        queryParams,
        handleDrillDown,
        handleRangeChange,
        handleFilterChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        statusOptions,
        isError,
        globalFilters,
        searchTerm,
        setSearchTerm,
        onSearch
    } = useAllTransactionsScreen({ skip });
    const theme = useTheme();

    const columns = useMemo<DataColumn<AllTransaction>[]>(() => [
        {
            id: 'actions',
            label: 'ACTIONS',
            minWidth: 60,
            render: (r) => (
                <RowActionMenu
                    onView={() => handleDrillDown(r)} />
            ),
        },
        { id: 'effectiveDate', label: 'EFFECTIVE DATE', minWidth: 120, align: 'center', accessor: (r) => r.effectiveDate ?? '', render: (r) => formatDate(r.effectiveDate) },
        {
            id: 'transactionNo',
            label: 'TRANSACTION NUMBER',
            minWidth: 170,
            align: 'center',
            accessor: (r) => r.transactionNo ?? '-',
            render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.transactionNo ?? '-'}</Typography>
        },
        {
            id: 'transactionType',
            label: 'CATEGORY',
            minWidth: 140,
            accessor: (r) => r.category ?? '',
            filterOptions: ['PAYMENT', 'RECOUPMENT', 'FORWARD_BALANCE', 'ADJUSTMENT'],
            render: (r) => {
                const colors = transactionTypeColors[r.category] || { bg: themeConfig.colors.slate[100], text: themeConfig.colors.slate[600] };
                return (
                    <Chip
                        label={(r.category ?? '').replace('_', ' ')}
                        size="small"
                        sx={{ backgroundColor: colors.bg, color: colors.text, fontWeight: 600, fontSize: '0.7rem' }}
                    />
                );
            },
        },
        { id: 'type', label: 'TYPE', minWidth: 100, accessor: (r) => r.type ?? '', filterOptions: ['CHECK', 'EFT', 'BULK'], render: (r) => r.type },
        // { id: 'description', label: 'DESCRIPTION', minWidth: 240, accessor: (r) => r.description ?? '', render: (r) => r.description },
        { id: 'payer', label: 'PAYER', minWidth: 180, accessor: (r) => r.sourceProvider ?? '', filterOptions: ['HOSPICE OF THE SOUTH', 'UNITED HEALTHCARE', 'AETNA'], render: (r) => r.sourceProvider },
        {
            id: 'amount',
            label: 'AMOUNT',
            minWidth: 120,
            align: 'center',
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
            label: 'OPEN BALANCE',
            minWidth: 120,
            align: 'center',
            accessor: (r) => r.openBalance ?? 0,
            render: (r) => r.openBalance != null ? (
                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.openBalance)}</Typography>
            ) : '–',
        },
        {
            id: 'status',
            label: 'STATUS',
            minWidth: 120,
            accessor: (r) => r.status ?? '',
            filterOptions: statusOptions,
            render: (r) => <StatusBadge status={r.status} />
        },
    ], [theme.palette.error.main, theme.palette.text.primary, statusOptions]);

    return (
        <Box>
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
                data={filteredTransactions || []}
                rowKey={(r) => r.id ?? ''}
                exportTitle="All Transactions"
                customToolbarContent={<RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />}
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
                onFilterChange={handleFilterChange}
                download={false}
            />
        </Box>
    );
};

export default AllTransactionsScreen;

