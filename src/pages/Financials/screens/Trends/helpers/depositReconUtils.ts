import { parse } from 'date-fns';
import { type Theme } from '@mui/material';
import { formatPercentValue } from '@/utils/formatters';
import type { TrendColumn, GenericRecord } from './depositReconTypes';

export const toRecord = (value: unknown): GenericRecord | null =>
  value && typeof value === 'object' && !Array.isArray(value) ? (value as GenericRecord) : null;

export const unwrapResponse = (value: unknown): GenericRecord => {
  const record = toRecord(value);
  if (!record) return {};
  const data = toRecord(record.data);
  if (data) return data;
  const content = toRecord(record.content);
  if (content) return content;
  return record;
};

export const toArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);
export const ensureArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

export const pickRecord = (source: GenericRecord, keys: string[]): GenericRecord => {
  for (const key of keys) {
    const value = toRecord(source[key]);
    if (value) return value;
  }
  return {};
};

export const pickArray = <T>(source: GenericRecord, keys: string[]): T[] => {
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

export const toPercent = (value: unknown): string => {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return '—';
  return `${formatPercentValue(num)}%`;
};

export const parseTimeSeriesData = (data: unknown): number[] | undefined => {
  if (!Array.isArray(data)) return undefined;

  const parsed = data
    .map((v) => {
      if (typeof v === 'number') return v;
      if (v && typeof v === 'object') {
        const rec = v as Record<string, unknown>;
        return Number(rec.totalAmount ?? rec.amount ?? rec.value ?? rec.total);
      }
      return Number(v);
    })
    .filter((v) => Number.isFinite(v));

  return parsed.length > 1 ? parsed : undefined;
};

export const toDeposits = (value: unknown): string => {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

export const toCurrency = (value: unknown): string => {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatColumnAmount = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return toCurrency(0);
  return toCurrency(value);
};

export const getForecastColumnCount = (forecastWindow: string): number => {
  if (forecastWindow === 'off') return 0;
  return forecastWindow === '6m' ? 3 : forecastWindow === '3m' ? 3 : 0;
};

export const parseMonthColumnLabel = (label: string): Date | null => {
  const match = label.match(/^([A-Za-z]{3})\s+'(\d{2})$/);
  if (!match) return null;
  const parsed = parse(`${match[1]} 1, 20${match[2]}`, 'MMM d, yyyy', new Date());
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const isPartialMonthColumn = (label: string): boolean => {
  const parsed = parseMonthColumnLabel(label);
  if (!parsed) return false;
  const now = new Date();
  return parsed.getMonth() === now.getMonth() && parsed.getFullYear() === now.getFullYear();
};

export const getDeltaLabel = (columns: TrendColumn[], compareMode?: string): string => {
  const actualCols = columns.filter((c) => c.kind === 'ACTUAL');

  if (compareMode?.toUpperCase() === 'YOY') {
    if (actualCols.length >= 1) {
      const presentFull = actualCols[actualCols.length - 1].label; // e.g., "May '26"
      const match = presentFull.match(/^([A-Za-z]+)\s+'(\d{2})$/);
      if (match) {
        const month = match[1];
        const year = parseInt(match[2], 10);
        const prevYear = year - 1;
        return `Δ YoY (${month} '${year} vs ${month} '${prevYear})`;
      }
    }
    return 'Δ YoY';
  }

  if (actualCols.length >= 2) {
    const present = actualCols[actualCols.length - 1].label.split(' ')[0];
    const previous = actualCols[actualCols.length - 2].label.split(' ')[0];
    return `Δ MoM (${present} vs ${previous})`;
  }
  return 'Δ MoM';
};

export const ensureForecastColumns = (
  columns: TrendColumn[],
  forecastWindow: string,
): TrendColumn[] => {
  const forecastCount = getForecastColumnCount(forecastWindow);
  const actualColumns = columns.filter((col) => col.kind !== 'FORECAST');

  if (forecastCount === 0) {
    return actualColumns.length > 0 ? actualColumns : columns;
  }

  const existingForecast = columns.filter((col) => col.kind === 'FORECAST');

  // We only show forecast columns that actually exist in the data from the API
  return [...actualColumns, ...existingForecast.slice(0, forecastCount)];
};

export const toText = (value: unknown, fallback = '') => String(value ?? fallback);

export const agingRiskColor = (riskLevel: string | undefined, theme: Theme) => {
  switch (String(riskLevel || '').toUpperCase()) {
    case 'GREEN':
      return theme.palette.success.main;
    case 'ORANGE':
      return theme.palette.warning.main;
    case 'RED':
      return theme.palette.error.main;
    default:
      return theme.palette.primary.main;
  }
};

export const toNumericAmount = (value: unknown): number | null => {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : null;
};

export const momDirectionFromPercent = (percent: number): 'UP' | 'DOWN' | 'NONE' => {
  if (percent > 0) return 'UP';
  if (percent < 0) return 'DOWN';
  return 'NONE';
};

export const toDelta = (percent: unknown, direction: unknown): string => {
  const num = typeof percent === 'number' ? percent : Number(percent);
  if (!Number.isFinite(num)) return '—';

  const dir = String(direction || '').toUpperCase();
  if (dir === 'NONE' || num === 0) return '0%';

  const arrow = dir === 'UP' ? '▲' : dir === 'DOWN' ? '▼' : num > 0 ? '▲' : '▼';
  return `${arrow} ${formatPercentValue(Math.abs(num))}%`;
};

export const resolveTrend = (direction: unknown, delta: unknown): 'up' | 'down' | 'neutral' => {
  const dir = String(direction || '').toLowerCase();
  if (dir === 'up') return 'up';
  if (dir === 'down') return 'down';

  const deltaNum =
    typeof delta === 'number' ? delta : Number(String(delta).replace(/[^\d.-]/g, ''));
  if (Number.isFinite(deltaNum)) return deltaNum > 0 ? 'up' : deltaNum < 0 ? 'down' : 'neutral';
  const deltaText = String(delta || '');
  if (deltaText.includes('▲')) return 'up';
  if (deltaText.includes('▼')) return 'down';
  return 'neutral';
};

export const deltaColor = (
  delta: string | number,
  positive: string,
  negative: string,
  neutral: string,
) => {
  const deltaNum =
    typeof delta === 'number' ? delta : Number(String(delta).replace(/[^\d.-]/g, ''));
  const deltaText = toText(delta);

  // Arrow markers are authoritative when present.
  if (deltaText.includes('▲')) return positive;
  if (deltaText.includes('▼')) return negative;

  // Fallback to numeric sign for signed values.
  if (!Number.isNaN(deltaNum) && deltaNum > 0) return positive;
  if (!Number.isNaN(deltaNum) && deltaNum < 0) return negative;
  return neutral;
};
