import React, { useMemo } from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAppSelector } from '@/store';
import { VarianceRecord } from '@/types/financials';
import { formatCurrency } from '@/utils/formatters';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import SummaryCard from '@/components/atoms/SummaryCard';
import { 
  ScreenTitle, 
  PageHeader, 
  SummaryGridContainer, 
  PatientNameText, 
  VarianceValue 
} from './VarianceScreen.styles';

const VarianceScreen: React.FC = () => {
  const varianceRecords = useAppSelector((s) => s.financials.varianceRecords);
  const { activeSubTab } = useAppSelector((s) => s.ui);

  const totals = useMemo(() => {
    return varianceRecords.reduce((acc, r) => ({
      expected: acc.expected + r.expectedAllowed,
      actual: acc.actual + r.actualAllowed,
      leakage: acc.leakage + r.variance,
    }), { expected: 0, actual: 0, leakage: 0 });
  }, [varianceRecords]);

  const columns: DataColumn<VarianceRecord>[] = useMemo(() => [
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
        <PatientNameText variant="body2">
          {r.patientName}
        </PatientNameText>
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
        <VarianceValue variant="body2" isPositive={r.variance > 0}>
          {formatCurrency(r.variance)}
        </VarianceValue>
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
        <IconButton size="small" sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
          <VisibilityIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
        </IconButton>
      ),
    },
  ], []);

  const pageTitle = activeSubTab === 0 ? 'Fee Schedule Variance Analysis' : 'Payment Variance Analysis';
  const pageDescription = activeSubTab === 0
    ? 'Compares expected allowed amounts (fee schedule) against actual payer allowed amounts to identify underpayments.'
    : 'Identifies variances between actual paid amounts and expected payments based on contractual terms and remittance detail.';

  return (
    <Box>
      <PageHeader>
        <ScreenTitle variant="h6">
          {pageTitle}
        </ScreenTitle>
        <Typography variant="body2" color="text.secondary">
          {pageDescription}
        </Typography>
      </PageHeader>

      <SummaryGridContainer>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <SummaryCard title="TOTAL EXPECTED" value={formatCurrency(totals.expected)} variant="default" backgroundColor="#fff" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SummaryCard title="TOTAL ACTUAL ALLOWED" value={formatCurrency(totals.actual)} backgroundColor="#fff" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <SummaryCard title="TOTAL LEAKAGE" value={formatCurrency(totals.leakage)} variant="default" backgroundColor="#fff" />
          </Grid>
        </Grid>
      </SummaryGridContainer>

      <DataTable
        columns={columns}
        data={varianceRecords}
        rowKey={(r) => r.id}
        exportTitle={pageTitle}
        customToolbarContent={<RangeDropdown />}
        dictionaryId="variance-analysis"
      />
    </Box>
  );
};

export default VarianceScreen;
