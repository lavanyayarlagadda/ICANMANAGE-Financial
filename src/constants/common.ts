export const EXPORT_FORMATS = {
  PDF: 'pdf' as const,
  XLSX: 'xlsx' as const,
};

export const SORT_ORDER = {
  ASC: 'asc' as const,
  DESC: 'desc' as const,
};

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200];


export const DATE_FORMATS = {
  DISPLAY: 'MM/dd/yyyy',
  API: 'yyyy-MM-dd',
};
