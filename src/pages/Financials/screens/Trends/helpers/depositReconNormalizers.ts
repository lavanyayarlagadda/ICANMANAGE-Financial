import type {
  HeroCard,
  AgingRow,
  AgingSummary,
  PayerRow,
  TrendColumn,
  SectionRow,
  TrendTableData,
  GenericRecord,
} from './depositReconTypes';
import {
  toRecord,
  toArray,
  pickArray,
  toPercent,
  parseTimeSeriesData,
  toDeposits,
  toCurrency,
  formatColumnAmount,
  ensureForecastColumns,
  toText,
  calculateMomFromColumns,
  calculateMomFromSeries,
  toDelta,
  resolveTrend,
} from './depositReconUtils';
import { formatPercentValue } from '@/utils/formatters';

export const normalizeAgingRows = (buckets: unknown): AgingRow[] => {
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
        riskLevel: toText(row.riskLevel || ''),
      };
    })
    .filter((v): v is AgingRow => v !== null);
};

export const normalizeAgingSummary = (source: GenericRecord): AgingSummary | null => {
  const hasTotalAmount = source.totalAmount !== undefined && source.totalAmount !== null;
  const hasTotalDeposits = source.totalDeposits !== undefined && source.totalDeposits !== null;
  const hasPercentOver30 =
    source.percentOver30Days !== undefined && source.percentOver30Days !== null;

  if (!hasTotalAmount && !hasTotalDeposits && !hasPercentOver30) return null;

  return {
    headlineValue: hasTotalAmount ? toCurrency(source.totalAmount) : '—',
    headlineMeta:
      hasTotalDeposits || hasPercentOver30
        ? `across ${hasTotalDeposits ? toDeposits(source.totalDeposits) : '0'} deposits • ${
            hasPercentOver30 ? toPercent(source.percentOver30Days).replace('%', '') : '—'
          }% > 30 days`
        : '',
  };
};

export const normalizeHeroCards = (cards: unknown): HeroCard[] => {
  if (!Array.isArray(cards)) return [];
  return cards
    .map((c, index): HeroCard | null => {
      const card = toRecord(c);
      if (!card) return null;

      const title = toText(card.title || card.label || card.name);
      if (!title) return null;

      const rawDelta =
        card.delta ?? card.percentChange ?? card.percentageChange ?? card.momChangePercent;
      const rawDirection =
        card.deltaTrend ?? card.changeDirection ?? card.direction ?? card.momDirection;

      const delta =
        rawDelta !== undefined && rawDelta !== null && String(rawDelta).trim() !== ''
          ? String(rawDelta).includes('%') ||
            String(rawDelta).includes('▲') ||
            String(rawDelta).includes('▼')
            ? toText(rawDelta)
            : toDelta(rawDelta, rawDirection)
          : '—';

      const sparkline = parseTimeSeriesData(card.sparkline);

      return {
        id: toText(card.id || card.code || card.cardId || card.metricKey || `${title}-${index}`),
        title,
        value: toText(
          card.displayValue ??
            card.value ??
            card.metricValue ??
            card.amount ??
            card.amountValue ??
            '',
        ),
        delta,
        deltaTrend: resolveTrend(rawDirection, delta),
        subLabel: toText(card.subLabel || card.subtitle || card.meta || ''),
        sparkline,
      };
    })
    .filter((v): v is HeroCard => v !== null);
};

export const normalizeTrendColumns = (source: GenericRecord): TrendColumn[] => {
  const cols = pickArray<unknown>(source, ['columns']);
  return cols
    .map((item): TrendColumn | null => {
      const col = toRecord(item);
      if (!col) return null;
      const label = toText(col.label);
      if (!label) return null;
      return {
        label,
        kind: toText(col.kind || 'ACTUAL').toUpperCase(),
      };
    })
    .filter((v): v is TrendColumn => v !== null);
};

export const deriveColumnsFromRows = (rows: unknown, columns: TrendColumn[]): TrendColumn[] => {
  if (columns.length > 0) return columns;
  if (!Array.isArray(rows) || rows.length === 0) return [];

  for (const item of rows) {
    const row = toRecord(item);
    const amountsByColumn = toRecord(row?.amountsByColumn);
    if (amountsByColumn) {
      return Object.keys(amountsByColumn).map((label) => ({
        label,
        kind: 'ACTUAL',
      }));
    }
  }
  return [];
};

export const normalizeTrendRow = (
  r: unknown,
  columns: TrendColumn[],
  rowId: string,
): SectionRow | null => {
  const row = toRecord(r);
  if (!row) return null;

  const amountsByColumn = toRecord(row.amountsByColumn) || {};
  const name = toText(row.label || row.name);
  if (!name) return null;

  const sparkline = parseTimeSeriesData(row.sparkline);

  const rowType = String(row.rowType || '').toUpperCase();
  const amounts =
    columns.length > 0
      ? columns.map((col) => formatColumnAmount(amountsByColumn[col.label]))
      : Object.keys(amountsByColumn).map((key) => formatColumnAmount(amountsByColumn[key]));

  const calculatedMom = calculateMomFromColumns(amountsByColumn, columns);
  const hasApiMom = row.momChangePercent !== undefined && row.momChangePercent !== null;
  const momDelta = hasApiMom
    ? toDelta(row.momChangePercent, row.momDirection)
    : calculatedMom
      ? toDelta(calculatedMom.percent, calculatedMom.direction)
      : '—';

  return {
    id: rowId,
    name,
    momDelta,
    amounts,
    sparkline,
    isSubtotal: rowType === 'SUBTOTAL',
    isTotal: rowType === 'TOTAL' || rowType === 'SUBTOTAL' || Boolean(row.isTotal),
  };
};

export const normalizeTrendRows = (rows: unknown, columns: TrendColumn[]): SectionRow[] => {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((r, index) => normalizeTrendRow(r, columns, `row-${index}`))
    .filter((v): v is SectionRow => v !== null);
};

export const normalizeFlatTrendTable = (
  source: GenericRecord,
  forecastWindow: string,
): TrendTableData => {
  const apiColumns = normalizeTrendColumns(source);
  const rawRows = pickArray<unknown>(source, ['rows', 'data', 'tableRows']);
  const columns = ensureForecastColumns(deriveColumnsFromRows(rawRows, apiColumns), forecastWindow);
  return {
    columns,
    rows: normalizeTrendRows(rawRows, columns),
  };
};

export const normalizeGroupedTrendTable = (
  source: GenericRecord,
  forecastWindow: string,
): TrendTableData => {
  const apiColumns = normalizeTrendColumns(source);
  const groups = toArray<unknown>(source.groups);

  if (groups.length > 0) {
    const sampleRows = groups.flatMap((groupItem) => {
      const group = toRecord(groupItem);
      return group ? toArray<unknown>(group.rows) : [];
    });
    const columns = ensureForecastColumns(
      deriveColumnsFromRows(sampleRows, apiColumns),
      forecastWindow,
    );
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
          isGroupHeader: true,
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
          isTotal: true,
        });
      }
    }

    const totalRow = normalizeTrendRow(source.totalRow, columns, `total-${rowIndex}`);
    if (totalRow) {
      result.push({
        ...totalRow,
        isTotal: true,
      });
    }

    return { columns, rows: result };
  }

  return normalizeFlatTrendTable(source, forecastWindow);
};

export const normalizeTopPayerRows = (rows: unknown): PayerRow[] => {
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

      const percent =
        typeof row.percentOfTotal === 'number' ? row.percentOfTotal : Number(row.percentOfTotal);
      const share = Number.isFinite(percent)
        ? `${formatPercentValue(percent)}%`
        : toText(row.share);

      const matchRateNum =
        typeof row.matchRate === 'number' ? row.matchRate : Number(row.matchRate);
      const matchRate = Number.isFinite(matchRateNum)
        ? `${formatPercentValue(matchRateNum)}%`
        : toText(row.matchRate);

      const sixMonthTrend = parseTimeSeriesData(row.sixMonthTrend);

      const calculatedMom = sixMonthTrend ? calculateMomFromSeries(sixMonthTrend) : null;
      const hasApiMom = row.momChangePercent !== undefined && row.momChangePercent !== null;
      const momDelta = hasApiMom
        ? toDelta(row.momChangePercent, row.momDirection)
        : calculatedMom
          ? toDelta(calculatedMom.percent, calculatedMom.direction)
          : toDelta(row.momDelta, row.momDirection);

      return {
        payer,
        total,
        share,
        matchRate,
        momDelta,
        sixMonthTrend,
      };
    })
    .filter((v): v is PayerRow => v !== null);
};
