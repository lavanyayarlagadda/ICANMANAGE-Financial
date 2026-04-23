import React, { useMemo, useCallback } from 'react';
import { Box, Typography, IconButton, Grid, useTheme } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { formatCurrency, formatDate } from '@/utils/formatters';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import { themeConfig } from '@/theme/themeConfig';
import {
    ScreenWrapper,
    HeaderSection,
    PatientNameText,
    BoldAmount,
    VarianceText
} from './VarianceScreen.styles';
import { useVarianceScreen } from './VarianceScreen.hook';

import { FeeScheduleVariance, PaymentVariance } from '@/interfaces/financials';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';

const VarianceScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const { 
        activeSubTab, 
        queryParams, 
        globalFilters, 
        feeData, 
        feeSummaryData, 
        paymentData, 
        paymentSummaryData, 
        totalElementsFee,
        totalElementsPayment,
        handleDrillDown, 
        handleRangeChange, 
        handleSortChange, 
        handlePageChange, 
        handleRowsPerPageChange 
    } = useVarianceScreen({ skip });
    const theme = useTheme();
    const feeColumns = useMemo<DataColumn<FeeScheduleVariance | PaymentVariance>[]>(() => [
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 60,
            render: (r) => (
                <RowActionMenu
                    onView={() => handleDrillDown(r)}
                />
            ),
        },
        {
            id: 'transactionNo',
            label: 'TRANSACTION NUMBER',
            minWidth: 160,
            align: 'center',
            accessor: (r) => r.transactionNo || r.id || '-',
            render: (r) => <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{r.transactionNo || r.id || '-'}</Typography>
        },
        {
            id: 'paymentDate',
            label: 'PAYMENT DATE',
            minWidth: 120,
            align: 'center',
            accessor: (r) => r.paymentDate || '',
            render: (r) => <Typography variant="body2">{formatDate(r.paymentDate)}</Typography>
        },
        {
            id: 'patientName',
            label: 'PATIENT NAME',
            minWidth: 150,
            accessor: (r) => r.patientName,
            render: (r) => (
                <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 500, textTransform: 'uppercase' }}>
                    {r.patientName}
                </Typography>
            )
        },
        {
            id: 'payerName',
            label: 'PAYER NAME',
            minWidth: 180,
            accessor: (r) => r.payerName || '',
            render: (r) => <Typography variant="body2">{r.payerName}</Typography>
        },
        {
            id: 'expectedAllowed',
            label: 'EXPECTED ALLOWED',
            minWidth: 140,
            align: 'center',
            accessor: (r) => Number(r.expectedAllowed),
            render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(Number(r.expectedAllowed))}</Typography>
        },
        {
            id: 'actualAllowed',
            label: 'ACTUAL ALLOWED',
            minWidth: 140,
            align: 'center',
            accessor: (r) => Number(r.actualAllowed),
            render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(Number(r.actualAllowed))}</Typography>
        },
        {
            id: 'variance',
            label: 'VARIANCE',
            minWidth: 110,
            align: 'center',
            accessor: (r) => Number(r.variance),
            render: (r) => (
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 700,
                        color: Number(r.variance) > 0 ? theme.palette.error.main : theme.palette.text.primary,
                    }}
                >
                    {formatCurrency(Number(r.variance))}
                </Typography>
            ),
        },
        {
            id: 'adjustmentCode',
            label: 'ADJUSTMENT CODES',
            minWidth: 150,
            align: 'center',
            accessor: (r) => r.adjustmentCode || '',
            render: (r) => <Typography variant="body2">{r.adjustmentCode}</Typography>
        },
    ], [handleDrillDown, theme]);

    const summaryValues = useMemo(() => {
        const fee = feeSummaryData?.data;
        const pay = paymentSummaryData?.data;
        return activeSubTab === 0 ? { tExp: fee?.totalExpected ?? 0, tAct: fee?.totalActualAllowed ?? 0, tLeak: fee?.totalLeakage ?? 0, lbl2: 'ACTUAL ALLOWED' } : { tExp: pay?.totalExpected ?? 0, tAct: pay?.totalActualPaid ?? 0, tLeak: pay?.totalLeakage ?? 0, lbl2: 'ACTUAL PAID' };
    }, [activeSubTab, feeSummaryData, paymentSummaryData]);

    return (
        <ScreenWrapper>
            <HeaderSection><Typography variant="h6" sx={{ fontWeight: 700 }}>{activeSubTab === 0 ? 'Fee Variance' : 'Payment Variance'}</Typography></HeaderSection>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="EXPECTED" value={formatCurrency(summaryValues.tExp)} backgroundColor={themeConfig.colors.surface} /></Grid>
                <Grid size={{ xs: 12, md: 4 }}><SummaryCard title={summaryValues.lbl2} value={formatCurrency(summaryValues.tAct)} backgroundColor={themeConfig.colors.surface} /></Grid>
                <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="LEAKAGE" value={formatCurrency(summaryValues.tLeak)} backgroundColor={themeConfig.colors.surface} /></Grid>
            </Grid>
            <DataTable
                columns={feeColumns} data={activeSubTab === 0 ? (feeData?.data?.content ?? []) : (paymentData?.data?.content ?? [])}
                rowKey={(r) => r.id || `${r.patientName}-${r.variance}`} exportTitle="Variance Analysis"
                customToolbarContent={<RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />} serverSide
                totalElements={activeSubTab === 0 ? totalElementsFee : totalElementsPayment}
                page={queryParams.page} rowsPerPage={queryParams.size} sortCol={queryParams.sortField}
                sortDir={queryParams.sortOrder} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} onSortChange={handleSortChange}
                dictionaryId="variance-analysis"
                download={false}
            />
        </ScreenWrapper>
    );
};

export default VarianceScreen;
