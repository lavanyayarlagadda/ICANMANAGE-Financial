import { addMonths, format, parse } from "date-fns";
import { type Theme } from "@mui/material";
import { formatPercentValue } from "@/utils/formatters";

export type HeroCard = {
  id: string;
  title: string;
  value: string;
  delta: string | number;
  deltaTrend: "up" | "down" | "neutral";
  subLabel: string;
  sparkline?: number[];
};

export type AgingRow = {
  bucket: string;
  deposits: string;
  amount: string;
  share: string | number;
  riskLevel?: string;
};

export type AgingSummary = {
  headlineValue: string;
  headlineMeta: string;
};

export type PayerRow = {
  payer: string;
  total: string;
  share: string;
  matchRate: string;
  momDelta: string | number;
  sixMonthTrend?: number[];
};

export type TrendColumn = {
  label: string;
  kind: string;
};

export type SectionRow = {
  id: string;
  name: string;
  momDelta: string | number;
  amounts: string[];
  sparkline?: number[];
  isGroupHeader?: boolean;
  isSubtotal?: boolean;
  isTotal?: boolean;
};

export type TrendTableData = {
  columns: TrendColumn[];
  rows: SectionRow[];
};

export type GenericRecord = Record<string, unknown>;

export const toRecord = (value: unknown): GenericRecord | null =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as GenericRecord)
    : null;

export const unwrapResponse = (value: unknown): GenericRecord => {
  const record = toRecord(value);
  if (!record) return {};
  const data = toRecord(record.data);
  if (data) return data;
  const content = toRecord(record.content);
  if (content) return content;
  return record;
};

export const toArray = <T>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];
export const ensureArray = <T>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : [];

export const pickRecord = (
  source: GenericRecord,
  keys: string[],
): GenericRecord => {
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
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return "—";
  return `${formatPercentValue(num)}%`;
};

export const toDeposits = (value: unknown): string => {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return "0";
  return new Intl.NumberFormat("en-US").format(num);
};

export const toCurrency = (value: unknown): string => {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatColumnAmount = (value: unknown): string => {
  if (value === null || value === undefined || value === "")
    return toCurrency(0);
  return toCurrency(value);
};

export const getForecastColumnCount = (forecastWindow: string): number => {
  if (forecastWindow === "off") return 0;
  return forecastWindow === "6m" ? 3 : forecastWindow === "3m" ? 3 : 0;
};

export const parseMonthColumnLabel = (label: string): Date | null => {
  const match = label.match(/^([A-Za-z]{3})\s+'(\d{2})$/);
  if (!match) return null;
  const parsed = parse(
    `${match[1]} 1, 20${match[2]}`,
    "MMM d, yyyy",
    new Date(),
  );
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const ensureForecastColumns = (
  columns: TrendColumn[],
  forecastWindow: string,
): TrendColumn[] => {
  const forecastCount = getForecastColumnCount(forecastWindow);
  const actualColumns = columns.filter((col) => col.kind !== "FORECAST");

  if (forecastCount === 0) {
    return actualColumns.length > 0 ? actualColumns : columns;
  }

  const existingForecast = columns.filter((col) => col.kind === "FORECAST");
  
  // We only show forecast columns that actually exist in the data from the API
  return [...actualColumns, ...existingForecast.slice(0, forecastCount)];
};

export const toText = (value: unknown, fallback = "") =>
  String(value ?? fallback);

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
        riskLevel: toText(row.riskLevel || ""),
      };
    })
    .filter((v): v is AgingRow => v !== null);
};

export const normalizeAgingSummary = (
  source: GenericRecord,
): AgingSummary | null => {
  const hasTotalAmount =
    source.totalAmount !== undefined && source.totalAmount !== null;
  const hasTotalDeposits =
    source.totalDeposits !== undefined && source.totalDeposits !== null;
  const hasPercentOver30 =
    source.percentOver30Days !== undefined && source.percentOver30Days !== null;

  if (!hasTotalAmount && !hasTotalDeposits && !hasPercentOver30) return null;

  return {
    headlineValue: hasTotalAmount ? toCurrency(source.totalAmount) : "—",
    headlineMeta:
      hasTotalDeposits || hasPercentOver30
        ? `across ${hasTotalDeposits ? toDeposits(source.totalDeposits) : "0"} deposits • ${
            hasPercentOver30
              ? toPercent(source.percentOver30Days).replace("%", "")
              : "—"
          }% > 30 days`
        : "",
  };
};

export const agingRiskColor = (riskLevel: string | undefined, theme: Theme) => {
  switch (String(riskLevel || "").toUpperCase()) {
    case "GREEN":
      return theme.palette.success.main;
    case "ORANGE":
    case "YELLOW":
      return theme.palette.warning.main;
    case "RED":
      return theme.palette.error.main;
    default:
      return theme.palette.primary.main;
  }
};

export const toNumericAmount = (value: unknown): number | null => {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : null;
};

export const calculateMomChangePercent = (
  present: number,
  previous: number,
): number | null => {
  if (!Number.isFinite(present) || !Number.isFinite(previous) || previous === 0)
    return null;
  return ((present - previous) / previous) * 100;
};

export const momDirectionFromPercent = (
  percent: number,
): "UP" | "DOWN" | "NONE" => {
  if (percent > 0) return "UP";
  if (percent < 0) return "DOWN";
  return "NONE";
};

export const calculateMomFromColumns = (
  amountsByColumn: GenericRecord,
  columns: TrendColumn[],
): { percent: number; direction: "UP" | "DOWN" | "NONE" } | null => {
  const actualColumns = columns.filter((col) => col.kind !== "FORECAST");
  const targetColumns = actualColumns.length >= 2 ? actualColumns : columns;
  if (targetColumns.length < 2) return null;

  const present = toNumericAmount(
    amountsByColumn[targetColumns[targetColumns.length - 1].label],
  );
  const previous = toNumericAmount(
    amountsByColumn[targetColumns[targetColumns.length - 2].label],
  );
  const percent =
    present !== null && previous !== null
      ? calculateMomChangePercent(present, previous)
      : null;
  if (percent === null) return null;

  return { percent, direction: momDirectionFromPercent(percent) };
};

export const calculateMomFromSeries = (
  values: number[],
): { percent: number; direction: "UP" | "DOWN" | "NONE" } | null => {
  if (values.length < 2) return null;
  const present = values[values.length - 1];
  const previous = values[values.length - 2];
  const percent = calculateMomChangePercent(present, previous);
  if (percent === null) return null;
  return { percent, direction: momDirectionFromPercent(percent) };
};

export const toDelta = (percent: unknown, direction: unknown): string => {
  const num = typeof percent === "number" ? percent : Number(percent);
  if (!Number.isFinite(num)) return "—";

  const dir = String(direction || "").toUpperCase();
  if (dir === "NONE" || num === 0) return "0%";

  const arrow = dir === "UP" ? "▲" : dir === "DOWN" ? "▼" : num > 0 ? "▲" : "▼";
  return `${arrow} ${formatPercentValue(Math.abs(num))}%`;
};

export const resolveTrend = (
  direction: unknown,
  delta: unknown,
): "up" | "down" | "neutral" => {
  const dir = String(direction || "").toLowerCase();
  if (dir === "up") return "up";
  if (dir === "down") return "down";

  const deltaNum =
    typeof delta === "number"
      ? delta
      : Number(String(delta).replace(/[^\d.-]/g, ""));
  if (Number.isFinite(deltaNum))
    return deltaNum > 0 ? "up" : deltaNum < 0 ? "down" : "neutral";
  const deltaText = String(delta || "");
  if (deltaText.includes("▲")) return "up";
  if (deltaText.includes("▼")) return "down";
  return "neutral";
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
        card.delta ??
        card.percentChange ??
        card.percentageChange ??
        card.momChangePercent;
      const rawDirection =
        card.deltaTrend ??
        card.changeDirection ??
        card.direction ??
        card.momDirection;

      const delta =
        rawDelta !== undefined &&
        rawDelta !== null &&
        String(rawDelta).trim() !== ""
          ? String(rawDelta).includes("%") ||
            String(rawDelta).includes("▲") ||
            String(rawDelta).includes("▼")
            ? toText(rawDelta)
            : toDelta(rawDelta, rawDirection)
          : "—";

      const sparkline = Array.isArray(card.sparkline)
        ? card.sparkline
            .map((v) => {
              if (typeof v === "number") return v;
              if (v && typeof v === "object") {
                const rec = v as Record<string, unknown>;
                return Number(rec.totalAmount ?? rec.amount ?? rec.value ?? rec.total);
              }
              return Number(v);
            })
            .filter((v) => Number.isFinite(v))
        : undefined;

      return {
        id: toText(
          card.id ||
            card.code ||
            card.cardId ||
            card.metricKey ||
            `${title}-${index}`,
        ),
        title,
        value: toText(
          card.displayValue ??
            card.value ??
            card.metricValue ??
            card.amount ??
            card.amountValue ??
            "",
        ),
        delta,
        deltaTrend: resolveTrend(rawDirection, delta),
        subLabel: toText(card.subLabel || card.subtitle || card.meta || ""),
        sparkline: sparkline && sparkline.length > 1 ? sparkline : undefined,
      };
    })
    .filter((v): v is HeroCard => v !== null);
};

export const normalizeTrendColumns = (source: GenericRecord): TrendColumn[] => {
  const cols = pickArray<unknown>(source, ["columns"]);
  return cols
    .map((item): TrendColumn | null => {
      const col = toRecord(item);
      if (!col) return null;
      const label = toText(col.label);
      if (!label) return null;
      return {
        label,
        kind: toText(col.kind || "ACTUAL").toUpperCase(),
      };
    })
    .filter((v): v is TrendColumn => v !== null);
};

export const deriveColumnsFromRows = (
  rows: unknown,
  columns: TrendColumn[],
): TrendColumn[] => {
  if (columns.length > 0) return columns;
  if (!Array.isArray(rows) || rows.length === 0) return [];

  for (const item of rows) {
    const row = toRecord(item);
    const amountsByColumn = toRecord(row?.amountsByColumn);
    if (amountsByColumn) {
      return Object.keys(amountsByColumn).map((label) => ({
        label,
        kind: "ACTUAL",
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

  const sparkline = Array.isArray(row.sparkline)
    ? row.sparkline
        .map((v) => {
          if (typeof v === "number") return v;
          if (v && typeof v === "object") {
            const rec = v as Record<string, unknown>;
            return Number(rec.totalAmount ?? rec.amount ?? rec.value ?? rec.total);
          }
          return Number(v);
        })
        .filter((v) => Number.isFinite(v))
    : undefined;

  const rowType = String(row.rowType || "").toUpperCase();
  const amounts =
    columns.length > 0
      ? columns.map((col) => formatColumnAmount(amountsByColumn[col.label]))
      : Object.keys(amountsByColumn).map((key) =>
          formatColumnAmount(amountsByColumn[key]),
        );

  const calculatedMom = calculateMomFromColumns(amountsByColumn, columns);
  const hasApiMom =
    row.momChangePercent !== undefined && row.momChangePercent !== null;
  const momDelta = hasApiMom
    ? toDelta(row.momChangePercent, row.momDirection)
    : calculatedMom
      ? toDelta(calculatedMom.percent, calculatedMom.direction)
      : "—";

  return {
    id: rowId,
    name,
    momDelta,
    amounts,
    sparkline: sparkline && sparkline.length > 0 ? sparkline : undefined,
    isSubtotal: rowType === "SUBTOTAL",
    isTotal:
      rowType === "TOTAL" || rowType === "SUBTOTAL" || Boolean(row.isTotal),
  };
};

export const normalizeTrendRows = (
  rows: unknown,
  columns: TrendColumn[],
): SectionRow[] => {
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
  const rawRows = pickArray<unknown>(source, ["rows", "data", "tableRows"]);
  const columns = ensureForecastColumns(
    deriveColumnsFromRows(rawRows, apiColumns),
    forecastWindow,
  );
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
          momDelta: "",
          amounts: columns.map(() => ""),
          isGroupHeader: true,
        });
      }

      for (const groupRow of toArray<unknown>(group.rows)) {
        const normalized = normalizeTrendRow(
          groupRow,
          columns,
          `row-${rowIndex++}`,
        );
        if (normalized) result.push(normalized);
      }

      const subtotal = normalizeTrendRow(
        group.subtotal,
        columns,
        `subtotal-${rowIndex++}`,
      );
      if (subtotal) {
        result.push({
          ...subtotal,
          isSubtotal: true,
          isTotal: true,
        });
      }
    }

    const totalRow = normalizeTrendRow(
      source.totalRow,
      columns,
      `total-${rowIndex}`,
    );
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
        typeof row.percentOfTotal === "number"
          ? row.percentOfTotal
          : Number(row.percentOfTotal);
      const share = Number.isFinite(percent)
        ? `${formatPercentValue(percent)}%`
        : toText(row.share);

      const matchRateNum =
        typeof row.matchRate === "number"
          ? row.matchRate
          : Number(row.matchRate);
      const matchRate = Number.isFinite(matchRateNum)
        ? `${formatPercentValue(matchRateNum)}%`
        : toText(row.matchRate);

      const sixMonthTrend = Array.isArray(row.sixMonthTrend)
        ? row.sixMonthTrend
            .map((v) => {
              if (typeof v === "number") return v;
              if (v && typeof v === "object") {
                const rec = v as Record<string, unknown>;
                return Number(rec.totalAmount ?? rec.amount ?? rec.value ?? rec.total);
              }
              return Number(v);
            })
            .filter((v) => Number.isFinite(v))
        : undefined;

      const calculatedMom = sixMonthTrend
        ? calculateMomFromSeries(sixMonthTrend)
        : null;
      const hasApiMom =
        row.momChangePercent !== undefined && row.momChangePercent !== null;
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
        sixMonthTrend:
          sixMonthTrend && sixMonthTrend.length > 0 ? sixMonthTrend : undefined,
      };
    })
    .filter((v): v is PayerRow => v !== null);
};

export const deltaColor = (
  delta: string | number,
  positive: string,
  negative: string,
  neutral: string,
) => {
  const deltaNum =
    typeof delta === "number"
      ? delta
      : Number(String(delta).replace(/[^\d.-]/g, ""));
  const deltaText = toText(delta);

  // Arrow markers are authoritative when present.
  if (deltaText.includes("▲")) return positive;
  if (deltaText.includes("▼")) return negative;

  // Fallback to numeric sign for signed values.
  if (!Number.isNaN(deltaNum) && deltaNum > 0) return positive;
  if (!Number.isNaN(deltaNum) && deltaNum < 0) return negative;
  return neutral;
};
