import React from 'react';
import { Box, Typography, useTheme, IconButton, Grid } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAppSelector } from '@/store';
import { VarianceRecord } from '@/types/financials';
import { formatCurrency } from '@/utils/formatters';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import SummaryCard from '@/components/atoms/SummaryCard';

const VarianceScreen: React.FC = () => {
  const theme = useTheme();
  const varianceRecords = useAppSelector((s) => s.financials.varianceRecords);
  const { activeSubTab } = useAppSelector((s) => s.ui);


  const totalExpected = varianceRecords.reduce((sum, r) => sum + r.expectedAllowed, 0);
  const totalActual = varianceRecords.reduce((sum, r) => sum + r.actualAllowed, 0);
  const totalLeakage = varianceRecords.reduce((sum, r) => sum + r.variance, 0);

  const columns: DataColumn<VarianceRecord>[] = [
    {
      id: 'paymentDate',
      label: 'PAYMENT DATE',
      minWidth: 120,
      accessor: (r) => r.paymentDate,
      render: (r) => <Typography variant="body2">{r.paymentDate}</Typography>
    },
    {
      id: 'patientName',
      label: 'PATIENT NAME',
      minWidth: 150,
      accessor: (r) => r.patientName,
      render: (r) => (
        <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 500, cursor: 'pointer' }}>
          {r.patientName}
        </Typography>
      )
    },
    {
      id: 'payerName',
      label: 'PAYER NAME',
      minWidth: 180,
      accessor: (r) => r.payer,
      render: (r) => <Typography variant="body2">{r.payer}</Typography>
    },
    {
      id: 'expectedAllowed',
      label: 'EXPECTED ALLOWED',
      minWidth: 150,
      align: 'right',
      accessor: (r) => r.expectedAllowed,
      render: (r) => <Typography variant="body2" sx={{ fontWeight: 500 }}>{formatCurrency(r.expectedAllowed)}</Typography>
    },
    {
      id: 'actualAllowed',
      label: 'ACTUAL ALLOWED',
      minWidth: 150,
      align: 'right',
      accessor: (r) => r.actualAllowed,
      render: (r) => <Typography variant="body2" sx={{ fontWeight: 500 }}>{formatCurrency(r.actualAllowed)}</Typography>
    },
    {
      id: 'variance',
      label: 'VARIANCE',
      minWidth: 120,
      align: 'right',
      accessor: (r) => r.variance,
      render: (r) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: r.variance > 0 ? theme.palette.error.main : theme.palette.text.primary,
          }}
        >
          {formatCurrency(r.variance)}
        </Typography>
      ),
    },
    {
      id: 'adjustmentCodes',
      label: 'ADJUSTMENT CODES',
      minWidth: 160,
      accessor: (r) => r.adjustmentCodes,
      render: (r) => <Typography variant="body2">{r.adjustmentCodes}</Typography>
    },
    {
      id: 'action',
      label: 'ACTION',
      minWidth: 100,
      align: 'center',
      render: () => (
        <IconButton size="small" sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
          <VisibilityIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
        </IconButton>
      ),
    },
  ];

  const pageTitle = activeSubTab === 0 ? 'Fee Schedule Variance Analysis' : 'Payment Variance Analysis';
  const pageDescription = activeSubTab === 0
    ? 'Compares expected allowed amounts (fee schedule) against actual payer allowed amounts to identify underpayments.'
    : 'Identifies variances between actual paid amounts and expected payments based on contractual terms and remittance detail.';

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'rgb(10, 22, 40)' }}>
          {pageTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {pageDescription}
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard title="TOTAL EXPECTED" value={formatCurrency(totalExpected)} variant="default" backgroundColor="#fff" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard title="TOTAL ACTUAL ALLOWED" value={formatCurrency(totalActual)} backgroundColor="#fff" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard title="TOTAL LEAKAGE" value={formatCurrency(totalLeakage)} variant="default" backgroundColor="#fff" />
        </Grid>
      </Grid>



      <DataTable
        columns={columns}
        data={varianceRecords}
        rowKey={(r) => r.id}
        exportTitle={pageTitle}
        customToolbarContent={<RangeDropdown />}
      />
    </Box>
  );
};

export default VarianceScreen;

