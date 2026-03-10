import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useAppSelector } from '@/store';
import { formatCurrency } from '@/utils/formatters';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import { ServiceLine } from '@/types/financials';

const LabelValue: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Box sx={{ mb: 1.5 }}>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography>
  </Box>
);

const RemittanceDetailScreen: React.FC = () => {
  const theme = useTheme();
  const detail = useAppSelector((s) => s.financials.remittanceDetail);

  if (!detail) return <Typography>No remittance detail selected.</Typography>;

  const totals = detail.serviceLines.reduce(
    (acc, sl) => ({
      charge: acc.charge + sl.chargeAmount,
      allowed: acc.allowed + sl.allowedAmount,
      paid: acc.paid + sl.paidAmount,
      adjustment: acc.adjustment + sl.adjustmentAmount,
    }),
    { charge: 0, allowed: 0, paid: 0, adjustment: 0 }
  );

  const serviceLineColumns: DataColumn<ServiceLine>[] = [
    { id: 'lineNumber', label: 'Line #', minWidth: 60, render: (r) => r.lineNumber, accessor: (r) => r.lineNumber },
    { id: 'procedureCode', label: 'Proc Code', render: (r) => r.procedureCode, accessor: (r) => r.procedureCode },
    { id: 'modifiers', label: 'Modifiers', render: (r) => r.modifiers || '–', accessor: (r) => r.modifiers || '' },
    { id: 'revenueCode', label: 'Rev Code', render: (r) => r.revenueCode, accessor: (r) => r.revenueCode },
    { id: 'dosStart', label: 'DOS Start', render: (r) => r.dateOfServiceStart, accessor: (r) => r.dateOfServiceStart },
    { id: 'dosEnd', label: 'DOS End', render: (r) => r.dateOfServiceEnd, accessor: (r) => r.dateOfServiceEnd },
    { id: 'units', label: 'Units', align: 'right', render: (r) => r.units, accessor: (r) => r.units },
    {
      id: 'chargeAmount', label: 'Charge', align: 'right',
      render: (r) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.chargeAmount)}</Typography>,
      accessor: (r) => r.chargeAmount,
    },
    {
      id: 'allowedAmount', label: 'Allowed', align: 'right',
      render: (r) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.allowedAmount)}</Typography>,
      accessor: (r) => r.allowedAmount,
    },
    {
      id: 'paidAmount', label: 'Paid', align: 'right',
      render: (r) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.paidAmount)}</Typography>,
      accessor: (r) => r.paidAmount,
    },
    {
      id: 'adjustmentAmount', label: 'Adj Amt', align: 'right',
      render: (r) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.adjustmentAmount)}</Typography>,
      accessor: (r) => r.adjustmentAmount,
    },
    { id: 'adjGroup', label: 'Adj Grp', render: (r) => r.adjGroup, accessor: (r) => r.adjGroup },
    { id: 'adjReasonCode', label: 'Reason', render: (r) => r.adjReasonCode, accessor: (r) => r.adjReasonCode },
    { id: 'remarkCode', label: 'Remark', render: (r) => r.remarkCode, accessor: (r) => r.remarkCode },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Remittance Detail (Claims)</Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: theme.palette.primary.main }}>
        Claim Detail – {detail.patientName}
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Payment Date" value={detail.paymentDate} /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Check/EFT Number" value={detail.checkEftNumber} /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Payment Amount" value={formatCurrency(detail.paymentAmount)} /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Payer Name" value={detail.payerName} /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Patient Name" value={detail.patientName} /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Patient CTL No" value={detail.patientCtlNo} /></Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Payer ICN" value={detail.payerIcn} /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Statement Period" value={detail.statementPeriod} /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Claim Charge" value={formatCurrency(detail.claimCharge)} /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Allowed Amount" value={formatCurrency(detail.allowedAmount)} /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Claim Payment" value={formatCurrency(detail.claimPayment)} /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Contract Adj" value={formatCurrency(detail.contractAdj)} /></Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Adjustment Codes" value={detail.adjustmentCodes} /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Remit Remarks" value={detail.remitRemarks} /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Provider Adj Amount" value={formatCurrency(detail.providerAdjAmount)} /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Provider Adj Codes" value={detail.providerAdjCodes} /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Provider NPI" value={detail.providerNpi} /></Grid>
            <Grid size={{ xs: 6, sm: 4, md: 2 }}><LabelValue label="Claim Status Code" value={detail.claimStatusCode} /></Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Provider: {detail.providerName}</Typography>
        </CardContent>
      </Card>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Service Line Details</Typography>
      <DataTable
        columns={serviceLineColumns}
        data={detail.serviceLines}
        rowKey={(r) => String(r.lineNumber)}
        paginated={false}
        exportTitle="Service Line Details"
        selectable
        customToolbarContent={<RangeDropdown />}
      />
    </Box>
  );
};

export default RemittanceDetailScreen;
