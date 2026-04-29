import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getDescriptionsForTable, TableDescription, TableDescriptions } from '@/services/descriptionService';

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface DataColumn<T> {
  id: string;
  label: React.ReactNode;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  render: (row: T) => React.ReactNode;
  hideOnMobile?: boolean;
  primary?: boolean;
  accessor?: (row: T) => string | number | null;
  disableSort?: boolean;
  filterOptions?: (string | FilterOption)[];
  isFilterLoading?: boolean;
  filterError?: string | boolean;
  exportLabel?: string;
}

export type AccessorColumn<T> = DataColumn<T> & { accessor: (row: T) => string | number };
export type FilterableColumn<T> = DataColumn<T> & { filterOptions: (string | FilterOption)[] };

export type SortDirection = 'asc' | 'desc';

interface UseDataTableProps<T> {
  columns: DataColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  rowsPerPageOptions: number[];
  dictionaryId?: string;
  serverSide?: boolean;
  totalElements?: number;
  page?: number;
  rowsPerPage?: number;
  sortCol?: string;
  sortDir?: SortDirection;
  selectedKeys?: Set<string>;
  onSelectionChange?: (selectedKeys: Set<string>) => void;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  onSortChange?: (colId: string, direction: SortDirection) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  onSearchChange?: (query: string) => void;
}

export function useDataTable<T>({
  columns,
  data,
  rowsPerPageOptions,
  dictionaryId,
  serverSide,
  totalElements,
  selectedKeys: propsSelectedKeys,
  onSelectionChange,
  onPageChange: _onPageChange,
  onRowsPerPageChange: _onRowsPerPageChange,
  onSortChange,
  onFilterChange,
  onSearchChange,
  ...props // for any other props if needed, but none seem to be missing from the interface
}: UseDataTableProps<T>) {
  const [internalPage, setInternalPage] = useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [internalSortCol, setInternalSortCol] = useState<string | null>(null);
  const [internalSortDir, setInternalSortDir] = useState<SortDirection>('asc');
  const [internalSearch, setInternalSearch] = useState('');
  const [internalColumnFilters, setInternalColumnFilters] = useState<Record<string, string>>({});
  const [internalSelected, setInternalSelected] = useState<Set<string>>(new Set());

  const page = props.page !== undefined ? props.page : internalPage;
  const rowsPerPage = props.rowsPerPage !== undefined ? props.rowsPerPage : internalRowsPerPage;
  const sortCol = props.sortCol !== undefined ? props.sortCol : internalSortCol;
  const sortDir = (props.sortDir !== undefined ? props.sortDir : internalSortDir) as SortDirection;
  const selectedKeys = propsSelectedKeys ?? internalSelected;

  const [descriptions, setDescriptions] = useState<TableDescriptions | null>(null);
  const [dictionaryOpen, setDictionaryOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<TableDescription | null>(null);

  useEffect(() => {
    if (dictionaryId) {
      getDescriptionsForTable(dictionaryId).then(setDescriptions);
    }
  }, [dictionaryId]);

  const handleHeaderClick = useCallback((colId: string) => {
    if (descriptions?.[colId]) {
      setSelectedField(descriptions[colId]);
      setDictionaryOpen(true);
    }
  }, [descriptions]);

  const handleSelectionChange = useCallback((newSelection: Set<string>) => {
    setInternalSelected(newSelection);
    onSelectionChange?.(newSelection);
  }, [onSelectionChange]);

  const handleSort = useCallback((colId: string) => {
    let newDir: SortDirection = 'asc';
    if (sortCol === colId) {
      newDir = sortDir === 'asc' ? 'desc' : 'asc';
    }

    if (onSortChange) {
      onSortChange(colId, newDir);
    } else {
      setInternalSortCol(colId);
      setInternalSortDir(newDir);
      setInternalPage(0);
    }
  }, [sortCol, sortDir, onSortChange]);

  const filteredData = useMemo(() => {
    if (serverSide) return data;
    let result = data;
    if (internalSearch.trim()) {
      const q = internalSearch.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => col.accessor && String(col.accessor(row)).toLowerCase().includes(q))
      );
    }
    Object.entries(internalColumnFilters).forEach(([colId, filterVal]) => {
      if (!filterVal) return;
      const col = columns.find((c) => c.id === colId);
      if (col?.accessor) {
        const accessor = col.accessor;
        result = result.filter((row) => String(accessor(row)) === filterVal);
      }
    });
    return result;
  }, [data, internalSearch, internalColumnFilters, columns, serverSide]);

  const sortedData = useMemo(() => {
    if (serverSide || !sortCol) return filteredData;
    const col = columns.find((c) => c.id === sortCol);
    if (!col?.accessor) return filteredData;
    const accessor = col.accessor;
    return [...filteredData].sort((a, b) => {
      const aVal = accessor(a);
      const bVal = accessor(b);
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortCol, sortDir, columns, serverSide]);

  const totalCount = serverSide ? (totalElements ?? data.length) : filteredData.length;

  const clearAllFilters = useCallback(() => {
    setInternalSearch('');
    setInternalColumnFilters({});
    setInternalSortCol(null);
    setInternalPage(0);
    onSearchChange?.('');
    onFilterChange?.({});
    if (onSortChange) onSortChange('', 'asc');
  }, [onSearchChange, onFilterChange, onSortChange]);

  return {
    page,
    rowsPerPage,
    sortCol,
    sortDir,
    search: internalSearch,
    setSearch: setInternalSearch,
    columnFilters: internalColumnFilters,
    setColumnFilters: setInternalColumnFilters,
    selectedKeys,
    descriptions,
    dictionaryOpen,
    setDictionaryOpen,
    selectedField,
    handleHeaderClick,
    handleSelectionChange,
    handleSort,
    sortedData,
    totalCount,
    setInternalPage,
    setInternalRowsPerPage,
    clearAllFilters,
  };
}
