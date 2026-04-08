import React, { useMemo } from 'react';
import { Box, Typography, useTheme, Grid } from '@mui/material';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { RecoupmentRecord } from '@/interfaces/financials';
import { formatCurrency } from '@/utils/formatters';
import { useRecoupmentsScreen } from './RecoupmentsScreen.hook';
import * as styles from './RecoupmentsScreen.styles';

const RecoupmentsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const theme = useTheme();
    const {
        recoupments,
        totalElements,
        queryParams,
        stats,
        handleView,
        handleEdit,
        handleDelete,
        handleRangeChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        isError,
    } = useRecoupmentsScreen({ skip });

    const columns = useMemo<DataColumn<RecoupmentRecord>[]>(() => [
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 60,
            render: (r) => (
                <RowActionMenu
                    onView={() => handleView(r)}
                // onEdit={() => handleEdit(r)}
                // onDelete={() => handleDelete(r.id)}
                />
            ),
        },
        { id: 'recoupmentId', label: 'Recoupment ID', minWidth: 140, accessor: (r) => r.recoupmentId, render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.recoupmentId}</Typography> },
        { id: 'payer', label: 'Payer', minWidth: 140, accessor: (r) => r.payer, filterOptions: ['Aetna', 'UnitedHealthcare', 'Cigna', 'Medicare'], render: (r) => r.payer },
        {
            id: 'claim',
            label: 'Claim / Patient',
            minWidth: 180,
            accessor: (r) => r.patientName,
            render: (r) => (
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.claimId}</Typography>
                    <Typography variant="caption" color="text.secondary">{r.patientName}</Typography>
                </Box>
            ),
        },
        { id: 'originalPaymentAmount', label: 'Orig. Payment', minWidth: 120, align: 'right', accessor: (r) => r.originalPaymentAmount, render: (r) => <Box sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.originalPaymentAmount)}</Box> },
        {
            id: 'recoupmentAmount',
            label: 'Recoupment Amt',
            minWidth: 130,
            align: 'right',
            accessor: (r) => r.recoupmentAmount,
            render: (r) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: theme.palette.error.main }}>
                    {formatCurrency(r.recoupmentAmount)}
                </Typography>
            ),
        },
        { id: 'recoupmentDate', label: 'Date', minWidth: 110, accessor: (r) => r.recoupmentDate, render: (r) => r.recoupmentDate },
        {
            id: 'reason',
            label: 'Reason',
            minWidth: 200,
            accessor: (r) => r.reason,
            filterOptions: ['Duplicate', 'Overpayment', 'Incorrect Rate', 'Coordination of Benefits'],
            render: (r) => (
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{r.reason}</Typography>
            ),
        },
        // { id: 'description', label: 'Description', minWidth: 180, accessor: (r) => r.description ?? '-', render: (r) => r.description ?? '-' },
        { id: 'status', label: 'Status', minWidth: 120, accessor: (r) => r.status, filterOptions: ['Processed', 'Pending', 'Disputed'], render: (r) => <StatusBadge status={r.status} /> },
    ], [theme, handleView, handleEdit, handleDelete]);

    if (isError) return <Box sx={{ p: 4, color: 'error.main' }}>Error loading recoupments.</Box>;

    return (
        <Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 4 }}><SummaryCard title="Total Original Payments" value={formatCurrency(stats.totalOriginal)} variant="highlight" /></Grid>
                <Grid size={{ xs: 12, sm: 4 }}><SummaryCard title="Total Recouped" value={formatCurrency(stats.totalRecouped)} variant="negative" /></Grid>
                <Grid size={{ xs: 12, sm: 4 }}><SummaryCard title="Total Records" value={String(totalElements)} /></Grid>
            </Grid>
            <DataTable
                columns={columns}
                data={recoupments}
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
                download={false}
            />
        </Box>
    );
};

export default RecoupmentsScreen;

