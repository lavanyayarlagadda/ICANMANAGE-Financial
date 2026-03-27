import React, { useMemo } from 'react';
import { Typography, Chip, Grid } from '@mui/material';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { CollectionAccount } from '@/interfaces/financials';
import { formatCurrency } from '@/utils/formatters';
import {
    ScreenWrapper,
    HeaderBox,
    AccountNumberText,
    MonospaceBox,
    BalanceText,
    priorityColors,
} from './CollectionsScreen.styles';
import { useCollectionsScreen } from './CollectionsScreen.hook';

const CollectionsScreen: React.FC = () => {
    const {
        collections,
        stats,
        handleView,
        handleEdit,
        handleDelete,
    } = useCollectionsScreen();

    const columns = useMemo<DataColumn<CollectionAccount>[]>(() => [
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
        { id: 'accountNumber', label: 'Account #', minWidth: 140, render: (r) => <AccountNumberText variant="body2">{r.accountNumber}</AccountNumberText> },
        { id: 'patientName', label: 'Patient Name', minWidth: 160 },
        { id: 'payer', label: 'Payer', minWidth: 140 },
        { id: 'totalDue', label: 'Total Due', minWidth: 110, align: 'right', render: (r) => <MonospaceBox>{formatCurrency(r.totalDue)}</MonospaceBox> },
        { id: 'amountCollected', label: 'Collected', minWidth: 110, align: 'right', render: (r) => <MonospaceBox sx={{ color: 'success.main' }}>{formatCurrency(r.amountCollected)}</MonospaceBox> },
        {
            id: 'balance',
            label: 'Balance',
            minWidth: 110,
            align: 'right',
            render: (r) => (
                <BalanceText variant="body2" balance={r.balance}>
                    {formatCurrency(r.balance)}
                </BalanceText>
            ),
        },
        { id: 'lastActivityDate', label: 'Last Activity', minWidth: 110 },
        { id: 'assignedTo', label: 'Assigned To', minWidth: 110 },
        {
            id: 'aging',
            label: 'Aging',
            minWidth: 100,
            filterOptions: ['0-30', '31-60', '61-90', '91-120', '120+', 'N/A'],
            render: (r) => r.aging !== 'N/A' ? <Chip label={r.aging} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} /> : '–',
        },
        {
            id: 'priority',
            label: 'Priority',
            minWidth: 90,
            filterOptions: ['High', 'Medium', 'Low'],
            render: (r) => {
                const colors = priorityColors[r.priority];
                return <Chip label={r.priority} size="small" sx={{ backgroundColor: colors.bg, color: colors.text, fontWeight: 600, fontSize: '0.7rem' }} />;
            },
        },
        { id: 'status', label: 'Status', minWidth: 120, filterOptions: ['Open', 'In Progress', 'Closed', 'Settled'], render: (r) => <StatusBadge status={r.status} /> },
    ], [handleView, handleEdit, handleDelete]);

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
                data={collections}
                rowKey={(r) => r.id}
                exportTitle="Collections"
                selectable
                customToolbarContent={<RangeDropdown />}
                dictionaryId="collections"
            />
        </ScreenWrapper>
    );
};

export default CollectionsScreen;

