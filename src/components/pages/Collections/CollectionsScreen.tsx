import React, { useMemo } from 'react';
import { Typography, Chip, Grid, Box, useTheme } from '@mui/material';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { CollectionAccount } from '@/interfaces/financials';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
    ScreenWrapper,
    HeaderBox,
    AccountNumberText,
    MonospaceBox,
    BalanceText,
    priorityColors,
} from './CollectionsScreen.styles';
import { useCollectionsScreen } from './CollectionsScreen.hook';

const CollectionsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const {
        collections,
        totalElements,
        queryParams,
        stats,
        handleView,
        handleEdit,
        handleDelete,
        handleRangeChange,
        handleSortChange,
        handlePageChange,
        handleRowsPerPageChange,
        isError,
    } = useCollectionsScreen({ skip });
    const theme = useTheme();

    const columns = useMemo<DataColumn<CollectionAccount>[]>(() => [
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 60,
            render: (r) => (
                <RowActionMenu
                    onView={() => handleView(r)}
                    onEdit={() => handleEdit(r)}
                    onDelete={() => handleDelete(r.id)}
                />
            ),
        },
        { id: 'accountNumber', label: 'Account #', minWidth: 140, align: 'center', accessor: (r) => r.accountNumber, render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.accountNumber}</Typography> },
        { id: 'patientName', label: 'Patient Name', minWidth: 160, accessor: (r) => r.patientName, render: (r) => r.patientName },
        { id: 'payer', label: 'Payer', minWidth: 140, accessor: (r) => r.payer, render: (r) => r.payer },
        // { id: 'description', label: 'Description', minWidth: 180, accessor: (r) => r.description ?? '-', render: (r) => r.description ?? '-' },
        { id: 'totalDue', label: 'Total Due', minWidth: 110, align: 'center', accessor: (r) => r.totalDue, render: (r) => <Box sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.totalDue)}</Box> },
        { id: 'amountCollected', label: 'Collected', minWidth: 110, align: 'center', accessor: (r) => r.amountCollected, render: (r) => <Box sx={{ fontFamily: 'monospace', color: 'success.main' }}>{formatCurrency(r.amountCollected)}</Box> },
        { id: 'balance', label: 'Balance', minWidth: 110, align: 'center', accessor: (r) => r.balance, render: (r) => <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: r.balance > 0 ? theme.palette.error.main : theme.palette.success.main }}>{formatCurrency(r.balance)}</Typography> },
        { id: 'lastActivityDate', label: 'Last Activity', minWidth: 110, align: 'center', accessor: (r) => r.lastActivityDate, render: (r) => formatDate(r.lastActivityDate) },
        { id: 'assignedTo', label: 'Assigned To', minWidth: 110, accessor: (r) => r.assignedTo, render: (r) => r.assignedTo },
        {
            id: 'aging',
            label: 'Aging',
            minWidth: 100,
            accessor: (r) => r.aging,
            filterOptions: ['0-30', '31-60', '61-90', '91-120', '120+', 'N/A'],
            render: (r) => r.aging !== 'N/A' ? <Chip label={r.aging} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} /> : '–',
        },
        {
            id: 'priority',
            label: 'Priority',
            minWidth: 90,
            accessor: (r) => r.priority,
            filterOptions: ['High', 'Medium', 'Low'],
            render: (r) => {
                const colors = priorityColors[r.priority];
                return <Chip label={r.priority} size="small" sx={{ backgroundColor: colors.bg, color: colors.text, fontWeight: 600, fontSize: '0.7rem' }} />;
            },
        },
        { id: 'status', label: 'Status', minWidth: 120, accessor: (r) => r.status, filterOptions: ['Open', 'In Progress', 'Closed', 'Settled'], render: (r) => <StatusBadge status={r.status} /> },
    ], [handleView, handleEdit, handleDelete, theme]);

    return (
        <ScreenWrapper>
            <HeaderBox>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Collections</Typography>
                <Typography variant="body2" color="text.secondary">Manage collection accounts, track balances, and monitor recovery efforts.</Typography>
            </HeaderBox>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SummaryCard title="Total Due" value={formatCurrency(stats.totalDue)} variant="highlight" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SummaryCard title="Total Collected" value={formatCurrency(stats.totalCollected)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SummaryCard title="Outstanding Balance" value={formatCurrency(stats.totalBalance)} variant="negative" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SummaryCard title="Open Accounts" value={String(stats.openAccounts)} />
                </Grid>
            </Grid>

            <DataTable
                columns={columns}
                data={collections || []}
                rowKey={(r) => r.id}
                exportTitle="Collections"
                selectable
                customToolbarContent={<RangeDropdown onChange={handleRangeChange} />}
                dictionaryId="collections"
                serverSide
                totalElements={totalElements}
                page={queryParams.page}
                rowsPerPage={queryParams.size}
                sortCol={queryParams.sortField}
                sortDir={queryParams.sortOrder}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSortChange={handleSortChange}
                download={false}
            />
        </ScreenWrapper>
    );
};

export default CollectionsScreen;

