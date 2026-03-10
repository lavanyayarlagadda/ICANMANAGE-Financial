import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Grid';
import KpiCard from '@/components/atoms/KpiCard';
import StatusBadge from '@/components/atoms/StatusBadge';
import TeamPerformanceCard from '@/components/molecules/TeamPerformanceCard';
import TrendChart from '@/components/molecules/TrendChart';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import { useAppSelector } from '@/store';
import { ForecastRow } from '@/types/financials';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PercentIcon from '@mui/icons-material/Percent';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SpeedIcon from '@mui/icons-material/Speed';

const kpiIcons = [
  <CheckCircleOutlineIcon fontSize="small" key="check" />,
  <PercentIcon fontSize="small" key="pct" />,
  <AccountBalanceWalletIcon fontSize="small" key="wallet" />,
  <SpeedIcon fontSize="small" key="speed" />,
];

const TrendsScreen: React.FC = () => {
  const theme = useTheme();
  const trendsData = useAppSelector((s) => s.financials.trendsData);

  if (!trendsData) return <Typography>No trends data.</Typography>;

  const blueGradient = ['#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2'];
  const orangeGradient = ['#FFD54F', '#FFCA28', '#FFC107', '#FFB300', '#FFA000', '#FF8F00'];

  const forecastColumns: DataColumn<ForecastRow>[] = [
    {
      id: 'metric',
      label: 'Metric',
      minWidth: 160,
      render: (row) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.metric}</Typography>,
      accessor: (row) => row.metric,
    },
    {
      id: 'actual',
      label: "Dec '25 (Actual)",
      align: 'right',
      render: (row) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{row.actual}</Typography>,
      accessor: (row) => row.actual,
    },
    {
      id: 'month1',
      label: "Jan '26 (Projected)",
      align: 'right',
      render: (row) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{row.month1}</Typography>,
      accessor: (row) => row.month1,
    },
    {
      id: 'month2',
      label: "Feb '26 (Projected)",
      align: 'right',
      render: (row) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{row.month2}</Typography>,
      accessor: (row) => row.month2,
    },
    {
      id: 'month3',
      label: "Mar '26 (Projected)",
      align: 'right',
      render: (row) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{row.month3}</Typography>,
      accessor: (row) => row.month3,
    },
    {
      id: 'trend',
      label: 'Trend',
      render: (row) => <StatusBadge status={row.trend} />,
      accessor: (row) => row.trend,
      filterOptions: ['Improving', 'Growing', 'Decreasing', 'Stable'],
    },
  ];

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {trendsData.kpis.map((kpi, i) => (
          <Grid size={{ xs: 6, md: 3 }} key={kpi.label}>
            <KpiCard label={kpi.label} value={kpi.value} change={kpi.change} changeType={kpi.changeType} icon={kpiIcons[i]} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
        Reconciliation Performance by Team — December 2025
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {trendsData.teams.map((team) => (
          <Grid size={{ xs: 12, md: 6 }} key={team.teamName}>
            <TeamPerformanceCard team={team} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TrendChart
            title="Reconciliation Rate Trend"
            data={trendsData.reconRateTrend}
            xKey="month"
            yKey="rate"
            yLabel="Recon Rate %"
            barColors={blueGradient}
            lineColor={theme.palette.primary.main}
            yDomain={[96, 100]}
            tooltipFormatter={(v) => `${v}%`}
            labelFormatter={(v) => `${v}%`}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TrendChart
            title="Avg. Days to Reconcile Trend"
            data={trendsData.avgDaysTrend}
            xKey="month"
            yKey="days"
            yLabel="Avg Days"
            barColors={orangeGradient}
            lineColor={theme.palette.warning.main}
          />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>3-Month Forecast Projection</Typography>
      <DataTable
        columns={forecastColumns}
        data={trendsData.forecast}
        rowKey={(r) => r.metric}
        paginated={false}
        exportTitle="3-Month Forecast"
        customToolbarContent={<RangeDropdown />}
      />
    </Box>
  );
};

export default TrendsScreen;
