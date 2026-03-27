import React from 'react';
import { Box, Typography, useTheme, useMediaQuery, Grid, Card, CardContent } from '@mui/material';
import SummaryCard from '@/components/atoms/SummaryCard';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge';
import { useAppSelector, useAppDispatch } from '@/store';
import { TeamPerformance, PayerPerformanceRecord } from '@/types/financials';
import { setIsGlobalFetching } from '@/store/slices/uiSlice';
import { formatPercent, formatCurrency } from '@/utils/formatters';
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
  // useGetPayerPerformanceQuery,
} from '@/store/api/financialsApi';
import { format, subMonths } from 'date-fns';

const TrendsScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  // We'll keep trendsData for now as a fallback but we'll prioritize API data
  const trendsData = useAppSelector((s) => s.financials.trendsData);
  const user = useAppSelector((s) => s.auth.user);
  const isMindPath = user?.company?.toLowerCase() === 'mindpath';
  const { activeSubTab } = useAppSelector((s) => s.ui);

  const [queryParams, setQueryParams] = React.useState({
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

  // const { data: payerPerformance, isFetching: isFetchingPayer } = useGetPayerPerformanceQuery(queryParams, { skip: activeSubTab !== 2 });

  const isFetching = isFetchingForecast || isFetchingRecon || isFetchingDashboard || isFetchingExec || isFetchingMix || isFetchingAdj;

  React.useEffect(() => {
    dispatch(setIsGlobalFetching(isFetching));
    return () => {
      dispatch(setIsGlobalFetching(false));
    };
  }, [isFetching, dispatch]);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleRangeChange = (range: string) => {
    if (range.includes(' to ')) {
      const [from, to] = range.split(' to ');
      setQueryParams({ fromDate: from, toDate: to });
    }
  };

  // if (!trendsData) return <Typography>No trends data.</Typography>;


  // --- RENDERING FORECAST TRENDS (activeSubTab === 0) ---
  const renderForecastTrends = () => {
    // Map reconPerformance to chart data
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
      { id: 'reconciledCheckCountPct', label: 'RECONCILED CHECK COUNT %', align: 'right', render: (row) => `${row.reconciledCheckCountPct}%`, accessor: (row) => row.reconciledCheckCountPct },
      { id: 'unreconciledCheckCountPct', label: 'UNRECONCILED CHECK COUNT %', align: 'right', render: (row) => `${row.unreconciledCheckCountPct}%`, accessor: (row) => row.unreconciledCheckCountPct },
      { id: 'checkCountPctByTeam', label: 'CHECK COUNT % BY TEAM', align: 'right', render: (row) => `${row.checkCountPctByTeam}%`, accessor: (row) => row.checkCountPctByTeam },
      { id: 'reconciledCheckCount', label: 'RECONCILED CHECK COUNT', align: 'right', render: (row) => row.reconciledCheckCount, accessor: (row) => row.reconciledCheckCount },
      { id: 'unreconciledCheckCount', label: 'UNRECONCILED CHECK COUNT', align: 'right', render: (row) => row.unreconciledCheckCount, accessor: (row) => row.unreconciledCheckCount },
      { id: 'reconciledAmountPct', label: 'RECONCILED AMOUNT %', align: 'right', render: (row) => `${row.reconciledAmountPct}%`, accessor: (row) => row.reconciledAmountPct },
      { id: 'unreconciledAmountPct', label: 'UNRECONCILED AMOUNT %', align: 'right', render: (row) => `${row.unreconciledAmountPct}%`, accessor: (row) => row.unreconciledAmountPct },
      { id: 'amountPctByTeam', label: 'AMOUNT % BY TEAM', align: 'right', render: (row) => `${row.amountPctByTeam}%`, accessor: (row) => row.amountPctByTeam },
      { id: 'totalAmountPosted', label: 'TOTAL AMOUNT POSTED', align: 'right', render: (row) => formatCurrency(Number(row.totalAmountPosted)), accessor: (row) => row.totalAmountPosted },
      { id: 'totalAmountNotPosted', label: 'TOTAL AMOUNT NOT POSTED', align: 'right', render: (row) => formatCurrency(Number(row.totalAmountNotPosted)), accessor: (row) => row.totalAmountNotPosted },
      { id: 'avgDaysToReconcile', label: 'AVG DAYS TO RECONCILE', align: 'right', render: (row) => row.avgDaysToReconcile || 'N/A', accessor: (row) => row.avgDaysToReconcile },
    ];

    const teamTableData = dashboardData?.data || [];

    const kpis = [
      { label: 'TOTAL AMOUNT RECONCILED', value: formatCurrency(forecastSummary?.data?.totalAmountReconciled ?? 0) },
      { label: 'TOTAL AMOUNT UNRECONCILED', value: formatCurrency(forecastSummary?.data?.totalAmountUnreconciled ?? 0) },
      { label: 'GLOBAL RECONCILIATION RATE', value: `${forecastSummary?.data?.globalReconciliationRate ?? 0}%` },
      { label: 'AVG DAYS TO RECONCILE', value: (forecastSummary?.data?.avgDaysToReconcile ?? 0).toString() },
    ];

    return (
      <>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'rgb(10, 22, 40)' }}>Reconciliation Trends & Forecast</Typography>
          <Typography variant="body2" color="text.secondary">Monthly reconciliation performance summary by team. Tracks check counts, amounts, and average processing time.</Typography>
        </Box>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {kpis.map((kpi) => (
            <Grid size={{ xs: 12, md: 3 }} key={kpi.label}>
              <SummaryCard title={kpi.label} value={kpi.value} backgroundColor="#fff" />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Reconciliation Performance
          </Typography>
          <RangeDropdown onChange={handleRangeChange} />
        </Box>

        <Box sx={{ p: 3, backgroundColor: '#fff', borderRadius: 2, mb: 3, border: `1px solid ${theme.palette.divider}` }}>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
                axisLine={false}
                tickLine={false}
                dy={10}
                interval={isSmallMobile ? 0 : 'preserveStartEnd'}
                angle={isSmallMobile ? -45 : 0}
                textAnchor={isSmallMobile ? 'end' : 'middle'}
                height={isSmallMobile ? 60 : 30}
              />
              <YAxis
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                axisLine={false}
                tickLine={false}
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
        </Box>

        <Box sx={{ mb: 4 }}>
          <DataTable
            columns={teamColumns}
            data={teamTableData}
            rowKey={(r) => r.team}
            paginated={false}
            searchable={false}
            dictionaryId="forecast-trends"
          />
        </Box>
      </>
    );
  };

  // --- RENDERING EXECUTIVE SUMMARY (activeSubTab === 1) ---
  const renderExecutiveSummary = () => {
    const paymentColors = ['#6B99C4', '#D97706', '#65A30D', '#E2E8F0'];
    const adjustmentColors = ['#6B99C4', '#D97706', '#DC2626', '#166534'];

    const SummaryCardRich = ({ title, value, subtext, subtextColor }: { title: string, value: string, subtext?: string, subtextColor?: string }) => (
      <Card sx={{ height: '100%', backgroundColor: '#fff', border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, my: 1, color: 'rgb(10, 22, 40)' }}>
            {value}
          </Typography>
          {subtext && (
            <Typography variant="body2" sx={{ fontWeight: 600, color: subtextColor || 'success.main' }}>
              {subtext}
            </Typography>
          )}
        </CardContent>
      </Card>
    );

    const RiskCard = ({ title, description, action, severity = 'error' }: { title: string, description: string, action: string, severity?: 'error' | 'warning' }) => (
      <Card sx={{
        height: '100%',
        backgroundColor: severity === 'error' ? '#FEF2F2' : '#FFFBEB',
        borderLeft: `4px solid ${severity === 'error' ? '#DC2626' : '#D97706'}`,
        boxShadow: 'none'
      }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: severity === 'error' ? '#991B1B' : '#92400E', mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '13px' }}>
            {description}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Action: <span style={{ fontWeight: 500 }}>{action}</span>
          </Typography>
        </CardContent>
      </Card>
    );

    return (
      <Box sx={{}}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'rgb(10, 22, 40)' }}>Executive Summary</Typography>
          <Typography variant="body2" color="text.secondary">High-level financial overview and key operational insights for leadership review.</Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <SummaryCardRich title="Total Collections (MTD)" value={formatCurrency(execSummary?.data.totalCollectionsMtd ?? 0)} subtext={execSummary?.data.collectionsSubtext || ''} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <SummaryCardRich title="Reconciliation Rate" value={`${execSummary?.data.reconciliationRate ?? 0}%`} subtext={execSummary?.data.reconSubtext || ''} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <SummaryCardRich title="Open Suspense" value={formatCurrency(execSummary?.data.openSuspense ?? 0)} subtext={execSummary?.data.suspenseSubtext || ''} subtextColor="#DC2626" />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <SummaryCardRich title="Avg Days to Reconcile" value={execSummary?.data.avgDaysToReconcile?.toString() || '0'} subtext={execSummary?.data.avgDaysSubtext || ''} />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%', border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Payment Mix</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'EFT Payments', value: paymentMix?.data.eftCount ?? 0 },
                          { name: 'Other Payments', value: paymentMix?.data.otherCount ?? 0 },
                        ]}
                        innerRadius={isSmallMobile ? 45 : (isTablet ? 50 : 60)}
                        outerRadius={isSmallMobile ? 70 : (isTablet ? 80 : 100)}
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
                      <Legend
                        layout={isTablet ? "horizontal" : "vertical"}
                        align={isTablet ? "center" : "right"}
                        verticalAlign={isTablet ? "bottom" : "middle"}
                        wrapperStyle={{ paddingTop: isTablet ? 30 : 0 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%', border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Adjustment Breakdown</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Contractual (CO)', value: adjBreakdown?.data.contractualCount ?? 0 },
                          { name: 'Patient Resp (PR)', value: adjBreakdown?.data.patientRespCount ?? 0 },
                          { name: 'Denials', value: adjBreakdown?.data.denialCount ?? 0 },
                          { name: 'Other Adj', value: adjBreakdown?.data.otherAdjCount ?? 0 },
                        ]}
                        innerRadius={isSmallMobile ? 45 : (isTablet ? 50 : 60)}
                        outerRadius={isSmallMobile ? 70 : (isTablet ? 80 : 100)}
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
                      <Legend
                        layout={isTablet ? "horizontal" : "vertical"}
                        align={isTablet ? "center" : "right"}
                        verticalAlign={isTablet ? "bottom" : "middle"}
                        wrapperStyle={{ paddingTop: isTablet ? 30 : 0 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <RiskCard
              title="Forward Balance Risk"
              description="30 active forward balance notices totaling significant withholdings. Summit Health Systems has the largest exposure at $2,500.00 with $1,875.00 remaining."
              action="Review FB-2025-9981A for potential dispute filing before the 60-day window closes."
            />
          </Grid>
          {!isMindPath && (
            <Grid size={{ xs: 12, md: 6 }}>
              <RiskCard
                title="PIP Suspense Accumulation"
                description="Periodic Interim Payment suspense balances are growing. Current open suspense across all PTANs indicates claims are not being applied at the expected rate."
                action="Accelerate claim submission for PTAN12345 to draw down the $138,648.96 suspense balance."
              />
            </Grid>
          )}
        </Grid>
      </Box>
    );
  };

  // --- RENDERING PAYER PERFORMANCE (activeSubTab === 2) ---
  const renderPayerPerformance = () => {
    const data = trendsData?.payerPerformance || [];
    if (data.length === 0) return <Typography sx={{ p: 3 }}>No payer performance data available for this range.</Typography>;

    const columns: DataColumn<PayerPerformanceRecord>[] = [
      {
        id: 'payerName',
        label: 'PAYER NAME',
        minWidth: 180,
        render: (row) => <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.payerName}</Typography>,
        accessor: (row) => row.payerName,
      },
      { id: 'volume', label: 'VOLUME', align: 'right', render: (row) => row.volume, accessor: (row) => row.volume },
      { id: 'depositCount', label: 'DEPOSIT COUNT', align: 'right', render: (row) => row.depositCount, accessor: (row) => row.depositCount },
      { id: 'matchRate', label: 'MATCH RATE', align: 'right', render: (row) => `${row.matchRate}%`, accessor: (row) => row.matchRate },
      { id: 'denialRate', label: 'DENIAL RATE', align: 'right', render: (row) => `${row.denialRate}%`, accessor: (row) => row.denialRate },
      { id: 'suspenseRate', label: 'SUSPENSE RATE', align: 'right', render: (row) => `${row.suspenseRate}%`, accessor: (row) => row.suspenseRate },
      { id: 'avgDaysToSettle', label: 'AVG DAYS TO SETTLE', align: 'right', render: (row) => row.avgDaysToSettle, accessor: (row) => row.avgDaysToSettle },
      { id: 'totalVariance', label: 'TOTAL VARIANCE', align: 'right', render: (row) => <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(row.totalVariance)}</Typography>, accessor: (row) => row.totalVariance },
      {
        id: 'status',
        label: 'STATUS',
        align: 'right',
        render: (row) => <StatusBadge status={row.status} />,
        accessor: (row) => row.status,
      },
    ];

    return (
      <Box sx={{}}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'rgb(10, 22, 40)' }}>Payer Performance Scorecard</Typography>
          <Typography variant="body2" color="text.secondary">Key metrics for payer reconciliation performance and financial risk.</Typography>
        </Box>

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
  };

  return (
    <Box sx={{ p: 0 }}>
      {activeSubTab === 0 && renderForecastTrends()}
      {activeSubTab === 1 && renderExecutiveSummary()}
      {activeSubTab === 2 && renderPayerPerformance()}
    </Box>
  );
};

export default TrendsScreen;
