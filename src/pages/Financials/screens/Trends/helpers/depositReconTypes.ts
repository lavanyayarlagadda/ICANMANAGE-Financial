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
