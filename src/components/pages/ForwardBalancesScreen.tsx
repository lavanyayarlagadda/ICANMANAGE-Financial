import React from 'react';
import { Box, Typography, Chip, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge';
import SummaryCard from '@/components/atoms/SummaryCard';
import RowActionMenu from '@/components/molecules/RowActionMenu';
import { useAppSelector, useAppDispatch } from '@/store';
import { ForwardBalanceRecord } from '@/types/financials';
import { formatCurrency } from '@/utils/formatters';
import { openViewDialog, openEditDialog, openConfirmDelete } from '@/store/slices/uiSlice';

const ForwardBalancesScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const forwardBalances = useAppSelector((s) => s.financials.forwardBalances);

  const totalForwarded = forwardBalances.reduce((sum, r) => sum + r.forwardedAmount, 0);
  const totalApplied = forwardBalances.reduce((sum, r) => sum + r.appliedAmount, 0);
  const totalRemaining = forwardBalances.reduce((sum, r) => sum + r.remainingBalance, 0);

  const columns: DataColumn<ForwardBalanceRecord>[] = [
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 60,
      render: (r) => (
        <RowActionMenu
          onView={() => dispatch(openViewDialog(r as unknown as Record<string, unknown>))}
          onEdit={() => dispatch(openEditDialog(r as unknown as Record<string, unknown>))}
          onDelete={() => dispatch(openConfirmDelete({ id: r.id, type: 'forward balance' }))}
        />
      ),
    },
    { id: 'payer', label: 'Payer', minWidth: 140, accessor: (r) => r.payer, render: (r) => r.payer },
    {
      id: 'patient',
      label: 'Patient / Claim',
      minWidth: 180,
      accessor: (r) => r.patientName,
      render: (r) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.patientName}</Typography>
          <Typography variant="caption" color="text.secondary">{r.claimId}</Typography>
        </Box>
      ),
    },
    { id: 'originalPaymentDate', label: 'Orig. Payment Date', minWidth: 130, accessor: (r) => r.originalPaymentDate, render: (r) => r.originalPaymentDate },
    { id: 'forwardedDate', label: 'Forwarded Date', minWidth: 120, accessor: (r) => r.forwardedDate, render: (r) => r.forwardedDate },
    { id: 'forwardedAmount', label: 'Forwarded Amt', minWidth: 120, align: 'right', accessor: (r) => r.forwardedAmount, render: (r) => <Box sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.forwardedAmount)}</Box> },
    { id: 'appliedAmount', label: 'Applied Amt', minWidth: 110, align: 'right', accessor: (r) => r.appliedAmount, render: (r) => <Box sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.appliedAmount)}</Box> },
    {
      id: 'remainingBalance',
      label: 'Remaining',
      minWidth: 110,
      align: 'right',
      accessor: (r) => r.remainingBalance,
      render: (r) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: r.remainingBalance > 0 ? theme.palette.warning.main : theme.palette.success.main }}>
          {formatCurrency(r.remainingBalance)}
        </Typography>
      ),
    },
    {
      id: 'aging',
      label: 'Aging',
      minWidth: 100,
      accessor: (r) => r.aging,
      filterOptions: ['0-30', '31-60', '61-90', '91-120', '120+', 'N/A'],
      render: (r) => r.aging !== 'N/A' ? (
        <Chip label={r.aging} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
      ) : '–',
    },
    { id: 'status', label: 'Status', minWidth: 120, accessor: (r) => r.status, filterOptions: ['Fully Applied', 'Partially Applied', 'Pending'], render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard title="Total Forwarded" value={formatCurrency(totalForwarded)} variant="highlight" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard title="Total Applied" value={formatCurrency(totalApplied)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard title="Remaining Balance" value={formatCurrency(totalRemaining)} variant={totalRemaining > 0 ? 'negative' : 'default'} />
        </Grid>
      </Grid>
      <DataTable columns={columns} data={forwardBalances} rowKey={(r) => r.id} exportTitle="Forward Balances" customToolbarContent={<RangeDropdown />} />
    </Box>
  );
};

export default ForwardBalancesScreen;
