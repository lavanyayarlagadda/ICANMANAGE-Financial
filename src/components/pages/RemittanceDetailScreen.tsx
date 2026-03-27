import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppSelector } from '@/store';
import { formatCurrency } from '@/utils/formatters';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import DetailCard from '@/components/molecules/DetailCard';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import { ServiceLine } from '@/types/financials';
import { 
  ScreenHeader, 
  ScreenSubtitle, 
  SectionTitle, 
  MonospaceText, 
  ProviderText 
} from './RemittanceDetailScreen.styles';

const RemittanceDetailScreen: React.FC = () => {
  const detail = useAppSelector((s) => s.financials.remittanceDetail);

  const serviceLineColumns: DataColumn<ServiceLine>[] = useMemo(() => [
    { id: 'lineNumber', label: 'Line #', minWidth: 60, render: (r) => r.lineNumber, accessor: (r) => r.lineNumber },
    { id: 'procedureCode', label: 'Proc Code', render: (r) => r.procedureCode, accessor: (r) => r.procedureCode },
    { id: 'modifiers', label: 'Modifiers', render: (r) => r.modifiers || '–', accessor: (r) => r.modifiers || '' },
    { id: 'revenueCode', label: 'Rev Code', render: (r) => r.revenueCode, accessor: (r) => r.revenueCode },
    { id: 'dosStart', label: 'DOS Start', render: (r) => r.dateOfServiceStart, accessor: (r) => r.dateOfServiceStart },
    { id: 'dosEnd', label: 'DOS End', render: (r) => r.dateOfServiceEnd, accessor: (r) => r.dateOfServiceEnd },
    { id: 'units', label: 'Units', align: 'right', render: (r) => r.units, accessor: (r) => r.units },
    {
      id: 'chargeAmount', label: 'Charge', align: 'right',
      render: (r) => <MonospaceText variant="body2">{formatCurrency(r.chargeAmount)}</MonospaceText>,
      accessor: (r) => r.chargeAmount,
    },
    {
      id: 'allowedAmount', label: 'Allowed', align: 'right',
      render: (r) => <MonospaceText variant="body2">{formatCurrency(r.allowedAmount)}</MonospaceText>,
      accessor: (r) => r.allowedAmount,
    },
    {
      id: 'paidAmount', label: 'Paid', align: 'right',
      render: (r) => <MonospaceText variant="body2">{formatCurrency(r.paidAmount)}</MonospaceText>,
      accessor: (r) => r.paidAmount,
    },
    {
      id: 'adjustmentAmount', label: 'Adj Amt', align: 'right',
      render: (r) => <MonospaceText variant="body2">{formatCurrency(r.adjustmentAmount)}</MonospaceText>,
      accessor: (r) => r.adjustmentAmount,
    },
    { id: 'adjGroup', label: 'Adj Grp', render: (r) => r.adjGroup, accessor: (r) => r.adjGroup },
    { id: 'adjReasonCode', label: 'Reason', render: (r) => r.adjReasonCode, accessor: (r) => r.adjReasonCode },
    { id: 'remarkCode', label: 'Remark', render: (r) => r.remarkCode, accessor: (r) => r.remarkCode },
  ], []);

  const detailSections = useMemo(() => {
    if (!detail) return [];
    return [
      {
        fields: [
          { label: "Payment Date", value: detail.paymentDate },
          { label: "Check/EFT Number", value: detail.checkEftNumber },
          { label: "Payment Amount", value: formatCurrency(detail.paymentAmount) },
          { label: "Payer Name", value: detail.payerName },
          { label: "Patient Name", value: detail.patientName },
          { label: "Patient CTL No", value: detail.patientCtlNo },
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
    ];
  }, [detail]);

  if (!detail) return <Typography>No remittance detail selected.</Typography>;

  return (
    <Box>
      <ScreenHeader variant="h6">Remittance Detail (Claims)</ScreenHeader>
      <ScreenSubtitle variant="subtitle1">
        Claim Detail – {detail.patientName}
      </ScreenSubtitle>

      <DetailCard
        sections={detailSections}
        footer={
          <ProviderText variant="body2">Provider: {detail.providerName}</ProviderText>
        }
      />

      <SectionTitle variant="subtitle1">Service Line Details</SectionTitle>
      <DataTable
        columns={serviceLineColumns}
        data={detail.serviceLines}
        rowKey={(r) => String(r.lineNumber)}
        paginated={false}
        exportTitle="Service Line Details"
        customToolbarContent={<RangeDropdown />}
        dictionaryId="service-lines"
      />
    </Box>
  );
};

export default RemittanceDetailScreen;
