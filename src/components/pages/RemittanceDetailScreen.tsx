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
import DetailCard from '@/components/molecules/DetailCard';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import { ServiceLine } from '@/types/financials';
import MultiValueDisplay from '@/components/atoms/MultiValueDisplay';
import { useAppDispatch } from '@/store';
import { setRemittanceDetail, setSelectedClaimIndex } from '@/store/slices/financialsSlice';
import { Paper, List, ListItemButton, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';



const RemittanceDetailScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const detail = useAppSelector((s) => s.financials.remittanceDetail);
  const claims = useAppSelector((s) => s.financials.remittanceClaims);
  const selectedIndex = useAppSelector((s) => s.financials.selectedClaimIndex);

  if (!detail && (!claims || claims.length === 0)) return <Typography>No remittance detail selected.</Typography>;

  const handleClaimSelect = (index: number) => {
    const selectedClaim = claims[index];
    dispatch(setSelectedClaimIndex(index));
    dispatch(setRemittanceDetail({
      ...selectedClaim,
      serviceLines: detail?.serviceLines || [] // Keep service lines unless we re-fetch them
    }));
  };

  const totals = detail.serviceLines.reduce(
    (acc, sl) => ({
      charge: acc.charge + sl.charge,
      allowed: acc.allowed + sl.allowed,
      paid: acc.paid + sl.paid,
      adjustment: acc.adjustment + sl.adjAmt,
    }),
    { charge: 0, allowed: 0, paid: 0, adjustment: 0 }
  );

  const serviceLineColumns: DataColumn<ServiceLine>[] = [
    { id: 'lineNo', label: 'Line #', minWidth: 60, render: (r) => r.lineNo, accessor: (r) => r.lineNo },
    { id: 'procCode', label: 'Proc Code', render: (r) => r.procCode, accessor: (r) => r.procCode },
    { id: 'modifiers', label: 'Modifiers', render: (r) => r.modifiers || '–', accessor: (r) => r.modifiers || '' },
    { id: 'revCode', label: 'Rev Code', render: (r) => r.revCode, accessor: (r) => r.revCode },
    { id: 'dosStart', label: 'DOS Start', render: (r) => r.dosStart, accessor: (r) => r.dosStart },
    { id: 'dosEnd', label: 'DOS End', render: (r) => r.dosEnd, accessor: (r) => r.dosEnd },
    { id: 'units', label: 'Units', align: 'right', render: (r) => r.units, accessor: (r) => r.units },
    {
      id: 'charge', label: 'Charge', align: 'right',
      render: (r) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.charge)}</Typography>,
      accessor: (r) => r.charge,
    },
    {
      id: 'allowed', label: 'Allowed', align: 'right',
      render: (r) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.allowed)}</Typography>,
      accessor: (r) => r.allowed,
    },
    {
      id: 'paid', label: 'Paid', align: 'right',
      render: (r) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.paid)}</Typography>,
      accessor: (r) => r.paid,
    },
    {
      id: 'adjAmt', label: 'Adj Amt', align: 'right',
      render: (r) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.adjAmt)}</Typography>,
      accessor: (r) => r.adjAmt,
    },
    { id: 'adjGrp', label: 'Adj Grp', render: (r) => r.adjGrp, accessor: (r) => r.adjGrp },
    { id: 'reason', label: 'Reason', render: (r) => r.reason, accessor: (r) => r.reason },
    { id: 'remark', label: 'Remark', render: (r) => r.remark, accessor: (r) => r.remark },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Remittance Detail (Claims)</Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.main }}>
        Claim Detail – {detail?.patientName || 'N/A'}
      </Typography>

      {/* Claims List */}
      {claims && claims.length > 1 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Affected Claims in this Transaction ({claims.length})</Typography>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <List disablePadding>
              {claims.map((claim: any, idx: number) => (
                <ListItemButton
                  key={claim.payerIcn || idx}
                  selected={selectedIndex === idx}
                  onClick={() => handleClaimSelect(idx)}
                  divider={idx < claims.length - 1}
                  sx={{
                    '&.Mui-selected': { bgcolor: 'rgba(25, 118, 210, 0.08)' },
                    '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.04)' }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: selectedIndex === idx ? 'primary.main' : 'grey.300', width: 32, height: 32 }}>
                      <AssignmentIcon fontSize="small" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`ICN: ${claim.payerIcn}`}
                    secondary={`Charge: ${formatCurrency(claim.claimCharge)} | Status: ${claim.claimStatusCode}`}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Box>
      )}

      {detail && (
        <DetailCard
          sections={[
            {
              fields: [
                { label: "Payment Date", value: detail.paymentDate },
                { label: "Check/EFT Number", value: <MultiValueDisplay value={detail.transactionNo} displayCount={3} /> },
                { label: "Payment Amount", value: formatCurrency(detail.paymentAmount) },
                { label: "Payer Name", value: detail.payerName },
                { label: "Patient Name", value: detail.patientName },
                { label: "Patient CTL No", value: detail.patientCtlNo || (detail as any).patientCtrlNo || '–' },
              ]
            },
            {
              fields: [
                { label: "Payer ICN", value: detail.payerIcn },
                { label: "Statement Period", value: detail.statementPeriod },
                { label: "Claim Charge", value: formatCurrency(detail.claimCharge) },
                { label: "Allowed Amount", value: formatCurrency(detail.allowedAmount) },
                { label: "Claim Payment", value: formatCurrency(detail.claimPayment) },
                { label: "Contract Adj", value: formatCurrency(detail.contractAdj) },
              ]
            },
            {
              fields: [
                { label: "Adjustment Codes", value: detail.adjustmentCodes },
                { label: "Remit Remarks", value: detail.remitRemarks },
                { label: "Provider Adj Amount", value: formatCurrency(detail.providerAdjAmount) },
                { label: "Provider Adj Codes", value: detail.providerAdjCodes },
                { label: "Provider NPI", value: detail.providerNpi },
                { label: "Claim Status Code", value: detail.claimStatusCode },
              ]
            }
          ]}
          footer={
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Provider: {detail.providerName || 'N/A'}</Typography>
          }
        />
      )}

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>Service Line Details</Typography>
      <DataTable
        columns={serviceLineColumns}
        data={detail?.serviceLines || []}
        rowKey={(r) => String(r.lineNo)}
        paginated={false}
        exportTitle="Service Line Details"
        customToolbarContent={<RangeDropdown />}
        dictionaryId="service-lines"
      />
    </Box>
  );
};

export default RemittanceDetailScreen;
