import React, { useMemo } from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItemText,
    ListItemAvatar,
    CircularProgress,
    Stack,
    Pagination
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { formatCurrency, formatDate } from '@/utils/formatters';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import DetailCard from '@/components/molecules/DetailCard/DetailCard';
import { ServiceLine, RemittanceDetail } from '@/interfaces/financials';
import MultiValueDisplay from '@/components/atoms/MultiValueDisplay/MultiValueDisplay';
import {
    ScreenWrapper,
    SectionHeader,
    PatientNameHeader,
    StyledListItemButton,
    StyledAvatar,
    MonospaceAmount
} from './RemittanceDetailScreen.styles';
import { useRemittanceDetailScreen } from './RemittanceDetailScreen.hook';

const RemittanceDetailScreen: React.FC = () => {
    const {
        detail,
        claims,
        isClaimsFetching,
        claimsQueryParams,
        handleClaimsPageChange,
        selectedIndex,
        serviceLines,
        totalElements,
        totalClaims,
        isSlFetching,
        isSlLoading,
        slQueryParams,
        handleClaimSelect,
        handlePageChange,
        handleRowsPerPageChange,
        handleSortChange,
    } = useRemittanceDetailScreen();

    const serviceLineColumns = useMemo<DataColumn<ServiceLine>[]>(() => [
        { id: 'lineNo', label: 'Line #', minWidth: 60, render: (r) => r.lineNo, accessor: (r) => r.lineNo },
        { id: 'procCode', label: 'Proc Code', render: (r) => r.procCode, accessor: (r) => r.procCode },
        { id: 'modifiers', label: 'Modifiers', render: (r) => r.modifiers || '–', accessor: (r) => r.modifiers || '' },
        { id: 'revCode', label: 'Rev Code', render: (r) => r.revCode, accessor: (r) => r.revCode },
        { id: 'dosStart', label: 'DOS Start', render: (r) => formatDate(r.dosStart), accessor: (r) => r.dosStart },
        { id: 'dosEnd', label: 'DOS End', render: (r) => formatDate(r.dosEnd), accessor: (r) => r.dosEnd },
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
    ], []);

    if (!detail && (!claims || claims.length === 0)) return <Typography>No remittance detail selected.</Typography>;

    return (
        <ScreenWrapper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SectionHeader variant="h6">Remittance Detail (Claims)</SectionHeader>
                {isClaimsFetching && <CircularProgress size={20} />}
            </Box>
            <PatientNameHeader variant="subtitle1">Claim Detail – {detail?.patientName || 'N/A'}</PatientNameHeader>

            {claims && (
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Affected Claims in this Transaction</Typography>
                        {/* We could add a mini pagination here if total claims > size */}
                    </Box>
                    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <List disablePadding>
                            {claims.map((claim: RemittanceDetail, idx: number) => (
                                <StyledListItemButton key={claim.payerIcn || idx} selected={selectedIndex === idx} onClick={() => handleClaimSelect(idx)} divider={idx < claims.length - 1}>
                                    <ListItemAvatar><StyledAvatar isSelected={selectedIndex === idx}><AssignmentIcon fontSize="small" /></StyledAvatar></ListItemAvatar>
                                    <ListItemText primary={`ICN: ${claim.payerIcn}`} secondary={`Charge: ${formatCurrency(claim.claimCharge)} | Status: ${claim.claimStatusCode}`} primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
                                </StyledListItemButton>
                            ))}
                        </List>
                        {totalClaims > 3 && (
                            <Box sx={{ p: 1, display: 'flex', justifyContent: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                                <Pagination
                                    size="small"
                                    count={Math.ceil(totalClaims / 3)}
                                    page={claimsQueryParams.page + 1}
                                    onChange={(_, p) => handleClaimsPageChange(p - 1)}
                                />
                            </Box>
                        )}
                    </Paper>
                </Box>
            )}

            {detail && (
                <DetailCard
                    sections={[
                        { fields: [{ label: "Payment Date", value: formatDate(detail.paymentDate) }, { label: "Check/EFT Number", value: <MultiValueDisplay value={detail.transactionNo} displayCount={3} /> }, { label: "Payment Amount", value: formatCurrency(detail.paymentAmount) }, { label: "Payer Name", value: detail.payerName }, { label: "Patient Name", value: detail.patientName }, { label: "Patient CTL No", value: detail.patientCtlNo || detail.patientCtrlNo || '–' }] },
                        { fields: [{ label: "Payer ICN", value: detail.payerIcn }, { label: "Statement Period", value: detail.statementPeriod }, { label: "Claim Charge", value: formatCurrency(detail.claimCharge) }, { label: "Allowed Amount", value: formatCurrency(detail.allowedAmount) }, { label: "Claim Payment", value: formatCurrency(detail.claimPayment) }, { label: "Contract Adj", value: formatCurrency(detail.contractAdj) }] },
                        { fields: [{ label: "Adjustment Codes", value: detail.adjustmentCodes }, { label: "Remit Remarks", value: detail.remitRemarks }, { label: "Provider Adj Amount", value: formatCurrency(detail.providerAdjAmount) }, { label: "Provider Adj Codes", value: detail.providerAdjCodes }, { label: "Provider NPI", value: detail.providerNpi }, { label: "Claim Status Code", value: detail.claimStatusCode }] }
                    ]}
                    footer={<Typography variant="body2" sx={{ fontWeight: 600 }}>Provider: {detail.providerName || 'N/A'}</Typography>}
                />
            )}

            <Box sx={{ mt: 4, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Service Line Details</Typography>
                {(isSlFetching || isSlLoading) && <CircularProgress size={20} />}
            </Box>

            <DataTable
                columns={serviceLineColumns} data={serviceLines} rowKey={(r) => String(r.lineNo)}
                exportTitle="Service Line Details" dictionaryId="service-lines" serverSide
                page={slQueryParams.page} rowsPerPage={slQueryParams.size} sortCol={slQueryParams.sort}
                sortDir={slQueryParams.desc ? 'desc' : 'asc'} totalElements={totalElements}
                onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} onSortChange={handleSortChange} download={false}
            />
        </ScreenWrapper>
    );
};

export default RemittanceDetailScreen;
