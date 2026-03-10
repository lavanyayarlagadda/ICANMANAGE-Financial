import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import SummaryCard from '@/components/atoms/SummaryCard';
import { useAppSelector } from '@/store';
import { VarianceRecord } from '@/types/financials';
import { formatCurrency } from '@/utils/formatters';

const VarianceScreen: React.FC = () => {
  const theme = useTheme();
  const varianceRecords = useAppSelector((s) => s.financials.varianceRecords);

  const totalExpected = varianceRecords.reduce((sum, r) => sum + r.expectedAllowed, 0);
  const totalActual = varianceRecords.reduce((sum, r) => sum + r.actualAllowed, 0);
  const netVariance = totalActual - totalExpected;

  const columns: DataColumn<VarianceRecord>[] = [
    {
      id: 'claim',
      label: 'Claim / Patient',
      minWidth: 200,
      accessor: (r) => r.patientName,
      render: (r) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.claimId}</Typography>
          <Typography variant="caption" color="text.secondary">{r.patientName}</Typography>
        </Box>
      ),
    },
    { id: 'payer', label: 'Payer', minWidth: 140, accessor: (r) => r.payer, render: (r) => r.payer },
    { id: 'billedCharge', label: 'Billed Charge', minWidth: 120, align: 'right', accessor: (r) => r.billedCharge, render: (r) => <Box sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.billedCharge)}</Box> },
    { id: 'expectedAllowed', label: 'Expected Allowed', minWidth: 140, align: 'right', accessor: (r) => r.expectedAllowed, render: (r) => <Box sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.expectedAllowed)}</Box> },
    { id: 'actualAllowed', label: 'Actual Allowed', minWidth: 130, align: 'right', accessor: (r) => r.actualAllowed, render: (r) => <Box sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.actualAllowed)}</Box> },
    {
      id: 'variance',
      label: 'Variance ($)',
      minWidth: 120,
      align: 'right',
      accessor: (r) => r.variance,
      render: (r) => (
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 600,
            color: r.variance < 0 ? theme.palette.error.main : r.variance > 0 ? theme.palette.success.main : theme.palette.text.primary,
          }}
        >
          {formatCurrency(r.variance)}
        </Typography>
      ),
    },
    {
      id: 'reasonCode',
      label: 'Reason Code',
      minWidth: 180,
      accessor: (r) => r.reasonCode,
      render: (r) => (
        <Typography
          variant="body2"
          sx={{
            color: r.reasonCode === 'Match' ? theme.palette.success.main : theme.palette.text.primary,
            fontWeight: r.reasonCode === 'Match' ? 600 : 400,
          }}
        >
          {r.reasonCode}
        </Typography>
      ),
    },
  ];

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard title="Total Expected Allowed" value={formatCurrency(totalExpected)} variant="highlight" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard title="Total Actual Allowed" value={formatCurrency(totalActual)} />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <SummaryCard title="Net Variance (Leakage)" value={formatCurrency(netVariance)} variant="negative" />
        </Grid>
      </Grid>

      <DataTable columns={columns} data={varianceRecords} rowKey={(r) => r.id} exportTitle="Variance Analysis"  customToolbarContent={<RangeDropdown />} />
    </Box>
  );
};

export default VarianceScreen;
