import React, { useMemo } from 'react';
import { Grid, Typography, useTheme } from '@mui/material';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { addMonths, format } from 'date-fns';

import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import { formatCompactCurrency, formatCurrency } from '@/utils/formatters';

import { ChartContainer, LegendWrapper, SectionHeader, TitleText } from '../TrendsScreen.styles';
import {
  avgDaysFieldFormat,
  countFieldFormat,
  createForecastCellValueGetter,
  createSharedColumnCellProps,
  currencyFieldFormat,
  ForecastDashboardRow,
  isOverallTeam,
  percentFieldFormat,
} from '../helpers/forecastTrendsTableHelpers';

interface PerformanceData {
  month: string;
  actualReconciledAmount: string | number | null;
  forecastAmount: string | number | null;
}

const getSafeMonthLabel = (
  monthValue: string | null | undefined,
  fallbackDate: string,
  index: number,
): string => {
  const parsed = monthValue ? new Date(monthValue) : new Date(fallbackDate);
  const fallbackParsed = new Date(fallbackDate);
  const isInvalid = Number.isNaN(parsed.getTime());
  const isEpochLike = !isInvalid && parsed.getFullYear() <= 1971;
  const safeDate = isInvalid || isEpochLike ? addMonths(fallbackParsed, index) : parsed;
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

interface ForecastTrendsSectionProps {
  forecastSummary: unknown;
  reconPerformance: unknown;
  dashboardRows: ForecastDashboardRow[];
  dashboardTableTitle: string;
  globalFilters: unknown;
  handleRangeChange: (val: string) => void;
  isMindpath: boolean;
  isFetching: boolean;
}

export const ForecastTrendsSection: React.FC<ForecastTrendsSectionProps> = ({
  forecastSummary,
  reconPerformance,
  dashboardRows,
  dashboardTableTitle,
  globalFilters,
  handleRangeChange,
  isMindpath,
  isFetching,
}) => {
  const theme = useTheme();

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
          <Typography variant="body2" sx={{ fontWeight: isOverallTeam(row.team) ? 700 : 500 }}>
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
          <Typography variant="body2" sx={{ fontWeight: isOverallTeam(row.team) ? 700 : 500 }}>
            {row.team}
          </Typography>
        ),
        accessor: (row) => row.team,
      },
      makeValueColumn(
        'reconciledCheckCountPct',
        'RECONCILED CHECK %',
        'reconciledCheckCountPct',
        percentFieldFormat,
        true,
      ),
      makeValueColumn(
        'unreconciledCheckCountPct',
        'UNRECONCILED CHECK %',
        'unreconciledCheckCountPct',
        percentFieldFormat,
        true,
      ),
      makeValueColumn(
        'checkCountPctByTeam',
        'CHECK % BY TEAM',
        'checkCountPctByTeam',
        percentFieldFormat,
        false,
      ),
      makeValueColumn(
        'reconciledCheckCount',
        'RECONCILED COUNT',
        'reconciledCheckCount',
        countFieldFormat,
        false,
      ),
      makeValueColumn(
        'unreconciledCheckCount',
        'UNRECONCILED COUNT',
        'unreconciledCheckCount',
        countFieldFormat,
        true,
      ),
      makeValueColumn(
        'reconciledAmountPct',
        'RECONCILED AMT %',
        'reconciledAmountPct',
        percentFieldFormat,
        true,
      ),
      makeValueColumn(
        'unreconciledAmountPct',
        'UNRECONCILED AMT %',
        'unreconciledAmountPct',
        percentFieldFormat,
        true,
      ),
      makeValueColumn(
        'amountPctByTeam',
        'AMT % BY TEAM',
        'amountPctByTeam',
        percentFieldFormat,
        false,
      ),
      makeValueColumn(
        'totalAmountPosted',
        'TOTAL POSTED',
        'totalAmountPosted',
        currencyFieldFormat,
        false,
      ),
      makeValueColumn(
        'totalAmountNotPosted',
        'TOTAL NOT POSTED',
        'totalAmountNotPosted',
        currencyFieldFormat,
        true,
      ),
      makeValueColumn(
        'avgDaysToReconcile',
        'AVG DAYS',
        'avgDaysToReconcile',
        avgDaysFieldFormat,
        false,
      ),
    ];
  }, [overallDashboardRow]);

  return (
    <>
      <SectionHeader>
        <TitleText variant="h6">Reconciliation Trends & Forecast</TitleText>
        <Typography variant="body2" color="text.secondary">
          Monthly reconciliation performance summary.
        </Typography>
      </SectionHeader>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <SummaryCard
            title="TOTAL RECONCILED"
            value={formatCurrency(forecastSummary?.data?.totalAmountReconciled ?? 0)}
            backgroundColor={theme.palette.background.paper}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <SummaryCard
            title="TOTAL UNRECONCILED"
            value={formatCurrency(forecastSummary?.data?.totalAmountUnreconciled ?? 0)}
            backgroundColor={theme.palette.background.paper}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <SummaryCard
            title="RECON RATE"
            value={`${forecastSummary?.data?.globalReconciliationRate ?? 0}%`}
            backgroundColor={theme.palette.background.paper}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <SummaryCard
            title="AVG DAYS"
            value={(forecastSummary?.data?.avgDaysToReconcile ?? 0).toString()}
            backgroundColor={theme.palette.background.paper}
          />
        </Grid>
      </Grid>
      <LegendWrapper>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Performance
        </Typography>
        <RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />
      </LegendWrapper>
      <ChartContainer>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart
            data={(() => {
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
                  forecast: parseFloat(String(d.forecastAmount || '0')),
                };
              });
            })()}
          >
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
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke={theme.palette.primary.main}
              strokeWidth={3}
              dot={{ r: 4, fill: theme.palette.primary.main }}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Forecast"
              stroke={theme.palette.secondary.main}
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: theme.palette.secondary.main }}
            />
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
  );
};
