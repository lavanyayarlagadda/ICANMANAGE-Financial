import { formatCurrency } from '@/utils/formatters';
import { ForecastDashboardResponse } from '@/interfaces/api';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';

export type ForecastDashboardRow = ForecastDashboardResponse['data'][0];
type FieldKey = keyof Omit<ForecastDashboardRow, 'team'>;

/** Columns whose values are shared across team rows and rendered as a merged cell. */
export const SHARED_MERGE_FIELDS = new Set<FieldKey>([
  'reconciledCheckCountPct',
  'unreconciledCheckCountPct',
  'unreconciledCheckCount',
  'reconciledAmountPct',
  'unreconciledAmountPct',
  'totalAmountNotPosted',
]);

export const isOverallTeam = (team: unknown): boolean => {
  const normalized = String(team ?? '').trim().toUpperCase();
  return normalized === 'OVERALL' || normalized === 'TOTAL';
};

export const isNullLike = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  const normalized = String(value).trim().toLowerCase();
  return normalized === '' || normalized === 'null' || normalized === 'null%';
};

export const isDisplayNullLike = (value: unknown): boolean => {
  if (isNullLike(value)) return true;
  const normalized = String(value).trim().toLowerCase();
  return normalized === 'n/a' || normalized === '—' || normalized === '-';
};

const parseNumeric = (value: unknown): number | null => {
  if (isDisplayNullLike(value)) return null;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  const raw = String(value).trim().replace(/%$/, '');
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

export const formatPercentCell = (value: unknown): string => {
  const numeric = parseNumeric(value);
  if (numeric === null) return '0.00%';
  return `${numeric.toFixed(2)}%`;
};

export const countFieldFormat = (value: unknown): string => {
  const numeric = parseNumeric(value);
  if (numeric === null) return '0';
  return String(numeric);
};

export const currencyFieldFormat = (value: unknown): string => {
  const numeric = parseNumeric(value);
  if (numeric === null) return formatCurrency(0);
  return formatCurrency(numeric);
};

export const avgDaysFieldFormat = (value: unknown): string => {
  const numeric = parseNumeric(value);
  if (numeric === null) return '0';
  return String(numeric);
};

const resolveFieldValue = (
  row: ForecastDashboardRow,
  overallRow: ForecastDashboardRow | null,
  field: FieldKey,
  format: (value: unknown) => string,
): string => {
  const isSharedField = SHARED_MERGE_FIELDS.has(field);
  let raw = row[field];

  if (!isOverallTeam(row.team)) {
    if (isSharedField && isDisplayNullLike(raw) && overallRow) {
      raw = overallRow[field];
    } else if (isNullLike(raw) && overallRow) {
      raw = overallRow[field];
    }
  }

  if (isDisplayNullLike(raw)) {
    return format(0);
  }

  return format(raw);
};

export const createForecastCellValueGetter = (
  field: FieldKey,
  overallRow: ForecastDashboardRow | null,
  format: (value: unknown) => string,
) => (row: ForecastDashboardRow) => resolveFieldValue(row, overallRow, field, format);

const getTeamRowIndices = (rows: ForecastDashboardRow[]): number[] =>
  rows
    .map((row, index) => (!isOverallTeam(row.team) ? index : null))
    .filter((index): index is number => index !== null);

/** Merge shared-metric cells vertically across all team rows (excluding the total row). */
export const createSharedColumnCellProps = <T extends ForecastDashboardRow>(): NonNullable<
  DataColumn<T>['getCellProps']
> => (row, rowIndex, rows) => {
  if (isOverallTeam(row.team)) {
    return {};
  }

  const teamRowIndices = getTeamRowIndices(rows);
  if (!teamRowIndices.includes(rowIndex)) {
    return {};
  }

  if (rowIndex !== teamRowIndices[0]) {
    return { skip: true };
  }

  const rowSpan = teamRowIndices.length;
  return rowSpan > 1 ? { rowSpan } : {};
};

export const percentFieldFormat = formatPercentCell;
