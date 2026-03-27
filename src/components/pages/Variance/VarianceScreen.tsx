import React, { useMemo, useCallback } from 'react';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatCurrency } from '@/utils/formatters';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import { 
  ScreenWrapper, 
  HeaderSection, 
  PatientNameText, 
  BoldAmount, 
  VarianceText 
} from './VarianceScreen.styles';
import { useVarianceScreen } from './VarianceScreen.hook';

const VarianceScreen: React.FC = () => {
    const { activeSubTab, queryParams, feeData, feeSummaryData, paymentData, paymentSummaryData, handleDrillDown, handleRangeChange, handleSortChange, handlePageChange, handleRowsPerPageChange } = useVarianceScreen();

    const feeColumns = useMemo<DataColumn<any>[]>(() => [
        { id: 'paymentDate', label: 'PAYMENT DATE', minWidth: 120 },
        { id: 'patientName', label: 'PATIENT NAME', minWidth: 150, render: (r) => <PatientNameText variant="body2">{r.patientName}</PatientNameText> },
        { id: 'payerName', label: 'PAYER NAME', minWidth: 180 },
        { id: 'expectedAllowed', label: 'EXPECTED', minWidth: 140, align: 'right', render: (r) => <BoldAmount variant="body2">{formatCurrency(Number(r.expectedAllowed))}</BoldAmount> },
        { id: 'actualAllowed', label: 'ACTUAL', minWidth: 140, align: 'right', render: (r) => <BoldAmount variant="body2">{formatCurrency(Number(r.actualAllowed))}</BoldAmount> },
        { id: 'variance', label: 'VARIANCE', minWidth: 110, align: 'right', render: (r) => <VarianceText variant="body2" amount={Number(r.variance)}>{formatCurrency(Number(r.variance))}</VarianceText> },
        { id: 'action', label: 'ACTION', minWidth: 80, align: 'center', render: (r) => <IconButton size="small" onClick={() => handleDrillDown(r)}><VisibilityIcon sx={{ fontSize: 18 }} /></IconButton> },
    ], [handleDrillDown]);

    const summaryValues = useMemo(() => {
        const fee = feeSummaryData?.data;
        const pay = paymentSummaryData?.data;
        return activeSubTab === 0 ? { tExp: fee?.totalExpected ?? 0, tAct: fee?.totalActualAllowed ?? 0, tLeak: fee?.totalLeakage ?? 0, lbl2: 'ACTUAL ALLOWED' } : { tExp: pay?.totalExpected ?? 0, tAct: pay?.totalActualPaid ?? 0, tLeak: pay?.totalLeakage ?? 0, lbl2: 'ACTUAL PAID' };
    }, [activeSubTab, feeSummaryData, paymentSummaryData]);

    return (
        <ScreenWrapper>
            <HeaderSection><Typography variant="h6" sx={{ fontWeight: 700 }}>{activeSubTab === 0 ? 'Fee Variance' : 'Payment Variance'}</Typography></HeaderSection>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="EXPECTED" value={formatCurrency(summaryValues.tExp)} backgroundColor="#fff" /></Grid>
                <Grid size={{ xs: 12, md: 4 }}><SummaryCard title={summaryValues.lbl2} value={formatCurrency(summaryValues.tAct)} backgroundColor="#fff" /></Grid>
                <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="LEAKAGE" value={formatCurrency(summaryValues.tLeak)} backgroundColor="#fff" /></Grid>
            </Grid>
            <DataTable
                columns={feeColumns} data={activeSubTab === 0 ? (feeData?.data?.content ?? []) : (paymentData?.data?.content ?? [])}
                rowKey={(r: any) => r.id || `${r.patientName}-${r.variance}`} exportTitle="Variance Analysis"
                customToolbarContent={<RangeDropdown onChange={handleRangeChange} />} serverSide
                totalElements={activeSubTab === 0 ? (feeData?.data?.totalElements ?? 0) : (paymentData?.data?.totalElements ?? 0)}
                page={queryParams.page} rowsPerPage={queryParams.size} sortCol={queryParams.sortField}
                sortDir={queryParams.sortOrder} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} onSortChange={handleSortChange}
            />
        </ScreenWrapper>
    );
};

export default VarianceScreen;
