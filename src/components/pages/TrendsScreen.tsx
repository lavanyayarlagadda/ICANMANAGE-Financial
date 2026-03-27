import React, { useMemo } from 'react';
import { Box, Typography, useTheme, useMediaQuery, Grid, Card, CardContent } from '@mui/material';
import SummaryCard from '@/components/atoms/SummaryCard';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge';
import { useAppSelector } from '@/store';
import { TeamPerformance, PayerPerformanceRecord, TrendsData } from '@/types/financials';
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
  ScreenHeaderContainer,
  ChartCardContainer,
  SummaryCardRichContainer,
  RiskCardContainer,
  PieChartCard,
  ChartWrapper,
} from './TrendsScreen.styles';

// --- Sub-components ---

const SummaryCardRich = ({ title, value, subtext, subtextColor }: { title: string, value: string, subtext?: string, subtextColor?: string }) => (
  <SummaryCardRichContainer>
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
  </SummaryCardRichContainer>
);

const RiskCard = ({ title, description, action, severity = 'error' }: { title: string, description: string, action: string, severity?: 'error' | 'warning' }) => (
  <RiskCardContainer severity={severity}>
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
  </RiskCardContainer>
);

// --- Main Components ---

const ForecastTrends: React.FC<{ trendsData: TrendsData }> = ({ trendsData }) => {
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const combinedChartData = useMemo(() => {
    if (!trendsData.reconRateTrend.length) return [];
    return [
      ...trendsData.reconRateTrend.map(d => ({ ...d, actual: d.rate, forecast: null })),
      {
        month: trendsData.reconRateTrend[trendsData.reconRateTrend.length - 1].month,
        actual: trendsData.reconRateTrend[trendsData.reconRateTrend.length - 1].rate,
        forecast: trendsData.reconRateTrend[trendsData.reconRateTrend.length - 1].rate
      },
      ...trendsData.avgDaysTrend.map(d => ({ month: d.month, actual: null, forecast: d.days }))
    ];
  }, [trendsData]);

  const teamColumns = useMemo<DataColumn<TeamPerformance>[]>(() => [
    {
      id: 'teamName',
      label: 'TEAM',
      minWidth: 150,
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: row.teamName === 'Total' ? 700 : 500 }}>
          {row.teamName}
        </Typography>
      ),
      accessor: (row) => row.teamName,
    },
    { id: 'reconCheckPercent', label: 'RECONCILED CHECK COUNT %', align: 'right', render: (row) => formatPercent(row.reconCheckPercent), accessor: (row) => row.reconCheckPercent },
    { id: 'unreconCheckPercent', label: 'UNRECONCILED CHECK COUNT %', align: 'right', render: (row) => formatPercent(row.unreconCheckPercent), accessor: (row) => row.unreconCheckPercent },
    { id: 'checkCountPercentByTeam', label: 'CHECK COUNT % BY TEAM', align: 'right', render: (row) => formatPercent(row.checkCountPercentByTeam), accessor: (row) => row.checkCountPercentByTeam },
    { id: 'reconCheckCount', label: 'RECONCILED CHECK COUNT', align: 'right', render: (row) => row.reconCheckCount, accessor: (row) => row.reconCheckCount },
    { id: 'unreconCheckCount', label: 'UNRECONCILED CHECK COUNT', align: 'right', render: (row) => row.unreconCheckCount, accessor: (row) => row.unreconCheckCount },
    { id: 'reconAmountPercent', label: 'RECONCILED AMOUNT %', align: 'right', render: (row) => formatPercent(row.reconAmountPercent), accessor: (row) => row.reconAmountPercent },
    { id: 'unreconAmountPercent', label: 'UNRECONCILED AMOUNT %', align: 'right', render: (row) => formatPercent(row.unreconAmountPercent), accessor: (row) => row.unreconAmountPercent },
    { id: 'amountPercentByTeam', label: 'AMOUNT % BY TEAM', align: 'right', render: (row) => formatPercent(row.amountPercentByTeam), accessor: (row) => row.amountPercentByTeam },
    { id: 'totalAmountPosted', label: 'TOTAL AMOUNT POSTED', align: 'right', render: (row) => formatCurrency(row.totalAmountPosted), accessor: (row) => row.totalAmountPosted },
    { id: 'totalAmountNotPosted', label: 'TOTAL AMOUNT NOT POSTED', align: 'right', render: (row) => formatCurrency(row.totalAmountNotPosted), accessor: (row) => row.totalAmountNotPosted },
    { id: 'avgDaysToReconcile', label: 'AVG DAYS TO RECONCILE', align: 'right', render: (row) => row.avgDaysToReconcile, accessor: (row) => row.avgDaysToReconcile },
  ], []);

  const teamTableData = useMemo(() => [
    ...trendsData.teams,
    {
      teamName: 'Total',
      reconCheckPercent: 99.54,
      unreconCheckPercent: 0.46,
      checkCountPercentByTeam: 100.00,
      reconCheckCount: 432,
      unreconCheckCount: 2,
      reconAmountPercent: 99.73,
      unreconAmountPercent: 0.27,
      amountPercentByTeam: 100.00,
      totalAmountPosted: 9766405.93,
      totalAmountNotPosted: 26872.02,
      avgDaysToReconcile: 5.39
    }
  ], [trendsData]);

  return (
    <>
      <ScreenHeaderContainer>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'rgb(10, 22, 40)' }}>
          Reconciliation Trends & Forecast (December 2025 Reference)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monthly reconciliation performance summary by team. Tracks check counts, amounts, and average processing time.
        </Typography>
      </ScreenHeaderContainer>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {trendsData.kpis.map((kpi) => (
          <Grid size={{ xs: 12, md: 3 }} key={kpi.label}>
            <SummaryCard title={kpi.label} value={kpi.value} backgroundColor="#fff" />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Reconciliation Performance (6M History + 3M S-Curve Forecast)
        </Typography>
        <RangeDropdown />
      </Box>

      <ChartCardContainer>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={combinedChartData}>
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
            <Line type="monotone" dataKey="actual" name="Actual Reconciled Amount" stroke={theme.palette.primary.main} strokeWidth={3} dot={{ r: 4, fill: theme.palette.primary.main, strokeWidth: 2, stroke: '#fff' }} />
            <Line type="monotone" dataKey="forecast" name="S-Curve Forecast Projection" stroke={theme.palette.secondary.main} strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: theme.palette.secondary.main, strokeWidth: 2, stroke: '#fff' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCardContainer>

      <Box sx={{ mb: 4 }}>
        <DataTable
          columns={teamColumns}
          data={teamTableData}
          rowKey={(r) => r.teamName}
          paginated={false}
          searchable={false}
          dictionaryId="forecast-trends"
        />
      </Box>
    </>
  );
};

const ExecutiveSummary: React.FC = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const paymentColors = ['#6B99C4', '#D97706', '#65A30D', '#E2E8F0'];
  const adjustmentColors = ['#6B99C4', '#D97706', '#DC2626', '#166534'];

  return (
    <Box>
      <ScreenHeaderContainer>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'rgb(10, 22, 40)' }}>Executive Summary</Typography>
        <Typography variant="body2" color="text.secondary">High-level financial overview and key operational insights for leadership review.</Typography>
      </ScreenHeaderContainer>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <SummaryCardRich title="Total Collections (MTD)" value="$487,250.00" subtext="+8.3% vs prior month" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <SummaryCardRich title="Reconciliation Rate" value="99.54%" subtext="Target: 99.0%" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <SummaryCardRich title="Open Suspense" value="$26,872.02" subtext="2 unreconciled checks" subtextColor="#DC2626" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <SummaryCardRich title="Avg Days to Reconcile" value="5.39" subtext="Target: < 7 days" />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PieChartCard>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Payment Mix</Typography>
              <ChartWrapper>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'EFT Payments', value: 60 },
                        { name: 'Check Payments', value: 20 },
                        { name: 'Patient Pay', value: 14 },
                        { name: 'Other', value: 6 },
                      ]}
                      innerRadius={isSmallMobile ? 45 : (isTablet ? 50 : 60)}
                      outerRadius={isSmallMobile ? 70 : (isTablet ? 80 : 100)}
                      paddingAngle={5}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                    >
                      {[0, 1, 2, 3].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={paymentColors[index % paymentColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend 
                      layout={isTablet ? "horizontal" : "vertical"} 
                      align={isTablet ? "center" : "right"} 
                      verticalAlign={isTablet ? "bottom" : "middle"} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </CardContent>
          </PieChartCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PieChartCard>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Adjustment Breakdown</Typography>
              <ChartWrapper>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Contractual (CO)', value: 50 },
                        { name: 'Patient Resp (PR)', value: 25 },
                        { name: 'Denials', value: 15 },
                        { name: 'Other Adj', value: 10 },
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
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </CardContent>
          </PieChartCard>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <RiskCard
            title="Forward Balance Risk"
            description="30 active forward balance notices totaling significant withholdings. Summit Health Systems has the largest exposure at $2,500.00 with $1,875.00 remaining."
            action="Review FB-2025-9981A for potential dispute filing."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RiskCard
            title="PIP Suspense Accumulation"
            description="Periodic Interim Payment suspense balances are growing. Current open suspense indicates claims are not being applied at the expected rate."
            action="Accelerate claim submission for PTAN12345."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const PayerPerformance: React.FC<{ data: PayerPerformanceRecord[] }> = ({ data }) => {
  const columns = useMemo<DataColumn<PayerPerformanceRecord>[]>(() => [
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
  ], []);

  return (
    <Box>
      <ScreenHeaderContainer>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'rgb(10, 22, 40)' }}>Payer Performance Scorecard</Typography>
        <Typography variant="body2" color="text.secondary">Key metrics for payer reconciliation performance and financial risk.</Typography>
      </ScreenHeaderContainer>

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

const TrendsScreen: React.FC = () => {
  const trendsData = useAppSelector((s) => s.financials.trendsData);
  const { activeSubTab } = useAppSelector((s) => s.ui);

  if (!trendsData) return <Typography>No trends data available.</Typography>;

  return (
    <Box>
      {activeSubTab === 0 && <ForecastTrends trendsData={trendsData} />}
      {activeSubTab === 1 && <ExecutiveSummary />}
      {activeSubTab === 2 && <PayerPerformance data={trendsData.payerPerformance || []} />}
    </Box>
  );
};

export default TrendsScreen;
