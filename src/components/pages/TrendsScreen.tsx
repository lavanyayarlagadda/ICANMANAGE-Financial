import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { Box, Typography, useTheme, useMediaQuery, Grid, Card, CardContent } from '@mui/material';
import SummaryCard from '@/components/atoms/SummaryCard';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge';
import { useAppSelector, useAppDispatch } from '@/store';
import { PayerPerformanceRecord } from '@/types/financials';
import { setIsGlobalFetching } from '@/store/slices/uiSlice';
import { formatCurrency } from '@/utils/formatters';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  useGetForecastSummaryQuery,
  useGetReconciliationPerformanceQuery,
  useGetForecastDashboardQuery,
  useGetExecutiveSummaryQuery,
  useGetPaymentMixQuery,
  useGetAdjustmentBreakdownQuery,
} from '@/store/api/financialsApi';
import { format, subMonths } from 'date-fns';
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

const TrendsScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  // We'll keep trendsData for now as a fallback but we'll prioritize API data
  const trendsData = useAppSelector((s) => s.financials.trendsData);
  const user = useAppSelector((s) => s.auth.user);
  const isMindPath = user?.company?.toLowerCase() === 'mindpath';
  const { activeSubTab } = useAppSelector((s) => s.ui);

  const [queryParams, setQueryParams] = useState({
    fromDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
    toDate: format(new Date(), 'yyyy-MM-dd'),
  });

  // API Queries
  const { data: forecastSummary, isFetching: isFetchingForecast } = useGetForecastSummaryQuery(queryParams, { skip: activeSubTab !== 0 });
  const { data: reconPerformance, isFetching: isFetchingRecon } = useGetReconciliationPerformanceQuery(queryParams, { skip: activeSubTab !== 0 });
  const { data: dashboardData, isFetching: isFetchingDashboard } = useGetForecastDashboardQuery(queryParams, { skip: activeSubTab !== 0 });

  const { data: execSummary, isFetching: isFetchingExec } = useGetExecutiveSummaryQuery(queryParams, { skip: activeSubTab !== 1 });
  const { data: paymentMix, isFetching: isFetchingMix } = useGetPaymentMixQuery(queryParams, { skip: activeSubTab !== 1 });
  const { data: adjBreakdown, isFetching: isFetchingAdj } = useGetAdjustmentBreakdownQuery(queryParams, { skip: activeSubTab !== 1 });

  const isFetching = isFetchingForecast || isFetchingRecon || isFetchingDashboard || isFetchingExec || isFetchingMix || isFetchingAdj;

  useEffect(() => {
    dispatch(setIsGlobalFetching(isFetching));
    return () => {
      dispatch(setIsGlobalFetching(false));
    };
  }, [isFetching, dispatch]);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleRangeChange = useCallback((range: string) => {
    if (range.includes(' to ')) {
      const [from, to] = range.split(' to ');
      setQueryParams({ fromDate: from, toDate: to });
    }
  }, []);


  // --- RENDERING FORECAST TRENDS (activeSubTab === 0) ---
  const forecastTrendsContent = useMemo(() => {
    const chartData = (reconPerformance?.data || []).map(d => ({
      month: format(new Date(d.month), 'MMM yyyy'),
      actual: d.actualReconciledAmount ? parseFloat(d.actualReconciledAmount) / 1000000 : null,
      forecast: d.forecastAmount ? parseFloat(d.forecastAmount) / 1000000 : null,
    }));

    const teamColumns: DataColumn<any>[] = [
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
      { id: 'reconciledCheckCountPct', label: 'RECONCILED CHECK COUNT %', align: 'right', render: (row) => `${row.reconciledCheckCountPct}%` },
      { id: 'unreconciledCheckCountPct', label: 'UNRECONCILED CHECK COUNT %', align: 'right', render: (row) => `${row.unreconciledCheckCountPct}%` },
      { id: 'reconciledCheckCount', label: 'RECONCILED CHECK COUNT', align: 'right' },
      { id: 'unreconciledCheckCount', label: 'UNRECONCILED CHECK COUNT', align: 'right' },
      { id: 'totalAmountPosted', label: 'TOTAL AMOUNT POSTED', align: 'right', render: (row) => formatCurrency(Number(row.totalAmountPosted)) },
      { id: 'totalAmountNotPosted', label: 'TOTAL AMOUNT NOT POSTED', align: 'right', render: (row) => formatCurrency(Number(row.totalAmountNotPosted)) },
      { id: 'avgDaysToReconcile', label: 'AVG DAYS TO RECONCILE', align: 'right', render: (row) => row.avgDaysToReconcile || 'N/A' },
    ];

    const kpis = [
      { label: 'TOTAL AMOUNT RECONCILED', value: formatCurrency(forecastSummary?.data?.totalAmountReconciled ?? 0) },
      { label: 'TOTAL AMOUNT UNRECONCILED', value: formatCurrency(forecastSummary?.data?.totalAmountUnreconciled ?? 0) },
      { label: 'GLOBAL RECONCILIATION RATE', value: `${forecastSummary?.data?.globalReconciliationRate ?? 0}%` },
      { label: 'AVG DAYS TO RECONCILE', value: (forecastSummary?.data?.avgDaysToReconcile ?? 0).toString() },
    ];

    return (
      <>
        <SectionHeader>
          <TitleText variant="h6">Reconciliation Trends & Forecast</TitleText>
          <Typography variant="body2" color="text.secondary">Monthly reconciliation performance summary by team.</Typography>
        </SectionHeader>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {kpis.map((kpi) => (
            <Grid size={{ xs: 12, md: 3 }} key={kpi.label}>
              <SummaryCard title={kpi.label} value={kpi.value} backgroundColor="#fff" />
            </Grid>
          ))}
        </Grid>

        <LegendWrapper>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Reconciliation Performance
          </Typography>
          <RangeDropdown onChange={handleRangeChange} />
        </LegendWrapper>

        <ChartContainer>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
                dy={10}
                interval={isSmallMobile ? 0 : 'preserveStartEnd'}
                angle={isSmallMobile ? -45 : 0}
                textAnchor={isSmallMobile ? 'end' : 'middle'}
                height={isSmallMobile ? 60 : 30}
              />
              <YAxis
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                tickFormatter={(v) => `$${v}M`}
              />
              <Tooltip
                formatter={(v: number) => [`$${v}M`, '']}
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: theme.shadows[3] }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 20 }} />

              <Area type="monotone" dataKey="actual" fill={`${theme.palette.primary.main}15`} stroke="none" legendType="none" />
              <Line type="monotone" dataKey="actual" name="Actual Reconciled Amount" stroke={theme.palette.primary.main} strokeWidth={3} dot={{ r: 4, fill: theme.palette.primary.main, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="forecast" name="S-Curve Forecast Projection" stroke={theme.palette.secondary.main} strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: theme.palette.secondary.main, strokeWidth: 2, stroke: '#fff' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>

        <Box sx={{ mb: 4 }}>
          <DataTable
            columns={teamColumns}
            data={dashboardData?.data || []}
            rowKey={(r) => r.team}
            paginated={false}
            searchable={false}
            dictionaryId="forecast-trends"
          />
        </Box>
      </>
    );
  }, [reconPerformance, forecastSummary, dashboardData, handleRangeChange, theme, isSmallMobile]);

  // --- RENDERING EXECUTIVE SUMMARY (activeSubTab === 1) ---
  const executiveSummaryContent = useMemo(() => {
    const paymentColors = ['#6B99C4', '#D97706', '#65A30D', '#E2E8F0'];
    const adjustmentColors = ['#6B99C4', '#D97706', '#DC2626', '#166534'];

    return (
      <Box>
        <SectionHeader>
          <TitleText variant="h6">Executive Summary</TitleText>
          <Typography variant="body2" color="text.secondary">High-level financial overview and operational insights.</Typography>
        </SectionHeader>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <RichCard>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Collections (MTD)
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, my: 1 }}>{formatCurrency(execSummary?.data.totalCollectionsMtd ?? 0)}</Typography>
                <Typography variant="body2" color="success.main">{execSummary?.data.collectionsSubtext}</Typography>
              </CardContent>
            </RichCard>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <RichCard>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Reconciliation Rate
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, my: 1 }}>{execSummary?.data.reconciliationRate ?? 0}%</Typography>
                <Typography variant="body2" color="success.main">{execSummary?.data.reconSubtext}</Typography>
              </CardContent>
            </RichCard>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <RichCard>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Open Suspense
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, my: 1 }}>{formatCurrency(execSummary?.data.openSuspense ?? 0)}</Typography>
                <Typography variant="body2" color="error.main">{execSummary?.data.suspenseSubtext}</Typography>
              </CardContent>
            </RichCard>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <RichCard>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Avg Days to Reconcile
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, my: 1 }}>{execSummary?.data.avgDaysToReconcile ?? 0}</Typography>
                <Typography variant="body2">{execSummary?.data.avgDaysSubtext}</Typography>
              </CardContent>
            </RichCard>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <RichCard>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Payment Mix</Typography>
                <PieChartWrapper>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'EFT Payments', value: paymentMix?.data.eftCount ?? 0 },
                          { name: 'Other Payments', value: paymentMix?.data.otherCount ?? 0 },
                        ]}
                        innerRadius={isSmallMobile ? 45 : 60}
                        outerRadius={isSmallMobile ? 70 : 100}
                        paddingAngle={5}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                      >
                        {[0, 1].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={paymentColors[index % paymentColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout={isTablet ? "horizontal" : "vertical"} align="center" verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                </PieChartWrapper>
              </CardContent>
            </RichCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <RichCard>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Adjustment Breakdown</Typography>
                <PieChartWrapper>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Contractual (CO)', value: adjBreakdown?.data.contractualCount ?? 0 },
                          { name: 'Patient Resp (PR)', value: adjBreakdown?.data.patientRespCount ?? 0 },
                          { name: 'Denials', value: adjBreakdown?.data.denialCount ?? 0 },
                          { name: 'Other Adj', value: adjBreakdown?.data.otherAdjCount ?? 0 },
                        ]}
                        innerRadius={isSmallMobile ? 45 : 60}
                        outerRadius={isSmallMobile ? 70 : 100}
                        paddingAngle={5}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                      >
                        {[0, 1, 2, 3].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={adjustmentColors[index % adjustmentColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout={isTablet ? "horizontal" : "vertical"} align="center" verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                </PieChartWrapper>
              </CardContent>
            </RichCard>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <RiskCardStyled severity="error">
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#991B1B' }}>Forward Balance Risk</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>active forward balance notices totaling significant withholdings.</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Action: <span style={{ fontWeight: 500 }}>Review FB-2025-9981A for dispute filing.</span></Typography>
              </CardContent>
            </RiskCardStyled>
          </Grid>
          {!isMindPath && (
            <Grid size={{ xs: 12, md: 6 }}>
              <RiskCardStyled severity="warning">
                <CardContent>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#92400E' }}>PIP Suspense Accumulation</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>Claim application rate is lower than expected across all PTANs.</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Action: <span style={{ fontWeight: 500 }}>Accelerate claim submissions for PTAN12345.</span></Typography>
                </CardContent>
              </RiskCardStyled>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  }, [execSummary, paymentMix, adjBreakdown, isMindPath, isSmallMobile, isTablet]);

  // --- RENDERING PAYER PERFORMANCE (activeSubTab === 2) ---
  const payerPerformanceContent = useMemo(() => {
    const data = trendsData?.payerPerformance || [];
    if (data.length === 0) return <Typography sx={{ p: 3 }}>No payer performance data available.</Typography>;

    const columns: DataColumn<PayerPerformanceRecord>[] = [
      { id: 'payerName', label: 'PAYER NAME', minWidth: 180, render: (row) => <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.payerName}</Typography> },
      { id: 'volume', label: 'VOLUME', align: 'right' },
      { id: 'matchRate', label: 'MATCH RATE', align: 'right', render: (row) => `${row.matchRate}%` },
      { id: 'avgDaysToSettle', label: 'AVG DAYS TO SETTLE', align: 'right' },
      { id: 'totalVariance', label: 'TOTAL VARIANCE', align: 'right', render: (row) => <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(row.totalVariance)}</Typography> },
      { id: 'status', label: 'STATUS', align: 'right', render: (row) => <StatusBadge status={row.status} /> },
    ];

    return (
      <Box>
        <SectionHeader>
          <TitleText variant="h6">Payer Performance Scorecard</TitleText>
          <Typography variant="body2" color="text.secondary">Key metrics for payer reconciliation and risk.</Typography>
        </SectionHeader>

        <DataTable
          columns={columns}
          data={data}
          rowKey={(r) => r.payerName}
          paginated={false}
          searchable={false}
          dictionaryId="payer-performance"
        />
      </Box>
    );
  }, [trendsData]);

  return (
    <TrendsWrapper>
      {activeSubTab === 0 && forecastTrendsContent}
      {activeSubTab === 1 && executiveSummaryContent}
      {activeSubTab === 2 && payerPerformanceContent}
    </TrendsWrapper>
  );
};

export default TrendsScreen;
