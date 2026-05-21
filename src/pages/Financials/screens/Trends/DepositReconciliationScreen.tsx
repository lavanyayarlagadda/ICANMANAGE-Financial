import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
  type Theme
} from '@mui/material';
import { addMonths, format, parse, subMonths } from 'date-fns';
import summaryContract from '@/data/depositReconciliationExecutiveSummary.json';
import { useAppDispatch, useAppSelector } from '@/store';
import { setIsGlobalFetching, setIsReloading } from '@/store/slices/uiSlice';
import {
  useGetDepositReconciliationAdjustedCashDepositQuery,
  useGetDepositReconciliationAgingQuery,
  useGetDepositReconciliationExecutiveSummaryQuery,
  useGetDepositReconciliationPostedEmrReconciledQuery,
  useGetDepositReconciliationPostedEmrUnreconciledQuery,
  useGetDepositReconciliationTopPayersQuery,
  useLazyExportDepositReconciliationPdfQuery
} from '@/store/api/financialsApi';
import { downloadFileFromBlob } from '@/utils/downloadHelper';
import { formatDateForFilename } from '@/utils/formatters';
import type {
  DepositReconAgingQueryParams,
  DepositReconTrendsQueryParams
} from '@/interfaces/api';

type HeroCard = {
  id: string;
  title: string;
  value: string;
  delta: string | number;
  deltaTrend: 'up' | 'down' | 'neutral';
  subLabel: string;
  sparkline?: number[];
};

type AgingRow = {
  bucket: string;
  deposits: string;
  amount: string;
  share: string | number;
  riskLevel?: string;
};

type AgingSummary = {
  headlineValue: string;
  headlineMeta: string;
};

type PayerRow = {
  payer: string;
  total: string;
  share: string;
  matchRate: string;
  momDelta: string | number;
  sixMonthTrend?: number[];
};

type TrendColumn = {
  label: string;
  kind: string;
};

type SectionRow = {
  id: string;
  name: string;
  momDelta: string | number;
  amounts: string[];
  sparkline?: number[];
  isGroupHeader?: boolean;
  isSubtotal?: boolean;
  isTotal?: boolean;
};

type TrendTableData = {
  columns: TrendColumn[];
  rows: SectionRow[];
};

type GenericRecord = Record<string, unknown>;

const toRecord = (value: unknown): GenericRecord | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as GenericRecord) : null;

const unwrapResponse = (value: unknown): GenericRecord => {
  const record = toRecord(value);
  if (!record) return {};
  const data = toRecord(record.data);
  if (data) return data;
  const content = toRecord(record.content);
  if (content) return content;
  return record;
};

const toArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);
const ensureArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const pickRecord = (source: GenericRecord, keys: string[]): GenericRecord => {
  for (const key of keys) {
    const value = toRecord(source[key]);
    if (value) return value;
  }
  return {};
};

const pickArray = <T,>(source: GenericRecord, keys: string[]): T[] => {
  for (const key of keys) {
    const arr = toArray<T>(source[key]);
    if (arr.length > 0) return arr;
    const nested = toRecord(source[key]);
    if (nested) {
      const nestedContent = toArray<T>(nested.content);
      if (nestedContent.length > 0) return nestedContent;
      const nestedData = toArray<T>(nested.data);
      if (nestedData.length > 0) return nestedData;
    }
  }
  return [];
};

const toPercent = (value: unknown): string => {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return '—';
  return `${num.toFixed(1)}%`;
};

const toDeposits = (value: unknown): string => {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

const toCurrency = (value: unknown): string => {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

const formatColumnAmount = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return toCurrency(0);
  return toCurrency(value);
};

const getForecastColumnCount = (forecastWindow: string): number => {
  if (forecastWindow === 'off') return 0;
  return forecastWindow === '6m' ? 3 : forecastWindow === '3m' ? 3 : 0;
};

const parseMonthColumnLabel = (label: string): Date | null => {
  const match = label.match(/^([A-Za-z]{3})\s+'(\d{2})$/);
  if (!match) return null;
  const parsed = parse(`${match[1]} 1, 20${match[2]}`, 'MMM d, yyyy', new Date());
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const ensureForecastColumns = (columns: TrendColumn[], forecastWindow: string): TrendColumn[] => {
  const forecastCount = getForecastColumnCount(forecastWindow);
  const actualColumns = columns.filter((col) => col.kind !== 'FORECAST');

  if (forecastCount === 0) {
    return actualColumns.length > 0 ? actualColumns : columns;
  }

  const existingForecast = columns.filter((col) => col.kind === 'FORECAST');
  const forecastColumns: TrendColumn[] = [...existingForecast];

  if (forecastColumns.length < forecastCount) {
    const anchor =
      (actualColumns.length > 0 && parseMonthColumnLabel(actualColumns[actualColumns.length - 1].label)) ||
      new Date();

    while (forecastColumns.length < forecastCount) {
      const monthOffset = forecastColumns.length + 1;
      forecastColumns.push({
        label: format(addMonths(anchor, monthOffset), "MMM ''yy"),
        kind: 'FORECAST'
      });
    }
  }

  return [...actualColumns, ...forecastColumns.slice(0, forecastCount)];
};

const normalizeAgingRows = (buckets: unknown): AgingRow[] => {
  if (!Array.isArray(buckets)) return [];
  return buckets
    .map((item): AgingRow | null => {
      const row = toRecord(item);
      if (!row) return null;

      const bucket = toText(row.label || row.bucket);
      if (!bucket) return null;

      return {
        bucket,
        deposits: toDeposits(row.deposits),
        amount: toCurrency(row.amount),
        share: toPercent(row.percentOfTotal ?? row.share),
        riskLevel: toText(row.riskLevel || '')
      };
    })
    .filter((v): v is AgingRow => v !== null);
};

const normalizeAgingSummary = (source: GenericRecord): AgingSummary | null => {
  const hasTotalAmount = source.totalAmount !== undefined && source.totalAmount !== null;
  const hasTotalDeposits = source.totalDeposits !== undefined && source.totalDeposits !== null;
  const hasPercentOver30 = source.percentOver30Days !== undefined && source.percentOver30Days !== null;

  if (!hasTotalAmount && !hasTotalDeposits && !hasPercentOver30) return null;

  return {
    headlineValue: hasTotalAmount ? toCurrency(source.totalAmount) : '—',
    headlineMeta: hasTotalDeposits || hasPercentOver30
      ? `across ${hasTotalDeposits ? toDeposits(source.totalDeposits) : '0'} deposits • ${
          hasPercentOver30 ? toPercent(source.percentOver30Days).replace('%', '')
          : '—'
        }% > 30 days`
      : ''
  };
};

const agingRiskColor = (riskLevel: string | undefined, theme: Theme) => {
  switch (String(riskLevel || '').toUpperCase()) {
    case 'GREEN':
      return theme.palette.success.main;
    case 'ORANGE':
    case 'YELLOW':
      return theme.palette.warning.main;
    case 'RED':
      return theme.palette.error.main;
    default:
      return theme.palette.primary.main;
  }
};

const toNumericAmount = (value: unknown): number | null => {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : null;
};

const calculateMomChangePercent = (present: number, previous: number): number | null => {
  if (!Number.isFinite(present) || !Number.isFinite(previous) || previous === 0) return null;
  return ((present - previous) / previous) * 100;
};

const momDirectionFromPercent = (percent: number): 'UP' | 'DOWN' | 'NONE' => {
  if (percent > 0) return 'UP';
  if (percent < 0) return 'DOWN';
  return 'NONE';
};

const calculateMomFromColumns = (
  amountsByColumn: GenericRecord,
  columns: TrendColumn[]
): { percent: number; direction: 'UP' | 'DOWN' | 'NONE' } | null => {
  const actualColumns = columns.filter((col) => col.kind !== 'FORECAST');
  const targetColumns = actualColumns.length >= 2 ? actualColumns : columns;
  if (targetColumns.length < 2) return null;

  const present = toNumericAmount(amountsByColumn[targetColumns[targetColumns.length - 1].label]);
  const previous = toNumericAmount(amountsByColumn[targetColumns[targetColumns.length - 2].label]);
  const percent = present !== null && previous !== null ? calculateMomChangePercent(present, previous) : null;
  if (percent === null) return null;

  return { percent, direction: momDirectionFromPercent(percent) };
};

const calculateMomFromSeries = (values: number[]): { percent: number; direction: 'UP' | 'DOWN' | 'NONE' } | null => {
  if (values.length < 2) return null;
  const present = values[values.length - 1];
  const previous = values[values.length - 2];
  const percent = calculateMomChangePercent(present, previous);
  if (percent === null) return null;
  return { percent, direction: momDirectionFromPercent(percent) };
};

const toDelta = (percent: unknown, direction: unknown): string => {
  const num = typeof percent === 'number' ? percent : Number(percent);
  if (!Number.isFinite(num)) return '—';

  const dir = String(direction || '').toUpperCase();
  if (dir === 'NONE' || num === 0) return '0.0%';

  const arrow = dir === 'UP' ? '▲' : dir === 'DOWN' ? '▼' : num > 0 ? '▲' : '▼';
  return `${arrow} ${Math.abs(num).toFixed(1)}%`;
};

const resolveTrend = (direction: unknown, delta: unknown): 'up' | 'down' | 'neutral' => {
  const dir = String(direction || '').toLowerCase();
  if (dir === 'up') return 'up';
  if (dir === 'down') return 'down';

  const deltaNum = typeof delta === 'number' ? delta : Number(String(delta).replace(/[^\d.-]/g, ''));
  if (Number.isFinite(deltaNum)) return deltaNum > 0 ? 'up' : deltaNum < 0 ? 'down' : 'neutral';
  const deltaText = String(delta || '');
  if (deltaText.includes('▲')) return 'up';
  if (deltaText.includes('▼')) return 'down';
  return 'neutral';
};

const normalizeHeroCards = (cards: unknown): HeroCard[] => {
  if (!Array.isArray(cards)) return [];
  return cards
    .map((c, index): HeroCard | null => {
      const card = toRecord(c);
      if (!card) return null;

      const title = toText(card.title || card.label || card.name);
      if (!title) return null;

      const rawDelta = card.delta ?? card.percentChange ?? card.percentageChange ?? card.momChangePercent;
      const rawDirection = card.deltaTrend ?? card.changeDirection ?? card.direction ?? card.momDirection;

      const delta =
        rawDelta !== undefined && rawDelta !== null && String(rawDelta).trim() !== ''
          ? String(rawDelta).includes('%') || String(rawDelta).includes('▲') || String(rawDelta).includes('▼')
            ? toText(rawDelta)
            : toDelta(rawDelta, rawDirection)
          : '—';

      const sparkline = Array.isArray(card.sparkline)
        ? card.sparkline
            .map((v) => (typeof v === 'number' ? v : Number(v)))
            .filter((v) => Number.isFinite(v))
        : undefined;

      return {
        id: toText(card.id || card.code || card.cardId || card.metricKey || `${title}-${index}`),
        title,
        value: toText(card.displayValue ?? card.value ?? card.metricValue ?? card.amount ?? card.amountValue ?? ''),
        delta,
        deltaTrend: resolveTrend(rawDirection, delta),
        subLabel: toText(card.subLabel || card.subtitle || card.meta || ''),
        sparkline: sparkline && sparkline.length > 1 ? sparkline : undefined
      };
    })
    .filter((v): v is HeroCard => v !== null);
};

const normalizeTrendColumns = (source: GenericRecord): TrendColumn[] => {
  const cols = pickArray<unknown>(source, ['columns']);
  return cols
    .map((item): TrendColumn | null => {
      const col = toRecord(item);
      if (!col) return null;
      const label = toText(col.label);
      if (!label) return null;
      return {
        label,
        kind: toText(col.kind || 'ACTUAL').toUpperCase()
      };
    })
    .filter((v): v is TrendColumn => v !== null);
};

const deriveColumnsFromRows = (rows: unknown, columns: TrendColumn[]): TrendColumn[] => {
  if (columns.length > 0) return columns;
  if (!Array.isArray(rows) || rows.length === 0) return [];

  for (const item of rows) {
    const row = toRecord(item);
    const amountsByColumn = toRecord(row?.amountsByColumn);
    if (amountsByColumn) {
      return Object.keys(amountsByColumn).map((label) => ({ label, kind: 'ACTUAL' }));
    }
  }
  return [];
};

const normalizeTrendRow = (r: unknown, columns: TrendColumn[], rowId: string): SectionRow | null => {
  const row = toRecord(r);
  if (!row) return null;

  const amountsByColumn = toRecord(row.amountsByColumn) || {};
  const name = toText(row.label || row.name);
  if (!name) return null;

  const sparkline = Array.isArray(row.sparkline)
    ? row.sparkline
        .map((v) => (typeof v === 'number' ? v : Number(v)))
        .filter((v) => Number.isFinite(v))
    : undefined;

  const rowType = String(row.rowType || '').toUpperCase();
  const amounts =
    columns.length > 0
      ? columns.map((col) => formatColumnAmount(amountsByColumn[col.label]))
      : Object.keys(amountsByColumn).map((key) => formatColumnAmount(amountsByColumn[key]));

  const calculatedMom = calculateMomFromColumns(amountsByColumn, columns);
  const momDelta = calculatedMom
    ? toDelta(calculatedMom.percent, calculatedMom.direction)
    : toDelta(row.momChangePercent, row.momDirection);

  return {
    id: rowId,
    name,
    momDelta,
    amounts,
    sparkline: sparkline && sparkline.length > 1 ? sparkline : undefined,
    isSubtotal: rowType === 'SUBTOTAL',
    isTotal: rowType === 'TOTAL' || rowType === 'SUBTOTAL' || Boolean(row.isTotal)
  };
};

const normalizeTrendRows = (rows: unknown, columns: TrendColumn[]): SectionRow[] => {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r, index) => normalizeTrendRow(r, columns, `row-${index}`))
    .filter((v): v is SectionRow => v !== null);
};

const normalizeFlatTrendTable = (source: GenericRecord, forecastWindow: string): TrendTableData => {
  const apiColumns = normalizeTrendColumns(source);
  const rawRows = pickArray<unknown>(source, ['rows', 'data', 'tableRows']);
  const columns = ensureForecastColumns(deriveColumnsFromRows(rawRows, apiColumns), forecastWindow);
  return {
    columns,
    rows: normalizeTrendRows(rawRows, columns)
  };
};

const normalizeGroupedTrendTable = (source: GenericRecord, forecastWindow: string): TrendTableData => {
  const apiColumns = normalizeTrendColumns(source);
  const groups = toArray<unknown>(source.groups);

  if (groups.length > 0) {
    const sampleRows = groups.flatMap((groupItem) => {
      const group = toRecord(groupItem);
      return group ? toArray<unknown>(group.rows) : [];
    });
    const columns = ensureForecastColumns(deriveColumnsFromRows(sampleRows, apiColumns), forecastWindow);
    const result: SectionRow[] = [];
    let rowIndex = 0;

    for (const groupItem of groups) {
      const group = toRecord(groupItem);
      if (!group) continue;

      const groupName = toText(group.groupName);
      if (groupName) {
        result.push({
          id: `group-${rowIndex++}`,
          name: groupName,
          momDelta: '',
          amounts: columns.map(() => ''),
          isGroupHeader: true
        });
      }

      for (const groupRow of toArray<unknown>(group.rows)) {
        const normalized = normalizeTrendRow(groupRow, columns, `row-${rowIndex++}`);
        if (normalized) result.push(normalized);
      }

      const subtotal = normalizeTrendRow(group.subtotal, columns, `subtotal-${rowIndex++}`);
      if (subtotal) {
        result.push({
          ...subtotal,
          isSubtotal: true,
          isTotal: true
        });
      }
    }

    const totalRow = normalizeTrendRow(source.totalRow, columns, `total-${rowIndex}`);
    if (totalRow) {
      result.push({
        ...totalRow,
        isTotal: true
      });
    }

    return { columns, rows: result };
  }

  return normalizeFlatTrendTable(source, forecastWindow);
};

const normalizeTopPayerRows = (rows: unknown): PayerRow[] => {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r): PayerRow | null => {
      const row = toRecord(r);
      if (!row) return null;

      const payer = toText(row.payerName || row.payer);
      if (!payer) return null;

      const total =
        row.totalAmount !== undefined && row.totalAmount !== null
          ? toCurrency(row.totalAmount)
          : toText(row.total);

      const percent = typeof row.percentOfTotal === 'number' ? row.percentOfTotal : Number(row.percentOfTotal);
      const share = Number.isFinite(percent) ? `${percent.toFixed(1)}%` : toText(row.share);

      const matchRateNum = typeof row.matchRate === 'number' ? row.matchRate : Number(row.matchRate);
      const matchRate = Number.isFinite(matchRateNum) ? `${matchRateNum.toFixed(1)}%` : toText(row.matchRate);

      const sixMonthTrend = Array.isArray(row.sixMonthTrend)
        ? row.sixMonthTrend
            .map((v) => (typeof v === 'number' ? v : Number(v)))
            .filter((v) => Number.isFinite(v))
        : undefined;

      const calculatedMom = sixMonthTrend ? calculateMomFromSeries(sixMonthTrend) : null;
      const momDelta = calculatedMom
        ? toDelta(calculatedMom.percent, calculatedMom.direction)
        : toDelta(row.momChangePercent ?? row.momDelta, row.momDirection);

      return {
        payer,
        total,
        share,
        matchRate,
        momDelta,
        sixMonthTrend: sixMonthTrend && sixMonthTrend.length > 0 ? sixMonthTrend : undefined
      };
    })
    .filter((v): v is PayerRow => v !== null);
};

const toText = (value: unknown, fallback = '') => String(value ?? fallback);

const deltaColor = (delta: string | number, positive: string, negative: string, neutral: string) => {
  const deltaNum = typeof delta === 'number' ? delta : Number(String(delta).replace(/[^\d.-]/g, ''));
  const deltaText = toText(delta);

  // Arrow markers are authoritative when present.
  if (deltaText.includes('▲')) return positive;
  if (deltaText.includes('▼')) return negative;

  // Fallback to numeric sign for signed values.
  if (!Number.isNaN(deltaNum) && deltaNum > 0) return positive;
  if (!Number.isNaN(deltaNum) && deltaNum < 0) return negative;
  return neutral;
};

const Sparkline: React.FC<{ values: number[]; color: string }> = ({ values, color }) => {
  const points =
    values.length <= 1
      ? ''
      : (() => {
          const min = Math.min(...values);
          const max = Math.max(...values);
          const range = max - min || 1;
          return values
            .map((point, idx) => {
              const y = 22 - ((point - min) / range) * 18;
              return `${(idx * 120) / (values.length - 1)},${y}`;
            })
            .join(' ');
        })();

  return (
    <svg viewBox="0 0 120 24" preserveAspectRatio="none" style={{ width: 92, height: 18 }}>
      <polyline fill="none" stroke={color} strokeWidth="1.8" points={points} />
    </svg>
  );
};

const SectionTable: React.FC<{
  title: string;
  description: string;
  columns: TrendColumn[];
  rows: SectionRow[];
}> = ({ title, description, columns, rows }) => {
  const theme = useTheme();
  const firstForecastIdx = columns.findIndex((col) => col.kind === 'FORECAST');

  return (
    <Card sx={{ mb: 2, border: `1px solid ${theme.palette.divider}` }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
            <Box component="thead">
              <Box component="tr">
                {['', 'Trend', 'Δ MoM', ...columns.map((col) => col.label)].map((label, idx) => (
                  <Box
                    component="th"
                    key={`${label}-${idx}`}
                    sx={{
                      py: 1,
                      px: 1,
                      textAlign: idx === 0 ? 'left' : 'right',
                      color: theme.palette.text.secondary,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      borderLeft:
                        firstForecastIdx >= 0 && idx === firstForecastIdx + 3
                          ? `1px dotted ${theme.palette.divider}`
                          : 'none',
                      fontSize: 12
                    }}
                  >
                    {label}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {rows.map((row) => {
                if (row.isGroupHeader) {
                  return (
                    <Box component="tr" key={row.id}>
                      <Box
                        component="td"
                        colSpan={columns.length + 3}
                        sx={{
                          py: 1,
                          px: 1,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          fontWeight: 600,
                          color: theme.palette.text.primary
                        }}
                      >
                        {row.name}
                      </Box>
                    </Box>
                  );
                }

                const isBoldRow = row.isTotal || row.isSubtotal;

                return (
                  <Box
                    component="tr"
                    key={row.id}
                    sx={{
                      backgroundColor: isBoldRow ? theme.palette.action.hover : 'transparent'
                    }}
                  >
                    <Box
                      component="td"
                      sx={{
                        py: 1,
                        px: 1,
                        pl: row.isSubtotal || row.isTotal ? 1 : 2.5,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        fontWeight: isBoldRow ? 700 : 500
                      }}
                    >
                      {row.name}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1, borderBottom: `1px solid ${theme.palette.divider}`, textAlign: 'right' }}>
                      {row.sparkline && row.sparkline.length > 1 ? (
                        <Sparkline
                          values={row.sparkline}
                          color={deltaColor(row.momDelta, theme.palette.success.main, theme.palette.error.main, theme.palette.primary.main)}
                        />
                      ) : null}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        py: 1,
                        px: 1,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        textAlign: 'right',
                        color: deltaColor(
                          row.momDelta,
                          theme.palette.success.main,
                          theme.palette.error.main,
                          theme.palette.text.secondary
                        ),
                        fontWeight: 700
                      }}
                    >
                      {toText(row.momDelta)}
                    </Box>
                    {row.amounts.map((value, idx) => {
                      const isForecast = firstForecastIdx >= 0 && idx >= firstForecastIdx;
                      return (
                        <Box
                          component="td"
                          key={`${row.id}-${idx}`}
                          sx={{
                            py: 1,
                            px: 1,
                            textAlign: 'right',
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            borderLeft:
                              idx === firstForecastIdx ? `1px dotted ${theme.palette.divider}` : 'none',
                            color: isForecast ? theme.palette.text.secondary : theme.palette.text.primary,
                            fontStyle: isForecast ? 'italic' : 'normal',
                            fontWeight: isBoldRow ? 700 : 500
                          }}
                        >
                          {value}
                        </Box>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const DepositReconciliationScreen: React.FC<{ skip?: boolean }> = ({skip = false}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const contract = summaryContract;
  const [trailingWindow, setTrailingWindow] = React.useState<string>(
    toText(contract.controls?.trailingWindow?.selected || '3m')
  );
  const [forecastWindow, setForecastWindow] = React.useState<string>(
    toText(contract.controls?.forecastWindow?.selected || '3m')
  );
  const [compareMode, setCompareMode] = React.useState<string>(
    toText(contract.controls?.comparisonMode?.selected || 'MoM')
  );

  const trendsQueryParams = React.useMemo((): DepositReconTrendsQueryParams => {
    const trailingWindowMonths =
      trailingWindow === '24m' ? 24 :
      trailingWindow === '12m' ? 12 :
      trailingWindow === '6m' ? 6 : 3;
    const forecastMonths =
      forecastWindow === '6m' ? 6 :
      forecastWindow === '3m' ? 3 : 0;
    const toDateObj = new Date();
    const fromDateObj = subMonths(toDateObj, trailingWindowMonths);

    return {
      fromDate: format(fromDateObj, 'yyyy-MM-dd'),
      toDate: format(toDateObj, 'yyyy-MM-dd'),
      trailingWindowMonths,
      forecastMonths,
      compare: compareMode.toUpperCase()
    };
  }, [trailingWindow, forecastWindow, compareMode]);

  const [triggerExportPdf, { isFetching: isExportingPdf }] = useLazyExportDepositReconciliationPdfQuery();

  const handleExportPdf = React.useCallback(async () => {
    try {
      const result = await triggerExportPdf(trendsQueryParams).unwrap();
      if (result) {
        downloadFileFromBlob(
          result,
          `Deposit_Reconciliation_${formatDateForFilename(trendsQueryParams.fromDate!)}_to_${formatDateForFilename(trendsQueryParams.toDate!)}.pdf`
        );
      }
    } catch (err) {
      console.error('PDF export failed:', err);
    }
  }, [triggerExportPdf, trendsQueryParams]);

  const agingQueryParams = React.useMemo((): DepositReconAgingQueryParams => ({
    fromDate: trendsQueryParams.fromDate!,
    toDate: trendsQueryParams.toDate!
  }), [trendsQueryParams.fromDate, trendsQueryParams.toDate]);

  // Base trends endpoint is intentionally disabled for this project.
  // const { data: pageResponse, isFetching: isFetchingPage } = useGetDepositReconciliationPageQuery(queryParams, { skip: skip ?? false });
  const { data: executiveResponse, isFetching: isFetchingExecutive, refetch: refetchExecutive } = useGetDepositReconciliationExecutiveSummaryQuery(trendsQueryParams, { skip: skip ?? false });
  const { data: agingResponse, isFetching: isFetchingAging, refetch: refetchAging } = useGetDepositReconciliationAgingQuery(agingQueryParams, { skip: skip ?? false });
  const { data: adjustedCashResponse, isFetching: isFetchingAdjustedCash, refetch: refetchAdjustedCash } = useGetDepositReconciliationAdjustedCashDepositQuery(trendsQueryParams, { skip: skip ?? false });
  const { data: reconciledResponse, isFetching: isFetchingReconciled, refetch: refetchReconciled } = useGetDepositReconciliationPostedEmrReconciledQuery(trendsQueryParams, { skip: skip ?? false });
  const { data: unreconciledResponse, isFetching: isFetchingUnreconciled, refetch: refetchUnreconciled } = useGetDepositReconciliationPostedEmrUnreconciledQuery(trendsQueryParams, { skip: skip ?? false });
  // Other Category endpoint is intentionally disabled for this project.
  // const { data: otherCategoryResponse, isFetching: isFetchingOtherCategory } = useGetDepositReconciliationOtherCategoryQuery(trendsQueryParams, { skip: skip ?? false });
  const { data: topPayersResponse, isFetching: isFetchingTopPayers, refetch: refetchTopPayers } = useGetDepositReconciliationTopPayersQuery(trendsQueryParams, { skip: skip ?? false });

  const { actionTriggers } = useAppSelector((s) => s.ui);
  const printCount = React.useRef(actionTriggers.print);
  const reloadCount = React.useRef(actionTriggers.reload);

  React.useEffect(() => {
    if (actionTriggers.print > printCount.current) {
      handleExportPdf();
      printCount.current = actionTriggers.print;
    }
  }, [actionTriggers.print, handleExportPdf]);

  React.useEffect(() => {
    if (actionTriggers.reload > reloadCount.current) {
      const doReload = async () => {
        try {
          dispatch(setIsReloading(true));
          await Promise.all([
            refetchExecutive(),
            refetchAging(),
            refetchAdjustedCash(),
            refetchReconciled(),
            refetchUnreconciled(),
            refetchTopPayers()
          ]);
        } catch (err) {
          console.error('Reload failed:', err);
        } finally {
          dispatch(setIsReloading(false));
        }
      };
      doReload();
      reloadCount.current = actionTriggers.reload;
    }
  }, [actionTriggers.reload, dispatch, refetchExecutive, refetchAging, refetchAdjustedCash, refetchReconciled, refetchUnreconciled, refetchTopPayers]);

  const isLoadingData =
    isFetchingExecutive ||
    isFetchingAging ||
    isFetchingAdjustedCash ||
    isFetchingReconciled ||
    isFetchingUnreconciled ||
    isFetchingTopPayers ||
    isExportingPdf;

  React.useEffect(() => {
    if (skip) {
      dispatch(setIsGlobalFetching(false));
      return;
    }
    dispatch(setIsGlobalFetching(isLoadingData));
    return () => {
      dispatch(setIsGlobalFetching(false));
    };
  }, [dispatch, isLoadingData, skip]);

  // const pageData = unwrapResponse(pageResponse);
  const executiveData = unwrapResponse(executiveResponse);
  const agingData = unwrapResponse(agingResponse);
  const adjustedCashData = unwrapResponse(adjustedCashResponse);
  const reconciledData = unwrapResponse(reconciledResponse);
  const unreconciledData = unwrapResponse(unreconciledResponse);
  // const otherCategoryData = unwrapResponse(otherCategoryResponse);
  const topPayersData = unwrapResponse(topPayersResponse);

  // const pageMeta = pickRecord(pageData, ['meta', 'screenMeta']);
  const executiveMeta = pickRecord(executiveData, ['meta', 'screenMeta']);
  const screenMeta = {
    title: toText(executiveMeta.title || contract.screenMeta.title),
    subtitle: toText(executiveMeta.subtitle || contract.screenMeta.subtitle),
    updatedAt: executiveData.lastUpdated || executiveMeta.updatedAt || contract.screenMeta.updatedAt
  };

  const monthAtGlanceTitle = toText(
    pickRecord(executiveData, ['monthAtGlance', 'insightsSummary']).title ||
      contract.monthAtGlance.title
  );
  const insights = pickArray<string>(executiveData, [
    'atAGlanceInsights',
    'insights',
    'highlights',
    'points'
  ]);

  const heroCardsFromApi = pickArray<unknown>(executiveData, ['kpiCards', 'heroCards', 'cards']);
  const heroCards = normalizeHeroCards(heroCardsFromApi);

  const agingBucketsFromApi = pickArray<unknown>(agingData, ['buckets', 'agingBuckets']);
  const agingRows = normalizeAgingRows(agingBucketsFromApi);
  const agingSummary = normalizeAgingSummary(agingData);

  const adjustedCashTable = normalizeFlatTrendTable(adjustedCashData, forecastWindow);
  const postedTable = normalizeGroupedTrendTable(reconciledData, forecastWindow);
  const notPostedTable = normalizeGroupedTrendTable(unreconciledData, forecastWindow);

  const topPayersFromApi = pickArray<unknown>(topPayersData, ['rows', 'topPayers', 'data']);
  const topPayers = normalizeTopPayerRows(topPayersFromApi);

  const safeInsights = ensureArray<string>(insights);
  const safeHeroCards = ensureArray<HeroCard>(heroCards).filter((card) => {
    const id = toText(card.id).toLowerCase();
    const title = toText(card.title).toLowerCase();
    return id !== 'dso-days-in-ar' && title !== 'dso — days in a/r' && title !== 'dso - days in a/r';
  });
  const safeAgingRows = ensureArray<AgingRow>(agingRows);
  const safeAdjustedCashRows = ensureArray<SectionRow>(adjustedCashTable.rows);
  const safeAdjustedCashColumns = adjustedCashTable.columns;
  const safePostedRows = ensureArray<SectionRow>(postedTable.rows);
  const safePostedColumns = postedTable.columns;
  const safeNotPostedRows = ensureArray<SectionRow>(notPostedTable.rows);
  const safeNotPostedColumns = notPostedTable.columns;
  // const safeOtherRows = ensureArray<SectionRow>(otherRows);
  const safeTopPayers = ensureArray<PayerRow>(topPayers);

  return (
    <Box sx={{ px: 2, pb: 3, pt: 1 }}>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {screenMeta.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {screenMeta.subtitle} Updated{' '}
            {new Date(String(screenMeta.updatedAt)).toLocaleString()}.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', rowGap: 1, justifyContent: 'flex-end' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Trailing window
            </Typography>
            <ButtonGroup size="small" variant="outlined">
              {(contract.controls?.trailingWindow?.options || ['3m', '6m', '12m', '24m']).map((opt) => (
                <Button
                  key={opt}
                  onClick={() => setTrailingWindow(opt)}
                  variant={trailingWindow === opt ? 'contained' : 'outlined'}
                  sx={{ minWidth: 40 }}
                >
                  {opt}
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Forecast
            </Typography>
            <ButtonGroup size="small" variant="outlined">
              {(contract.controls?.forecastWindow?.options || ['off', '3m', '6m']).map((opt) => (
                <Button
                  key={opt}
                  onClick={() => setForecastWindow(opt)}
                  variant={forecastWindow === opt ? 'contained' : 'outlined'}
                  sx={{ minWidth: 40 }}
                >
                  {opt}
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Compare
            </Typography>
            <ButtonGroup size="small" variant="outlined">
              {(contract.controls?.comparisonMode?.options || ['MoM', 'YoY']).map((opt) => (
                <Button
                  key={opt}
                  onClick={() => setCompareMode(opt)}
                  variant={compareMode === opt ? 'contained' : 'outlined'}
                  sx={{ minWidth: 48 }}
                >
                  {opt}
                </Button>
              ))}
              </ButtonGroup>
          </Box>
        </Stack>
      </Box>

      <Card sx={{ mb: 2, borderLeft: `4px solid ${theme.palette.error.main}` }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.error.main, mb: 1 }}>
            {monthAtGlanceTitle}
          </Typography>
          {safeInsights.map((line, idx) => (
            <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
              {toText(line)}
            </Typography>
          ))}
        </CardContent>
      </Card>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {safeHeroCards.slice(0, 4).map((card, idx) => (
          <Grid key={`${card.id}-${idx}`} size={{ xs: 12, md: 3 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {card.title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.4 }}>
                  {card.value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: deltaColor(
                      card.delta,
                      theme.palette.success.main,
                      theme.palette.error.main,
                      theme.palette.text.secondary
                    ),
                    fontWeight: 700
                  }}
                >
                  {toText(card.delta)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {card.subLabel}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {card.sparkline && card.sparkline.length > 1 ? (
                    <Sparkline
                      values={card.sparkline}
                      color={card.deltaTrend === 'up' ? theme.palette.success.main : card.deltaTrend === 'down' ? theme.palette.error.main : theme.palette.primary.main}
                    />
                  ) : null}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {safeHeroCards[4] && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {safeHeroCards[4].title}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.4 }}>
                  {safeHeroCards[4].value}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: deltaColor(
                      safeHeroCards[4].delta,
                      theme.palette.success.main,
                      theme.palette.error.main,
                      theme.palette.text.secondary
                    ),
                    fontWeight: 700
                  }}
                >
                  {toText(safeHeroCards[4].delta)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {safeHeroCards[4].subLabel}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {safeHeroCards[4].sparkline && safeHeroCards[4].sparkline.length > 1 ? (
                    <Sparkline
                      values={safeHeroCards[4].sparkline}
                      color={safeHeroCards[4].deltaTrend === 'up' ? theme.palette.success.main : safeHeroCards[4].deltaTrend === 'down' ? theme.palette.error.main : theme.palette.primary.main}
                    />
                  ) : null}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Card sx={{ mb: 2, border: `1px solid ${theme.palette.divider}` }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {String(agingData.title || contract.reconciliationAging.title)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.6 }}>
            {String(agingData.description || contract.reconciliationAging.description)}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {agingSummary?.headlineValue || '—'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {agingSummary?.headlineMeta || ''}
          </Typography>

          <Box sx={{ mt: 2, overflowX: 'auto' }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
              <Box component="thead">
                <Box component="tr">
                  {['Age Bucket', 'Deposits', 'Amount', '% of $', 'Distribution'].map((label) => (
                    <Box
                      component="th"
                      key={label}
                      sx={{
                        py: 1,
                        px: 1,
                        textAlign: label === 'Age Bucket' || label === 'Distribution' ? 'left' : 'right',
                        color: theme.palette.text.secondary,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        fontSize: 12
                      }}
                    >
                      {label}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {safeAgingRows.map((row) => {
                  const percent = Number(toText(row.share, '0').replace('%', '').replace(/[^\d.-]/g, '')) || 0;
                  const barColor = row.riskLevel
                    ? agingRiskColor(row.riskLevel, theme)
                    : percent < 20
                      ? theme.palette.success.main
                      : percent < 30
                        ? theme.palette.warning.main
                        : theme.palette.error.main;

                  return (
                    <Box component="tr" key={row.bucket}>
                      <Box component="td" sx={{ py: 1, px: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        {row.bucket}
                      </Box>
                      <Box component="td" sx={{ py: 1, px: 1, textAlign: 'right', borderBottom: `1px solid ${theme.palette.divider}` }}>
                        {row.deposits}
                      </Box>
                      <Box component="td" sx={{ py: 1, px: 1, textAlign: 'right', borderBottom: `1px solid ${theme.palette.divider}` }}>
                        {row.amount}
                      </Box>
                      <Box component="td" sx={{ py: 1, px: 1, textAlign: 'right', borderBottom: `1px solid ${theme.palette.divider}` }}>
                        {toText(row.share)}
                      </Box>
                      <Box component="td" sx={{ py: 1, px: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <Box sx={{ backgroundColor: theme.palette.action.hover, borderRadius: 2, height: 10 }}>
                          <Box sx={{ width: `${Math.max(8, percent)}%`, height: '100%', borderRadius: 2, backgroundColor: barColor }} />
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <SectionTable
        title={String(adjustedCashData.title || contract.adjustedCashDepositTable.title)}
        description={String(adjustedCashData.description || contract.adjustedCashDepositTable.description)}
        columns={safeAdjustedCashColumns}
        rows={safeAdjustedCashRows}
      />
      <SectionTable
        title={String(reconciledData.title || contract.postedToEmrReconciled.title)}
        description={String(reconciledData.description || contract.postedToEmrReconciled.description)}
        columns={safePostedColumns}
        rows={safePostedRows}
      />
      <SectionTable
        title={String(unreconciledData.title || contract.notPostedToEmrUnreconciled.title)}
        description={String(unreconciledData.description || contract.notPostedToEmrUnreconciled.description)}
        columns={safeNotPostedColumns}
        rows={safeNotPostedRows}
      />
      {/* Other Category section intentionally hidden for this project. */}
      {/*
      <SectionTable
        title={contract.otherCategory.title}
        description={contract.otherCategory.description}
        rows={safeOtherRows}
      />
      */}

      <Card sx={{ mb: 2, border: `1px solid ${theme.palette.divider}` }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {contract.topPayerScorecard.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {String(topPayersData.description || contract.topPayerScorecard.description)}
          </Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <Box component="thead">
                <Box component="tr">
                  {['Payer', 'Total $', '% of Total', 'Match Rate', 'Δ MoM', '6-mo Trend'].map((label) => (
                    <Box
                      component="th"
                      key={label}
                      sx={{
                        py: 1,
                        px: 1,
                        textAlign: label === 'Payer' || label === '6-mo Trend' ? 'left' : 'right',
                        color: theme.palette.text.secondary,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        fontSize: 12
                      }}
                    >
                      {label}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {safeTopPayers.map((row, idx) => (
                  <Box component="tr" key={`${row.payer}-${idx}`}>
                    <Box component="td" sx={{ py: 1, px: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                      {row.payer}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1, textAlign: 'right', borderBottom: `1px solid ${theme.palette.divider}` }}>
                      {row.total}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1, textAlign: 'right', borderBottom: `1px solid ${theme.palette.divider}` }}>
                      {row.share}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1, textAlign: 'right', borderBottom: `1px solid ${theme.palette.divider}` }}>
                      {row.matchRate}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        py: 1,
                        px: 1,
                        textAlign: 'right',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        color: deltaColor(
                          row.momDelta,
                          theme.palette.success.main,
                          theme.palette.error.main,
                          theme.palette.text.secondary
                        ),
                        fontWeight: 700
                      }}
                    >
                      {toText(row.momDelta)}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                      {row.sixMonthTrend && row.sixMonthTrend.length > 1 ? (
                        <Sparkline
                          values={row.sixMonthTrend}
                          color={deltaColor(row.momDelta, theme.palette.success.main, theme.palette.error.main, theme.palette.primary.main)}
                        />
                      ) : null}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderLeft: `4px solid ${theme.palette.error.main}` }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
            {contract.readGuide.title}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {ensureArray<string>(contract.readGuide.points).map((point, idx) => (
              <Typography component="li" variant="body2" key={idx} sx={{ mb: 0.5 }}>
                {point}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DepositReconciliationScreen;
