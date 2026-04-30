import { Box, CardContent, Grid, Typography, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { Area, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';

import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import { formatCurrency } from '@/utils/formatters';

import {
    ChartContainer,
    LegendWrapper,
    PieChartWrapper,
    RichCard,
    SectionHeader,
    TitleText,
    TrendsWrapper
} from './TrendsScreen.styles';
import { useTrendsScreen } from './TrendsScreen.hook';

import { ForecastDashboardResponse } from '@/interfaces/api';
import { PayerPerformanceRecord } from '@/interfaces/financials';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';

interface PerformanceData {
    month: string;
    actualReconciledAmount: string | number | null;
    forecastAmount: string | number | null;
}

const TrendsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const theme = useTheme();
    const {
        activeSubTab,
        forecastSummary,
        reconPerformance,
        dashboardData,
        execSummary,
        paymentMix,
        adjBreakdown,
        payerPerformanceRecords,
        totalElementsPayer,
        handleRangeChange,
        handlePageChange,
        handleRowsPerPageChange,
        handleDrillDown,
        globalFilters,
        isMindpath,
        isFetching,
    } = useTrendsScreen({ skip });

    const teamColumns = useMemo<DataColumn<ForecastDashboardResponse['data'][0]>[]>(() => [
        {
            id: 'team',
            label: 'TEAM',
            minWidth: 150,
            align: 'center',
            disableSort: true,
            render: (row) => (
                <Typography variant="body2" sx={{ fontWeight: row.team === 'OVERALL' ? 700 : 500 }}>
                    {row.team}
                </Typography>
            ),
            accessor: (row) => row.team,
        },
        { id: 'reconciledCheckCountPct', label: 'RECONCILED CHECK %', align: 'center', disableSort: true, render: (row) => `${row.reconciledCheckCountPct}%`, accessor: (row) => row.reconciledCheckCountPct },
        { id: 'unreconciledCheckCountPct', label: 'UNRECONCILED CHECK %', align: 'center', disableSort: true, render: (row) => `${row.unreconciledCheckCountPct}%`, accessor: (row) => row.unreconciledCheckCountPct },
        { id: 'checkCountPctByTeam', label: 'CHECK % BY TEAM', align: 'center', disableSort: true, render: (row) => `${row.checkCountPctByTeam}%`, accessor: (row) => row.checkCountPctByTeam },
        { id: 'reconciledCheckCount', label: 'RECONCILED COUNT', align: 'center', disableSort: true, render: (row) => row.reconciledCheckCount, accessor: (row) => row.reconciledCheckCount },
        { id: 'unreconciledCheckCount', label: 'UNRECONCILED COUNT', align: 'center', disableSort: true, render: (row) => row.unreconciledCheckCount, accessor: (row) => row.unreconciledCheckCount },
        { id: 'reconciledAmountPct', label: 'RECONCILED AMT %', align: 'center', disableSort: true, render: (row) => `${row.reconciledAmountPct}%`, accessor: (row) => row.reconciledAmountPct },
        { id: 'unreconciledAmountPct', label: 'UNRECONCILED AMT %', align: 'center', disableSort: true, render: (row) => `${row.unreconciledAmountPct}%`, accessor: (row) => row.unreconciledAmountPct },
        { id: 'amountPctByTeam', label: 'AMT % BY TEAM', align: 'center', disableSort: true, render: (row) => `${row.amountPctByTeam}%`, accessor: (row) => row.amountPctByTeam },
        { id: 'totalAmountPosted', label: 'TOTAL POSTED', align: 'center', disableSort: true, render: (row) => formatCurrency(Number(row.totalAmountPosted)), accessor: (row) => row.totalAmountPosted },
        { id: 'totalAmountNotPosted', label: 'TOTAL NOT POSTED', align: 'center', disableSort: true, render: (row) => formatCurrency(Number(row.totalAmountNotPosted)), accessor: (row) => row.totalAmountNotPosted },
        { id: 'avgDaysToReconcile', label: 'AVG DAYS', align: 'center', disableSort: true, render: (row) => row.avgDaysToReconcile || 'N/A', accessor: (row) => row.avgDaysToReconcile ?? '' },
    ], []);

    const forecastTrendsContent = useMemo(() => (
        <>
            <SectionHeader>
                <TitleText variant="h6">Reconciliation Trends & Forecast</TitleText>
                <Typography variant="body2" color="text.secondary">Monthly reconciliation performance summary.</Typography>
            </SectionHeader>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 3 }}><SummaryCard title="TOTAL RECONCILED" value={formatCurrency(forecastSummary?.data?.totalAmountReconciled ?? 0)} backgroundColor={theme.palette.background.paper} /></Grid>
                <Grid size={{ xs: 12, md: 3 }}><SummaryCard title="TOTAL UNRECONCILED" value={formatCurrency(forecastSummary?.data?.totalAmountUnreconciled ?? 0)} backgroundColor={theme.palette.background.paper} /></Grid>
                <Grid size={{ xs: 12, md: 3 }}><SummaryCard title="RECON RATE" value={`${forecastSummary?.data?.globalReconciliationRate ?? 0}%`} backgroundColor={theme.palette.background.paper} /></Grid>
                <Grid size={{ xs: 12, md: 3 }}><SummaryCard title="AVG DAYS" value={(forecastSummary?.data?.avgDaysToReconcile ?? 0).toString()} backgroundColor={theme.palette.background.paper} /></Grid>
            </Grid>
            <LegendWrapper>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Performance</Typography>
                <RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />
            </LegendWrapper>
            <ChartContainer>
                <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={(reconPerformance?.data || []).map((d: PerformanceData) => ({
                        month: format(new Date(d.month), 'MMM yy'),
                        actual: parseFloat(String(d.actualReconciledAmount || '0')) / 1000000,
                        forecast: parseFloat(String(d.forecastAmount || '0')) / 1000000
                    }))}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(v) => `$${v}M`} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}M`, 'Amount']} />
                        <Legend />
                        <Area type="monotone" dataKey="actual" fill={theme.palette.grey[400]} stroke="none" />
                        <Line type="monotone" dataKey="actual" name="Actual" stroke={theme.palette.primary.main} strokeWidth={3} dot={{ r: 4, fill: theme.palette.primary.main }} />
                        <Line type="monotone" dataKey="forecast" name="Forecast" stroke={theme.palette.secondary.main} strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: theme.palette.secondary.main }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartContainer>
            {!isMindpath && (
                <DataTable
                    columns={teamColumns}
                    data={dashboardData || []}
                    rowKey={(r) => r.team}
                    paginated={false}
                    searchable={false}
                    dictionaryId="forecast-trends"
                    download={false}
                    loading={isFetching}
                />
            )}
        </>
    ), [reconPerformance, forecastSummary, dashboardData, handleRangeChange, theme, teamColumns, isMindpath, globalFilters.rangeLabel]);

    const payerColumns = useMemo<DataColumn<PayerPerformanceRecord>[]>(() => [
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
            label: 'TRANSACTION #',
            minWidth: 140,
            accessor: (row) => row.id,
            render: (row) => <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{row.id}</Typography>
        },
        { id: 'payerName', label: 'PAYOR', minWidth: 150, accessor: (row) => row.payerName, render: (row) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.payerName}</Typography> },
        { id: 'volume', label: 'VOLUME', align: 'center', render: (row) => row.volume, accessor: (row) => row.volume },
        { id: 'depositCount', label: 'DEPOSITS', align: 'center', render: (row) => row.depositCount, accessor: (row) => row.depositCount },
        { id: 'matchRate', label: 'MATCH RATE', align: 'center', render: (row) => `${row.matchRate}%`, accessor: (row) => row.matchRate },
        { id: 'denialRate', label: 'DENIAL RATE', align: 'center', render: (row) => `${row.denialRate}%`, accessor: (row) => row.denialRate },
        { id: 'suspenseRate', label: 'SUSPENSE %', align: 'center', render: (row) => `${row.suspenseRate}%`, accessor: (row) => row.suspenseRate },
        { id: 'avgDaysToSettle', label: 'SETTLE DAYS', align: 'center', render: (row) => row.avgDaysToSettle, accessor: (row) => row.avgDaysToSettle },
        { id: 'totalVariance', label: 'VARIANCE', align: 'center', render: (row) => formatCurrency(row.totalVariance), accessor: (row) => row.totalVariance },
        {
            id: 'status',
            label: 'STATUS',
            render: (row) => (
                <Box sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    display: 'inline-block',
                    backgroundColor: row.status === 'Critical' ? theme.palette.error.light :
                        row.status === 'Improving' ? theme.palette.success.light :
                            theme.palette.info.light,
                    color:
                        row.status === 'Critical' ? theme.palette.error.contrastText :
                            row.status === 'Improving' ? theme.palette.success.contrastText :
                                theme.palette.info.contrastText
                }}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>{row.status}</Typography>
                </Box>
            ),
            accessor: (row) => row.status,
        },
    ], [theme, handleDrillDown]);

    const payerPerformanceContent = useMemo(() => (
        <>
            <SectionHeader>
                <TitleText variant="h6">Payer Performance</TitleText>
                <Typography variant="body2" color="text.secondary">Payer-level KPIs and settlement trends.</Typography>
            </SectionHeader>
            <DataTable
                columns={payerColumns}
                data={payerPerformanceRecords}
                rowKey={(r) => r.id}
                paginated={true}
                rowsPerPage={10}
                totalElements={totalElementsPayer}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                dictionaryId="payer-performance"
                download={false}
                loading={isFetching}
            />
        </>
    ), [payerPerformanceRecords, totalElementsPayer, handlePageChange, handleRowsPerPageChange, payerColumns]);

    const executiveSummaryContent = useMemo(() => {
        const chartColors = [theme.palette.primary.main, theme.palette.warning.main];

        return (
            <Box>
                <SectionHeader><TitleText variant="h6">Executive Summary</TitleText></SectionHeader>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <RichCard>
                            <CardContent>
                                <Typography variant="caption" color="text.secondary">Total Collections</Typography>
                                <Typography variant="h4" sx={{ mt: 1 }}>{formatCurrency(execSummary?.data.totalCollectionsMtd ?? 0)}</Typography>
                            </CardContent>
                        </RichCard>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <RichCard>
                            <CardContent>
                                <Typography variant="caption" color="text.secondary">Recon Rate</Typography>
                                <Typography variant="h4" sx={{ mt: 1 }}>{execSummary?.data.reconciliationRate ?? 0}%</Typography>
                            </CardContent>
                        </RichCard>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <RichCard>
                            <CardContent>
                                <Typography variant="caption" color="text.secondary">Open Suspense</Typography>
                                <Typography variant="h4" sx={{ mt: 1 }}>{formatCurrency(execSummary?.data.openSuspense ?? 0)}</Typography>
                            </CardContent>
                        </RichCard>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <RichCard>
                            <CardContent>
                                <Typography variant="caption" color="text.secondary">Avg Days to Recon</Typography>
                                <Typography variant="h4" sx={{ mt: 1 }}>{execSummary?.data.avgDaysToReconcile ?? 0}</Typography>
                            </CardContent>
                        </RichCard>
                    </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <RichCard>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ mb: 2 }}>Payment Mix</Typography>
                                <PieChartWrapper>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[{ name: 'EFT', value: paymentMix?.data.eftCount ?? 0 }, { name: 'Other', value: paymentMix?.data.otherCount ?? 0 }]}
                                                innerRadius={60}
                                                outerRadius={80}
                                                dataKey="value"
                                                cx="50%"
                                                cy="50%"
                                                paddingAngle={5}
                                            >
                                                {chartColors.map((color, i) => <Cell key={i} fill={color} />)}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </PieChartWrapper>
                            </CardContent>
                        </RichCard>
                    </Grid>
                    {!isMindpath && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <RichCard>
                                <CardContent>
                                    <Typography variant="subtitle2" sx={{ mb: 2 }}>Adjustment Breakdown</Typography>
                                    <PieChartWrapper>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'CO', value: adjBreakdown?.data.contractualCount ?? 0 },
                                                        { name: 'PR', value: adjBreakdown?.data.patientRespCount ?? 0 },
                                                        { name: 'Denial', value: adjBreakdown?.data.denialCount ?? 0 },
                                                        { name: 'Other', value: adjBreakdown?.data.otherAdjCount ?? 0 }
                                                    ]}
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    dataKey="value"
                                                    cx="50%"
                                                    cy="50%"
                                                    paddingAngle={5}
                                                >
                                                    {chartColors.map((color, i) => <Cell key={i} fill={color} />)}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </PieChartWrapper>
                                </CardContent>
                            </RichCard>
                        </Grid>
                    )}
                </Grid>
            </Box>
        );
    }, [execSummary, paymentMix, adjBreakdown, theme, isMindpath]);

    return (
        <TrendsWrapper>
            {activeSubTab === 0 && forecastTrendsContent}
            {activeSubTab === 1 && executiveSummaryContent}
            {activeSubTab === 2 && payerPerformanceContent}
        </TrendsWrapper>
    );
};

export default TrendsScreen;
