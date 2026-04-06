import { alpha, Box, CardContent, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { Area, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';

import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import { formatCurrency } from '@/utils/formatters';
import { themeConfig } from '@/theme/themeConfig';

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

const TrendsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const theme = useTheme();
    const { activeSubTab, queryParams, forecastSummary, reconPerformance, dashboardData, execSummary, paymentMix, adjBreakdown, handleRangeChange } = useTrendsScreen({ skip });
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
    
    const teamColumns = useMemo<DataColumn<ForecastDashboardResponse['data'][0]>[]>(() => [
        {
            id: 'team',
            label: 'TEAM',
            minWidth: 150,
            render: (row) => (
                <Typography variant="body2" sx={{ fontWeight: row.team === 'OVERALL' ? 700 : 500 }}>
                    {row.team}
                </Typography>
            ),
            accessor: (row) => row.team,
        },
        { id: 'description', label: 'DESCRIPTION', minWidth: 150, accessor: (row) => (row as any).description ?? '-', render: (row) => (row as any).description ?? '-' },
        { id: 'reconciledCheckCountPct', label: 'RECONCILED CHECK %', align: 'right', render: (row) => `${row.reconciledCheckCountPct}%`, accessor: (row) => row.reconciledCheckCountPct },
        { id: 'unreconciledCheckCountPct', label: 'UNRECONCILED CHECK %', align: 'right', render: (row) => `${row.unreconciledCheckCountPct}%`, accessor: (row) => row.unreconciledCheckCountPct },
        { id: 'checkCountPctByTeam', label: 'CHECK % BY TEAM', align: 'right', render: (row) => `${row.checkCountPctByTeam}%`, accessor: (row) => row.checkCountPctByTeam },
        { id: 'reconciledCheckCount', label: 'RECONCILED COUNT', align: 'right', render: (row) => row.reconciledCheckCount, accessor: (row) => row.reconciledCheckCount },
        { id: 'unreconciledCheckCount', label: 'UNRECONCILED COUNT', align: 'right', render: (row) => row.unreconciledCheckCount, accessor: (row) => row.unreconciledCheckCount },
        { id: 'reconciledAmountPct', label: 'RECONCILED AMT %', align: 'right', render: (row) => `${row.reconciledAmountPct}%`, accessor: (row) => row.reconciledAmountPct },
        { id: 'unreconciledAmountPct', label: 'UNRECONCILED AMT %', align: 'right', render: (row) => `${row.unreconciledAmountPct}%`, accessor: (row) => row.unreconciledAmountPct },
        { id: 'amountPctByTeam', label: 'AMT % BY TEAM', align: 'right', render: (row) => `${row.amountPctByTeam}%`, accessor: (row) => row.amountPctByTeam },
        { id: 'totalAmountPosted', label: 'TOTAL POSTED', align: 'right', render: (row) => formatCurrency(Number(row.totalAmountPosted)), accessor: (row) => row.totalAmountPosted },
        { id: 'totalAmountNotPosted', label: 'TOTAL NOT POSTED', align: 'right', render: (row) => formatCurrency(Number(row.totalAmountNotPosted)), accessor: (row) => row.totalAmountNotPosted },
        { id: 'avgDaysToReconcile', label: 'AVG DAYS', align: 'right', render: (row) => row.avgDaysToReconcile || 'N/A', accessor: (row) => row.avgDaysToReconcile ?? '' },
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
                <RangeDropdown onChange={handleRangeChange} />
            </LegendWrapper>
            <ChartContainer>
                <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={(reconPerformance?.data || []).map(d => ({ 
                        month: format(new Date(d.month), 'MMM yy'), 
                        actual: parseFloat(d.actualReconciledAmount || '0') / 1000000, 
                        forecast: parseFloat(d.forecastAmount || '0') / 1000000 
                    }))}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(v) => `$${v}M`} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="actual" fill={alpha(theme.palette.primary.main, 0.15)} stroke="none" />
                        <Line type="monotone" dataKey="actual" name="Actual" stroke={theme.palette.primary.main} strokeWidth={3} dot={{ r: 4, fill: theme.palette.primary.main }} />
                        <Line type="monotone" dataKey="forecast" name="Forecast" stroke={theme.palette.secondary.main} strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: theme.palette.secondary.main }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </ChartContainer>
            <DataTable
                columns={teamColumns}
                data={dashboardData?.data || []} 
                rowKey={(r) => r.team} 
                paginated={false} 
                searchable={false} 
                dictionaryId="forecast-trends" 
            />
        </>
    ), [reconPerformance, forecastSummary, dashboardData, handleRangeChange, theme, teamColumns]);

    const executiveSummaryContent = useMemo(() => {
        const chartColors = [themeConfig.colors.charts.blue, themeConfig.colors.charts.orange];
        
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
                    <Grid size={{ xs: 12, md: 6 }}>
                        <RichCard>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ mb: 2 }}>Adjustment Breakdown</Typography>
                                <PieChartWrapper>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={[{ name: 'CO', value: adjBreakdown?.data.contractualCount ?? 0 }, { name: 'PR', value: adjBreakdown?.data.patientRespCount ?? 0 }]} 
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
                </Grid>
            </Box>
        );
    }, [execSummary, paymentMix, adjBreakdown, theme]);

    return (
        <TrendsWrapper>
            {activeSubTab === 0 && forecastTrendsContent}
            {activeSubTab === 1 && executiveSummaryContent}
        </TrendsWrapper>
    );
};

export default TrendsScreen;
