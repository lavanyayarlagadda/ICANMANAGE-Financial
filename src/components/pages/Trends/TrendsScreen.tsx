import React, { useMemo } from 'react';
import { Box, Typography, useTheme, useMediaQuery, Grid, CardContent } from '@mui/material';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import { formatCurrency } from '@/utils/formatters';
import { ResponsiveContainer, ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { format } from 'date-fns';
import {
    TrendsWrapper,
    SectionHeader,
    TitleText,
    ChartContainer,
    LegendWrapper,
    PieChartWrapper,
    RichCard,
    RiskCardStyled
} from './TrendsScreen.styles';
import { useTrendsScreen } from './TrendsScreen.hook';

const TrendsScreen: React.FC = () => {
    const theme = useTheme();
    const { activeSubTab, isMindPath, trendsData, forecastSummary, reconPerformance, dashboardData, execSummary, paymentMix, adjBreakdown, handleRangeChange } = useTrendsScreen();
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

    const forecastTrendsContent = useMemo(() => (
        <>
            <SectionHeader><TitleText variant="h6">Reconciliation Trends & Forecast</TitleText><Typography variant="body2" color="text.secondary">Monthly reconciliation performance summary.</Typography></SectionHeader>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 3 }}><SummaryCard title="TOTAL RECONCILED" value={formatCurrency(forecastSummary?.data?.totalAmountReconciled ?? 0)} backgroundColor="#fff" /></Grid>
                <Grid size={{ xs: 12, md: 3 }}><SummaryCard title="TOTAL UNRECONCILED" value={formatCurrency(forecastSummary?.data?.totalAmountUnreconciled ?? 0)} backgroundColor="#fff" /></Grid>
                <Grid size={{ xs: 12, md: 3 }}><SummaryCard title="RECON RATE" value={`${forecastSummary?.data?.globalReconciliationRate ?? 0}%`} backgroundColor="#fff" /></Grid>
                <Grid size={{ xs: 12, md: 3 }}><SummaryCard title="AVG DAYS" value={(forecastSummary?.data?.avgDaysToReconcile ?? 0).toString()} backgroundColor="#fff" /></Grid>
            </Grid>
            <LegendWrapper><Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Performance</Typography><RangeDropdown onChange={handleRangeChange} /></LegendWrapper>
            <ChartContainer>
                <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={(reconPerformance?.data || []).map(d => ({ month: format(new Date(d.month), 'MMM yy'), actual: parseFloat(d.actualReconciledAmount) / 1000000, forecast: parseFloat(d.forecastAmount) / 1000000 }))}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis tickFormatter={(v) => `$${v}M`} /><Tooltip /><Legend />
                        <Area type="monotone" dataKey="actual" fill={`${theme.palette.primary.main}15`} stroke="none" /><Line type="monotone" dataKey="actual" stroke={theme.palette.primary.main} strokeWidth={3} /><Line type="monotone" dataKey="forecast" stroke={theme.palette.secondary.main} strokeWidth={3} strokeDasharray="5 5" />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartContainer>
            <DataTable columns={[{ id: 'team', label: 'TEAM', render: (row) => <Typography variant="body2" sx={{ fontWeight: row.team === 'OVERALL' ? 700 : 500 }}>{row.team}</Typography> }, { id: 'reconciledCheckCountPct', label: 'RECON %', align: 'right', render: (row) => `${row.reconciledCheckCountPct}%` }, { id: 'totalAmountPosted', label: 'POSTED', align: 'right', render: (row) => formatCurrency(Number(row.totalAmountPosted)) }, { id: 'avgDaysToReconcile', label: 'AVG DAYS', align: 'right' }]} data={dashboardData?.data || []} rowKey={(r) => r.team} paginated={false} searchable={false} dictionaryId="forecast-trends" />
        </>
    ), [reconPerformance, forecastSummary, dashboardData, handleRangeChange, theme]);

    const executiveSummaryContent = useMemo(() => (
        <Box>
            <SectionHeader><TitleText variant="h6">Executive Summary</TitleText></SectionHeader>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 3 }}><RichCard><CardContent><Typography variant="caption">Total Collections</Typography><Typography variant="h4">{formatCurrency(execSummary?.data.totalCollectionsMtd ?? 0)}</Typography></CardContent></RichCard></Grid>
                <Grid size={{ xs: 12, md: 3 }}><RichCard><CardContent><Typography variant="caption">Recon Rate</Typography><Typography variant="h4">{execSummary?.data.reconciliationRate ?? 0}%</Typography></CardContent></RichCard></Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}><RichCard><CardContent><Typography variant="subtitle2">Payment Mix</Typography><PieChartWrapper><ResponsiveContainer><PieChart><Pie data={[{ name: 'EFT', value: paymentMix?.data.eftCount ?? 0 }, { name: 'Other', value: paymentMix?.data.otherCount ?? 0 }]} innerRadius={60} outerRadius={80} dataKey="value" cx="50%" cy="50%">{[0, 1].map((_, i) => <Cell key={i} fill={['#6B99C4', '#D97706'][i]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></PieChartWrapper></CardContent></RichCard></Grid>
                <Grid size={{ xs: 12, md: 6 }}><RichCard><CardContent><Typography variant="subtitle2">Adjustment Breakdown</Typography><PieChartWrapper><ResponsiveContainer><PieChart><Pie data={[{ name: 'CO', value: adjBreakdown?.data.contractualCount ?? 0 }, { name: 'PR', value: adjBreakdown?.data.patientRespCount ?? 0 }]} innerRadius={60} outerRadius={80} dataKey="value" cx="50%" cy="50%">{[0, 1].map((_, i) => <Cell key={i} fill={['#6B99C4', '#D97706'][i]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></PieChartWrapper></CardContent></RichCard></Grid>
            </Grid>
        </Box>
    ), [execSummary, paymentMix, adjBreakdown]);

    return (<TrendsWrapper>{activeSubTab === 0 && forecastTrendsContent}{activeSubTab === 1 && executiveSummaryContent}</TrendsWrapper>);
};

export default TrendsScreen;
