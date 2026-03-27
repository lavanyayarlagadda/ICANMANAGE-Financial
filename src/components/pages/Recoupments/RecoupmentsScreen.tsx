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

const RecoupmentsScreen: React.FC = () => {
    const theme = useTheme();
    const {
        recoupments,
        stats,
        handleView,
        handleEdit,
        handleDelete,
        dispatch
    } = useRecoupmentsScreen();

    const columns = useMemo<DataColumn<RecoupmentRecord>[]>(() => [
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
        { id: 'recoupmentId', label: 'Recoupment ID', minWidth: 140, render: (r) => <Typography variant="body2" sx={styles.boldStyles}>{r.recoupmentId}</Typography> },
        { id: 'payer', label: 'Payer', minWidth: 140 },
        {
            id: 'claim',
            label: 'Claim / Patient',
            minWidth: 180,
            render: (r) => (
                <Box>
                    <Typography variant="body2" sx={styles.boldStyles}>{r.claimId}</Typography>
                    <Typography variant="caption" color="text.secondary">{r.patientName}</Typography>
                </Box>
            ),
        },
        { id: 'originalPaymentAmount', label: 'Orig. Payment', minWidth: 120, align: 'right', render: (r) => <Box sx={styles.monospaceStyles}>{formatCurrency(r.originalPaymentAmount)}</Box> },
        {
            id: 'recoupmentAmount',
            label: 'Recoupment Amt',
            minWidth: 130,
            align: 'right',
            render: (r) => (
                <Typography variant="body2" sx={styles.amountStyles(theme)}>
                    {formatCurrency(r.recoupmentAmount)}
                </Typography>
            ),
        },
        { id: 'recoupmentDate', label: 'Date', minWidth: 110 },
        {
            id: 'reason',
            label: 'Reason',
            minWidth: 200,
            render: (r) => <Typography variant="body2" sx={styles.reasonStyles}>{r.reason}</Typography>,
        },
        { id: 'status', label: 'Status', minWidth: 120, filterOptions: ['Processed', 'Pending', 'Disputed'], render: (r) => <StatusBadge status={r.status} /> },
    ], [theme, handleView, handleEdit, handleDelete]);

    return (
        <Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 4 }}><SummaryCard title="Total Original Payments" value={formatCurrency(stats.totalOriginal)} variant="highlight" /></Grid>
                <Grid size={{ xs: 12, sm: 4 }}><SummaryCard title="Total Recouped" value={formatCurrency(stats.totalRecouped)} variant="negative" /></Grid>
                <Grid size={{ xs: 12, sm: 4 }}><SummaryCard title="Total Records" value={String(recoupments.length)} /></Grid>
            </Grid>
            <DataTable columns={columns} data={recoupments} rowKey={(r) => r.id} exportTitle="Recoupments" customToolbarContent={<RangeDropdown />} dictionaryId="recoupments" />
        </Box>
    );
};

export default RecoupmentsScreen;

