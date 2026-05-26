import { Box, CardContent, Grid, Typography, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { Area, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { addMonths, format } from 'date-fns';

import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import { formatCompactCurrency, formatCurrency } from '@/utils/formatters';

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

import { PayerPerformanceRecord } from '@/interfaces/financials';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { SystemStatus } from '@/constants/statuses';
import {
    avgDaysFieldFormat,
    countFieldFormat,
    createForecastCellValueGetter,
    createSharedColumnCellProps,
    currencyFieldFormat,
    ForecastDashboardRow,
    isOverallTeam,
    percentFieldFormat,
} from './helpers/forecastTrendsTableHelpers';

interface PerformanceData {
    month: string;
    actualReconciledAmount: string | number | null;
    forecastAmount: string | number | null;
}

const getSafeMonthLabel = (monthValue: string | null | undefined, fallbackDate: string, index: number): string => {
    const parsed = monthValue ? new Date(monthValue) : new Date(fallbackDate);
    const fallbackParsed = new Date(fallbackDate);
    const isInvalid = Number.isNaN(parsed.getTime());
    const isEpochLike = !isInvalid && parsed.getFullYear() <= 1971;
    const safeDate = (isInvalid || isEpochLike) ? addMonths(fallbackParsed, index) : parsed;
    return format(safeDate, 'MMM yy');
};

const formatYAxisAmount = (value: number): string => {
    if (!Number.isFinite(value)) return '$0';
    const absValue = Math.abs(value);
    if (absValue >= 1_000) {
        return formatCompactCurrency(value);
    }
    return formatCurrency(value);
};

const TrendsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const theme = useTheme();
    const {
        isForecastPath,
        isSummaryPath,
        isPayerPath,
        forecastSummary,
        reconPerformance,
        dashboardRows,
        dashboardTableTitle,
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

    const overallDashboardRow = useMemo(() => {
        return (dashboardRows || []).find((row) => isOverallTeam(row.team)) || null;
    }, [dashboardRows]);

    const teamColumns = useMemo<DataColumn<ForecastDashboardRow>[]>(() => {
        type ValueField = keyof Omit<ForecastDashboardRow, 'team'>;

        const makeValueColumn = (
            id: string,
            label: string,
            field: ValueField,
            formatValue: (value: unknown) => string,
            mergeAcrossTeams: boolean,
        ): DataColumn<ForecastDashboardRow> => {
            const getDisplayValue = createForecastCellValueGetter(
                field,
                overallDashboardRow,
                formatValue,
            );

            return {
                id,
                label,
                align: 'center',
                disableSort: true,
                accessor: (row) => row[field] as string | number,
                ...(mergeAcrossTeams ? { getCellProps: createSharedColumnCellProps() } : {}),
                render: (row) => (
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: isOverallTeam(row.team) ? 700 : 500 }}
                    >
                        {getDisplayValue(row)}
                    </Typography>
                ),
            };
        };

        return [
            {
                id: 'team',
                label: 'TEAM',
                minWidth: 150,
                align: 'center',
                disableSort: true,
                render: (row) => (
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: isOverallTeam(row.team) ? 700 : 500 }}
                    >
                        {row.team}
                    </Typography>
                ),
                accessor: (row) => row.team,
            },
            makeValueColumn('reconciledCheckCountPct', 'RECONCILED CHECK %', 'reconciledCheckCountPct', percentFieldFormat, true),
            makeValueColumn('unreconciledCheckCountPct', 'UNRECONCILED CHECK %', 'unreconciledCheckCountPct', percentFieldFormat, true),
            makeValueColumn('checkCountPctByTeam', 'CHECK % BY TEAM', 'checkCountPctByTeam', percentFieldFormat, false),
            makeValueColumn('reconciledCheckCount', 'RECONCILED COUNT', 'reconciledCheckCount', countFieldFormat, false),
            makeValueColumn('unreconciledCheckCount', 'UNRECONCILED COUNT', 'unreconciledCheckCount', countFieldFormat, true),
            makeValueColumn('reconciledAmountPct', 'RECONCILED AMT %', 'reconciledAmountPct', percentFieldFormat, true),
            makeValueColumn('unreconciledAmountPct', 'UNRECONCILED AMT %', 'unreconciledAmountPct', percentFieldFormat, true),
            makeValueColumn('amountPctByTeam', 'AMT % BY TEAM', 'amountPctByTeam', percentFieldFormat, false),
            makeValueColumn('totalAmountPosted', 'TOTAL POSTED', 'totalAmountPosted', currencyFieldFormat, false),
            makeValueColumn('totalAmountNotPosted', 'TOTAL NOT POSTED', 'totalAmountNotPosted', currencyFieldFormat, true),
            makeValueColumn('avgDaysToReconcile', 'AVG DAYS', 'avgDaysToReconcile', avgDaysFieldFormat, false),
        ];
    }, [overallDashboardRow]);

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
                    <ComposedChart data={(() => {
                        const usedMonths = new Set<string>();
                        return (reconPerformance?.data || []).map((d: PerformanceData, index: number) => {
                            const baseMonth = getSafeMonthLabel(d.month, globalFilters.fromDate, index);
                            const month = usedMonths.has(baseMonth)
                                ? format(addMonths(new Date(globalFilters.fromDate), index), 'MMM yy')
                                : baseMonth;
                            usedMonths.add(month);
                            return {
                                month,
                                actual: parseFloat(String(d.actualReconciledAmount || '0')),
                                forecast: parseFloat(String(d.forecastAmount || '0'))
                            };
                        });
                    })()}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis
                            width={90}
                            tickFormatter={(v) => formatYAxisAmount(Number(v))}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip formatter={(v: number) => [formatCurrency(Number(v)), 'Amount']} />
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
                    data={dashboardRows || []}
                    rowKey={(r) => r.team}
                    paginated={false}
                    searchable={false}
                    dictionaryId="forecast-trends"
                    download={false}
                    loading={isFetching}
                    showColumnDividers
                    tableTitle={dashboardTableTitle || 'KPI Matrix(DOD)'}
                />
            )}
        </>
    ), [reconPerformance, forecastSummary, dashboardRows, dashboardTableTitle, handleRangeChange, theme, teamColumns, isMindpath, globalFilters.rangeLabel, isFetching, globalFilters.fromDate]);

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
                    backgroundColor: row.status === SystemStatus.CRITICAL ? theme.palette.error.light :
                        row.status === SystemStatus.IMPROVING ? theme.palette.success.light :
                            theme.palette.info.light,
                    color:
                        row.status === SystemStatus.CRITICAL ? theme.palette.error.contrastText :
                            row.status === SystemStatus.IMPROVING ? theme.palette.success.contrastText :
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
    ), [payerPerformanceRecords, totalElementsPayer, handlePageChange, handleRowsPerPageChange, payerColumns, isFetching]);

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
            {isForecastPath && forecastTrendsContent}
            {isSummaryPath && executiveSummaryContent}
            {isPayerPath && payerPerformanceContent}
        </TrendsWrapper>
    );
};

export default TrendsScreen;
