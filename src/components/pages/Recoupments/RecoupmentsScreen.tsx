import React, { useMemo } from 'react';
import { Box, Typography, useTheme, Grid, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { RecoupmentRecord } from '@/interfaces/financials';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useRecoupmentsScreen } from './RecoupmentsScreen.hook';
import * as styles from './RecoupmentsScreen.styles';

const RecoupmentsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const theme = useTheme();
    const {
        recoupments,
        totalElements,
        queryParams,
        payerOptions,
        stats,
        handleDrillDown,
        handleEdit,
        handleDelete,
        handleRangeChange,
        handleFilterChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        isError,
        searchTerm,
        setSearchTerm,
        onSearch
    } = useRecoupmentsScreen({ skip });

    const columns = useMemo<DataColumn<RecoupmentRecord>[]>(() => [
        {
            id: 'actions',
            label: 'ACTIONS',
            minWidth: 60,
            render: (r) => (
                <RowActionMenu
                    onView={() => handleDrillDown(r)}
                />
            ),
            align: 'center'
        },
        { id: 'recoupmentId', label: 'RECOUPMENT ID', minWidth: 140, accessor: (r) => r.recoupmentId, render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.recoupmentId}</Typography> },
        {
            id: 'transactionNo',
            label: 'TRANSACTION NUMBER',
            minWidth: 160,
            accessor: (r) => r.transactionNo ?? '-',
            render: (r) => r.transactionNo ?? '-',
        },
        {
            id: 'payer', label: 'PAYER'
            , minWidth: 140, accessor: (r) => r.payer, filterOptions: payerOptions, render: (r) => r.payer
        },
        {
            id: 'claim',
            label: 'CLAIM / PATIENT',
            minWidth: 180,
            accessor: (r) => r.claimPatient,
            render: (r) => (
                <Box>
                    <Typography variant="caption" color="text.secondary">{r.claimPatient}</Typography>
                </Box>
            ),
        },
        { id: 'originalPaymentAmount', label: 'ORIG. PAYMENT', minWidth: 120, accessor: (r) => r.originalPaymentAmount, render: (r) => <Box sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.originalPaymentAmount)}</Box> },
        {
            id: 'recoupmentAmount',
            label: 'RECOUPMENT AMT',
            minWidth: 130,
            accessor: (r) => r.recoupmentAmount,
            render: (r) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: theme.palette.error.main }}>
                    {formatCurrency(r.recoupmentAmount)}
                </Typography>
            ),
        },
        { id: 'recoupmentDate', label: 'DATE', minWidth: 110, accessor: (r) => r.recoupmentDate, render: (r) => formatDate(r.recoupmentDate) },
        { id: 'status', label: 'STATUS', minWidth: 120, accessor: (r) => r.status, filterOptions: ['Processed', 'Pending', 'Disputed'], render: (r) => <StatusBadge status={r.status} /> },
    ], [theme, handleDrillDown, handleEdit, handleDelete]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', minHeight: 0 }}>
            <styles.ToolbarWrapper>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <styles.SearchField
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
            </styles.ToolbarWrapper>
            {/* <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 4 }}><SummaryCard title="Total Original Payments" value={formatCurrency(stats.totalOriginal)} variant="highlight" /></Grid>
                <Grid size={{ xs: 12, sm: 4 }}><SummaryCard title="Total Recouped" value={formatCurrency(stats.totalRecouped)} variant="negative" /></Grid>
                <Grid size={{ xs: 12, sm: 4 }}><SummaryCard title="Total Records" value={String(totalElements)} /></Grid>
            </Grid> */}
            <DataTable
                columns={columns}
                data={recoupments || []}
                rowKey={(r) => r.id}
                exportTitle="Recoupments"
                customToolbarContent={<RangeDropdown onChange={handleRangeChange} />}
                dictionaryId="recoupments"
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

export default RecoupmentsScreen;

