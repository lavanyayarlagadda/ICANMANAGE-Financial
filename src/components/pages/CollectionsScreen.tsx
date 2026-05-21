import React from 'react';
import { Box, Typography, Chip, useTheme, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import Grid from '@mui/material/Grid';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge';
import SummaryCard from '@/components/atoms/SummaryCard';
import RowActionMenu from '@/components/molecules/RowActionMenu';
import { useAppSelector, useAppDispatch } from '@/store';
import { CollectionAccount } from '@/types/financials';
import { formatCurrency } from '@/utils/formatters';
import { openViewDialog, openEditDialog, openConfirmDelete, setIsReloading } from '@/store/slices/uiSlice';
import { useRef, useEffect } from 'react';

const priorityColors: Record<string, { bg: string; text: string }> = {
  High: { bg: '#FFEBEE', text: '#C62828' },
  Medium: { bg: '#FFF3E0', text: '#E65100' },
  Low: { bg: '#E8F5E9', text: '#2E7D32' },
};

const CollectionsScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const collections = useAppSelector((s) => s.financials.collections);
  const { isReloading } = useAppSelector((s) => s.ui);

  const handleReload = async () => {
    try {
      dispatch(setIsReloading(true));
      await new Promise(r => setTimeout(r, 1000)); // Simulate fetch
    } finally {
      dispatch(setIsReloading(false));
    }
  };

  const totalDue = collections.reduce((sum, r) => sum + r.totalDue, 0);
  const totalCollected = collections.reduce((sum, r) => sum + r.amountCollected, 0);
  const totalBalance = collections.reduce((sum, r) => sum + r.balance, 0);
  const openAccounts = collections.filter((c) => c.status === 'Open').length;

  const columns: DataColumn<CollectionAccount>[] = [
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 60,
      render: (r) => (
        <RowActionMenu
          onView={() => dispatch(openViewDialog(r as unknown as Record<string, unknown>))}
          onEdit={() => dispatch(openEditDialog(r as unknown as Record<string, unknown>))}
          onDelete={() => dispatch(openConfirmDelete({ id: r.id, type: 'collection' }))}
        />
      ),
    },
    { id: 'accountNumber', label: 'Account #', minWidth: 140, accessor: (r) => r.accountNumber, render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.accountNumber}</Typography> },
    { id: 'patientName', label: 'Patient Name', minWidth: 160, accessor: (r) => r.patientName, render: (r) => r.patientName },
    { id: 'payer', label: 'Payer', minWidth: 140, accessor: (r) => r.payer, render: (r) => r.payer },
    { id: 'totalDue', label: 'Total Due', minWidth: 110, align: 'right', accessor: (r) => r.totalDue, render: (r) => <Box sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.totalDue)}</Box> },
    { id: 'amountCollected', label: 'Collected', minWidth: 110, align: 'right', accessor: (r) => r.amountCollected, render: (r) => <Box sx={{ fontFamily: 'monospace', color: 'success.main' }}>{formatCurrency(r.amountCollected)}</Box> },
    {
      id: 'balance',
      label: 'Balance',
      minWidth: 110,
      align: 'right',
      accessor: (r) => r.balance,
      render: (r) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: r.balance > 0 ? theme.palette.error.main : theme.palette.success.main }}>
          {formatCurrency(r.balance)}
        </Typography>
      ),
    },
    { id: 'lastActivityDate', label: 'Last Activity', minWidth: 110, accessor: (r) => r.lastActivityDate, render: (r) => r.lastActivityDate },
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
  ];

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Collections</Typography>
          <Typography variant="body2" color="text.secondary">Manage collection accounts, track balances, and monitor recovery efforts.</Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          onClick={handleReload}
          disabled={isReloading}
          startIcon={<RefreshIcon sx={{ fontSize: 18 }} />}
          sx={{
            color: '#000',
            borderColor: '#000',
            borderWidth: 1.5,
            borderRadius: '6px',
            textTransform: 'none',
            px: 2,
            py: 0.7,
            fontSize: '13px',
            fontWeight: 700,
            '&:hover': { borderWidth: 1.5, bgcolor: 'rgba(0,0,0,0.04)' }
          }}
        >
          Reload
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <SummaryCard title="Total Due" value={formatCurrency(totalDue)} variant="highlight" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <SummaryCard title="Total Collected" value={formatCurrency(totalCollected)} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <SummaryCard title="Outstanding Balance" value={formatCurrency(totalBalance)} variant="negative" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <SummaryCard title="Open Accounts" value={String(openAccounts)} />
        </Grid>
      </Grid>

      <DataTable columns={columns} data={collections} rowKey={(r) => r.id} exportTitle="Collections" selectable customToolbarContent={<RangeDropdown />} dictionaryId="collections" />
    </Box>
  );
};

export default CollectionsScreen;
