import React, { useMemo, useState } from 'react';
import {
  TablePagination,
  useTheme,
  useMediaQuery,
  Box,
} from '@mui/material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import DictionaryDrawer from '../DictionaryDrawer/DictionaryDrawer';
import { useDataTable, DataColumn, SortDirection, AccessorColumn, FilterableColumn } from './DataTable.hook';
import { MainContainer } from './DataTable.styles';
import { formatCurrency } from '@/utils/formatters';
import { DataTableToolbar } from './DataTableToolbar';
import { DataTableDesktop } from './DataTableDesktop';
import { DataTableMobile } from './DataTableMobile';

interface DataTableProps<T> {
  columns: DataColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  paginated?: boolean;
  rowsPerPageOptions?: number[];
  onRowClick?: (row: T) => void;
  expandedContent?: (row: T) => React.ReactNode;
  expandedRows?: Set<string>;
  searchable?: boolean;
  exportTitle?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedKeys: Set<string>) => void;
  selectedKeys?: Set<string>;
  customToolbarContent?: React.ReactNode;
  dictionaryId?: string;
  serverSide?: boolean;
  totalElements?: number;
  page?: number;
  rowsPerPage?: number;
  sortCol?: string;
  sortDir?: SortDirection;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  onSortChange?: (colId: string, direction: SortDirection) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  onSearchChange?: (query: string) => void;
  download?: boolean;
  onDownload?: () => void;
  disableHover?: boolean;
  getRowStyle?: (row: T) => React.CSSProperties;
  dense?: boolean;
}

function DataTable<T>({
  columns,
  data,
  rowKey,
  paginated = true,
  download = true,
  rowsPerPageOptions = [10, 25, 50, 100, 200],
  onRowClick,
  expandedContent,
  expandedRows,
  searchable = false,
  exportTitle = 'Data Export',
  dictionaryId,
  disableHover = false,
  getRowStyle,
  dense = false,
  ...props
}: DataTableProps<T>) {
  const hasAccessor = (column: DataColumn<T>): column is AccessorColumn<T> => !!column.accessor;
  const hasFilterOptions = (column: DataColumn<T>): column is FilterableColumn<T> =>
    !!column.filterOptions && Array.isArray(column.filterOptions);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showFilters, setShowFilters] = useState(false);

  const {
    page,
    rowsPerPage,
    sortCol,
    sortDir,
    search,
    setSearch,
    columnFilters,
    setColumnFilters,
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
  } = useDataTable({
    columns,
    data,
    rowKey,
    rowsPerPageOptions,
    dictionaryId,
    serverSide: props.serverSide,
    totalElements: props.totalElements,
    ...props,
  });

  const isSortable = (col: DataColumn<T>) => !!(col.accessor && !col.disableSort);

  const filterableColumns = useMemo(() =>
    columns.filter((col): col is FilterableColumn<T> =>
      Array.isArray(col.filterOptions) && col.filterOptions.length > 0
    ), [columns]);
  const exportableColumns = columns.filter((c): c is AccessorColumn<T> => c.id !== 'actions' && hasAccessor(c));
  const paginatedData = paginated && !props.serverSide
    ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedData;
  const activeFilterCount = Object.values(columnFilters).filter(Boolean).length + (search ? 1 : 0);

  const handleSelectAll = (checked: boolean) => {
    const newSelection = new Set(selectedKeys);
    paginatedData.forEach((row) => {
      const key = rowKey(row);
      if (checked) newSelection.add(key);
      else newSelection.delete(key);
    });
    handleSelectionChange(newSelection);
  };

  const handleSelectOne = (key: string, checked: boolean) => {
    const newSelection = new Set(selectedKeys);
    if (checked) newSelection.add(key);
    else newSelection.delete(key);
    handleSelectionChange(newSelection);
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every((row) => selectedKeys.has(rowKey(row)));
  const isIndeterminate = paginatedData.some((row) => selectedKeys.has(rowKey(row))) && !isAllSelected;

  const handleCSVExport = () => {
    const headers = exportableColumns.map((c) => c.exportLabel || (typeof c.label === 'string' ? c.label : String(c.id)));
    const rows = sortedData.map((row) => exportableColumns.map((col) => {
      const val = col.accessor(row);
      // If it's a currency column or contains amount, format it
      if (col.id.toLowerCase().includes('amount') || col.id.toLowerCase().includes('balance') || col.id.toLowerCase().includes('variance')) {
        const numVal = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, ''));
        return isNaN(numVal) ? (val === null || val === undefined ? '' : String(val)) : formatCurrency(numVal);
      }
      return val === null || val === undefined ? '' : String(val);
    }));
    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePDFExport = () => {
    const headers = exportableColumns.map((c) => c.exportLabel || (typeof c.label === 'string' ? c.label : String(c.id)));
    const rows = sortedData.map((row) => exportableColumns.map((col) => {
      const val = col.accessor(row);
      if (col.id.toLowerCase().includes('amount') || col.id.toLowerCase().includes('balance') || col.id.toLowerCase().includes('variance')) {
        const numVal = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, ''));
        return isNaN(numVal) ? (val === null || val === undefined ? '' : String(val)) : formatCurrency(numVal);
      }
      return val === null || val === undefined ? '' : String(val);
    }));
    const doc = new jsPDF({ orientation: headers.length > 6 ? 'landscape' : 'portrait' });
    doc.setFontSize(14).text(exportTitle, 14, 18);
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [33, 150, 243], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    });
    doc.save(`${exportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <MainContainer>
      <DataTableToolbar
        selectable={props.selectable}
        selectedKeys={selectedKeys}
        sortedData={sortedData}
        totalCount={totalCount}
        rowKey={rowKey}
        handleSelectionChange={handleSelectionChange}
        isMobile={isMobile}
        activeFilterCount={activeFilterCount}
        clearAllFilters={clearAllFilters}
        customToolbarContent={props.customToolbarContent}
        searchable={searchable}
        search={search}
        setSearch={setSearch}
        onSearchChange={props.onSearchChange}
        setInternalPage={setInternalPage}
        filterableColumns={filterableColumns}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        onFilterChange={props.onFilterChange}
        download={download}
        onDownload={props.onDownload}
        handleCSVExport={handleCSVExport}
        handlePDFExport={handlePDFExport}
      />

      {isMobile ? (
        <DataTableMobile
          paginatedData={paginatedData}
          rowKey={rowKey}
          onRowClick={onRowClick}
          selectable={props.selectable}
          selectedKeys={selectedKeys}
          handleSelectOne={handleSelectOne}
          columns={columns}
          descriptions={descriptions}
          handleHeaderClick={handleHeaderClick}
          expandedContent={expandedContent}
          expandedRows={expandedRows}
          getRowStyle={getRowStyle}
        />
      ) : (
        <DataTableDesktop
          selectable={props.selectable}
          isIndeterminate={isIndeterminate}
          isAllSelected={isAllSelected}
          handleSelectAll={handleSelectAll}
          columns={columns}
          sortCol={sortCol}
          sortDir={sortDir}
          isSortable={isSortable}
          handleSort={handleSort}
          descriptions={descriptions}
          handleHeaderClick={handleHeaderClick}
          paginatedData={paginatedData}
          selectedKeys={selectedKeys}
          onRowClick={onRowClick}
          rowKey={rowKey}
          handleSelectOne={handleSelectOne}
          expandedContent={expandedContent}
          expandedRows={expandedRows}
          dense={dense}
          disableHover={disableHover}
          getRowStyle={getRowStyle}
        />
      )}

      {paginated && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          labelDisplayedRows={({ count, page }) => `Page ${page + 1} of ${Math.max(1, Math.ceil(count / rowsPerPage))}`}
          onPageChange={(_, p) => {
            if (props.onPageChange) props.onPageChange(p);
            else setInternalPage(p);
          }}
          onRowsPerPageChange={(e) => {
            const rpp = parseInt(e.target.value, 10);
            if (props.onRowsPerPageChange) props.onRowsPerPageChange(rpp);
            else {
              setInternalRowsPerPage(rpp);
              setInternalPage(0);
            }
          }}
          sx={{ flexShrink: 0, borderTop: (t) => `1px solid ${t.palette.divider}`, '& .MuiTablePagination-toolbar': { minHeight: 40, px: 2 } }}
        />
      )}

      <DictionaryDrawer
        open={dictionaryOpen}
        onClose={() => setDictionaryOpen(false)}
        selectedField={selectedField}
      />
    </MainContainer>
  );
}

export default DataTable;

