import React, { useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useAppSelector, useAppDispatch } from '@/store';
import { formatCurrency } from '@/utils/formatters';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import DetailCard from '@/components/molecules/DetailCard';
import { ServiceLine } from '@/types/financials';
import MultiValueDisplay from '@/components/atoms/MultiValueDisplay';
import { setRemittanceDetail, setSelectedClaimIndex } from '@/store/slices/financialsSlice';
import { useSearchServiceLinesQuery } from '@/store/api/financialsApi';
import { 
  ScreenWrapper, 
  SectionHeader, 
  PatientNameHeader, 
  StyledListItemButton, 
  StyledAvatar, 
  MonospaceAmount 
} from './RemittanceDetailScreen.styles';

const RemittanceDetailScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const detail = useAppSelector((s) => s.financials.remittanceDetail);
  const claims = useAppSelector((s) => s.financials.remittanceClaims);
  const selectedIndex = useAppSelector((s) => s.financials.selectedClaimIndex);

  // Dynamic Query Params for Service Lines
  const [slQueryParams, setSlQueryParams] = React.useState({
    page: 0,
    size: 10,
    sort: 'lineNumber',
    desc: false,
  });

  const { data: slData, isFetching: isSlFetching, isLoading: isSlLoading } = useSearchServiceLinesQuery({
    page: slQueryParams.page + 1,
    size: slQueryParams.size,
    sort: slQueryParams.sort,
    desc: slQueryParams.desc,
    check: detail?.transactionNo || '',
  }, { skip: !detail?.transactionNo });

  if (!detail && (!claims || claims.length === 0)) return <Typography>No remittance detail selected.</Typography>;

  const handleClaimSelect = useCallback((index: number) => {
    const selectedClaim = claims[index];
    dispatch(setSelectedClaimIndex(index));
    dispatch(setRemittanceDetail(selectedClaim));
    setSlQueryParams(prev => ({ ...prev, page: 0 }));
  }, [dispatch, claims]);

  const serviceLines = slData?.data?.content || [];
  const totalElements = slData?.data?.totalElements || 0;

  const serviceLineColumns = useMemo<DataColumn<ServiceLine>[]>(() => [
    { id: 'lineNo', label: 'Line #', minWidth: 60 },
    { id: 'procCode', label: 'Proc Code' },
    { id: 'modifiers', label: 'Modifiers', render: (r) => r.modifiers || '–' },
    { id: 'revCode', label: 'Rev Code' },
    { id: 'dosStart', label: 'DOS Start' },
    { id: 'dosEnd', label: 'DOS End' },
    { id: 'units', label: 'Units', align: 'right' },
    {
      id: 'charge', label: 'Charge', align: 'right',
      render: (r) => <MonospaceAmount variant="body2">{formatCurrency(r.charge)}</MonospaceAmount>
    },
    {
      id: 'allowed', label: 'Allowed', align: 'right',
      render: (r) => <MonospaceAmount variant="body2">{formatCurrency(r.allowed)}</MonospaceAmount>
    },
    {
      id: 'paid', label: 'Paid', align: 'right',
      render: (r) => <MonospaceAmount variant="body2">{formatCurrency(r.paid)}</MonospaceAmount>
    },
    {
      id: 'adjAmt', label: 'Adj Amt', align: 'right',
      render: (r) => <MonospaceAmount variant="body2">{formatCurrency(r.adjAmt)}</MonospaceAmount>
    },
    { id: 'adjGrp', label: 'Adj Grp' },
    { id: 'reason', label: 'Reason' },
    { id: 'remark', label: 'Remark' },
  ], []);

  return (
    <ScreenWrapper>
      <SectionHeader variant="h6">Remittance Detail (Claims)</SectionHeader>
      <PatientNameHeader variant="subtitle1">
        Claim Detail – {detail?.patientName || 'N/A'}
      </PatientNameHeader>

      {/* Claims List */}
      {claims && claims.length > 1 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Affected Claims in this Transaction ({claims.length})</Typography>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <List disablePadding>
              {claims.map((claim: any, idx: number) => (
                <StyledListItemButton
                  key={claim.payerIcn || idx}
                  selected={selectedIndex === idx}
                  onClick={() => handleClaimSelect(idx)}
                  divider={idx < claims.length - 1}
                >
                  <ListItemAvatar>
                    <StyledAvatar isSelected={selectedIndex === idx}>
                      <AssignmentIcon fontSize="small" />
                    </StyledAvatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`ICN: ${claim.payerIcn}`}
                    secondary={`Charge: ${formatCurrency(claim.claimCharge)} | Status: ${claim.claimStatusCode}`}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </StyledListItemButton>
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

      <Box sx={{ mt: 4, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Service Line Details</Typography>
        {(isSlFetching || isSlLoading) && <CircularProgress size={20} />}
      </Box>

      <DataTable
        columns={serviceLineColumns}
        data={serviceLines}
        rowKey={(r) => String(r.lineNo)}
        exportTitle="Service Line Details"
        dictionaryId="service-lines"
        serverSide
        page={slQueryParams.page}
        rowsPerPage={slQueryParams.size}
        sortCol={slQueryParams.sort}
        sortDir={slQueryParams.desc ? 'desc' : 'asc'}
        totalElements={totalElements}
        onPageChange={(p) => setSlQueryParams(prev => ({ ...prev, page: p }))}
        onRowsPerPageChange={(s) => setSlQueryParams(prev => ({ ...prev, size: s, page: 0 }))}
        onSortChange={(col, dir) => setSlQueryParams(prev => ({ ...prev, sort: col, desc: dir === 'desc', page: 0 }))}
      />
    </ScreenWrapper>
  );
};

export default RemittanceDetailScreen;
