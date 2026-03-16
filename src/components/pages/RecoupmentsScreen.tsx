import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge';
import SummaryCard from '@/components/atoms/SummaryCard';
import RowActionMenu from '@/components/molecules/RowActionMenu';
import { useAppSelector, useAppDispatch } from '@/store';
import { RecoupmentRecord } from '@/types/financials';
import { formatCurrency } from '@/utils/formatters';
import { openViewDialog, openEditDialog, openConfirmDelete } from '@/store/slices/uiSlice';

const RecoupmentsScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const recoupments = useAppSelector((s) => s.financials.recoupments);

  const totalRecouped = recoupments.reduce((sum, r) => sum + Math.abs(r.recoupmentAmount), 0);
  const totalOriginal = recoupments.reduce((sum, r) => sum + r.originalPaymentAmount, 0);

  const columns: DataColumn<RecoupmentRecord>[] = [
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 60,
      render: (r) => (
        <RowActionMenu
          onView={() => dispatch(openViewDialog(r as unknown as Record<string, unknown>))}
          onEdit={() => dispatch(openEditDialog(r as unknown as Record<string, unknown>))}
          onDelete={() => dispatch(openConfirmDelete({ id: r.id, type: 'recoupment' }))}
        />
      ),
    },
    { id: 'recoupmentId', label: 'Recoupment ID', minWidth: 140, accessor: (r) => r.recoupmentId, render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.recoupmentId}</Typography> },
    { id: 'payer', label: 'Payer', minWidth: 140, accessor: (r) => r.payer, render: (r) => r.payer },
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
      render: (r) => (
        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{r.reason}</Typography>
      ),
    },
    { id: 'status', label: 'Status', minWidth: 120, accessor: (r) => r.status, filterOptions: ['Processed', 'Pending', 'Disputed'], render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <Box>
      {/* <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard title="Total Original Payments" value={formatCurrency(totalOriginal)} variant="highlight" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard title="Total Recouped" value={formatCurrency(totalRecouped)} variant="negative" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard title="Total Records" value={String(recoupments.length)} />
        </Grid>
      </Grid> */}
      <DataTable columns={columns} data={recoupments} rowKey={(r) => r.id} exportTitle="Recoupments" customToolbarContent={<RangeDropdown />} dictionaryId="recoupments" />
    </Box>
  );
};

export default RecoupmentsScreen;
