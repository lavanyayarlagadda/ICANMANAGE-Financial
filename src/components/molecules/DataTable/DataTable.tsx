import React, { useMemo, useState } from 'react';
import {
  TablePagination,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { exportToCSV, exportToPDF } from '@/utils/exportUtils';

import DictionaryDrawer from '../DictionaryDrawer/DictionaryDrawer';
import { useDataTable, DataColumn, SortDirection, AccessorColumn, FilterableColumn } from './DataTable.hook';
import { MainContainer } from './DataTable.styles';
import { DataTableToolbar } from './DataTableToolbar';
import { DataTableDesktop } from './DataTableDesktop';
import { DataTableMobile } from './DataTableMobile';
import { TableSkeleton } from '../../atoms/TableSkeleton/TableSkeleton';

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
  loading?: boolean;
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
  loading = false,
  ...props
}: DataTableProps<T>) {
  const hasAccessor = (column: DataColumn<T>): column is AccessorColumn<T> => !!column.accessor;

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
    columns
      .filter((col) => !!col)
      .filter((col) =>
        (Array.isArray(col.filterOptions) && col.filterOptions.length > 0) ||
        !!col.isFilterLoading ||
        !!col.filterError
      )
      .map((col) => ({
        ...col,
        filterOptions: col.filterOptions || [],
      })) as FilterableColumn<T>[],
    [columns]
  );
  const exportableColumns = columns
    .filter((col) => !!col)
    .filter((c): c is AccessorColumn<T> => c.id !== 'actions' && hasAccessor(c));
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
    exportToCSV(sortedData, exportableColumns, exportTitle);
  };

  const handlePDFExport = () => {
    exportToPDF(sortedData, exportableColumns, exportTitle);
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

      {loading ? (
        <TableSkeleton rows={rowsPerPage} columns={columns.length} hasCheckbox={!!props.selectable} />
      ) : isMobile ? (
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

