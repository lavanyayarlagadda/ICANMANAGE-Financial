import React, { useMemo, useState } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import { exportToCSV, exportToPDF } from '@/utils/exportUtils';
import { PAGE_SIZE_OPTIONS } from '@/constants/common';
import { useGetTableColumnsQuery, useUpdateTableColumnsMutation } from '@/store/api/userApi';

import DictionaryDrawer from '../DictionaryDrawer/DictionaryDrawer';
import {
  useDataTable,
  DataColumn,
  SortDirection,
  AccessorColumn,
  FilterableColumn,
} from './DataTable.hook';
import { MainContainer, StyledTablePagination } from './DataTable.styles';
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
  /** Rendered in the filter panel after column dropdown filters (e.g. text search fields). */
  customFilterContent?: React.ReactNode;
  /** Extra active filters for the filter badge (server-side search fields, etc.). */
  additionalFilterCount?: number;
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
  showColumnDividers?: boolean;
  tableTitle?: string;
  tableName?: string;
  gridName?: string;
  userId?: string;
}

function DataTable<T>({
  columns,
  data,
  rowKey,
  paginated = true,
  download = true,
  rowsPerPageOptions = PAGE_SIZE_OPTIONS,
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
  additionalFilterCount = 0,
  showColumnDividers = false,
  tableTitle,
  tableName,
  gridName,
  // userId,
  ...props
}: DataTableProps<T>) {
  const hasAccessor = (column: DataColumn<T>): column is AccessorColumn<T> => !!column.accessor;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showFilters, setShowFilters] = useState(false);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());

  const visibleColumns = useMemo(
    () => columns.filter((col) => !hiddenColumns.has(col.id)),
    [columns, hiddenColumns],
  );

  const actualTableName = tableName || gridName || '';

  const { data: columnPreferences, isFetching: isPreferencesFetching } = useGetTableColumnsQuery(
    actualTableName,
    { skip: !actualTableName },
  );

  const [updateColumns] = useUpdateTableColumnsMutation();

  // Reset hidden columns immediately when switching tables to avoid state bleed
  React.useEffect(() => {
    setHiddenColumns(new Set());
  }, [actualTableName]);

  // Fetch initial column preferences
  React.useEffect(() => {
    if (columnPreferences && typeof columnPreferences === 'object') {
      const newHidden = new Set<string>();
      // Payload is columnId -> boolean (true=visible, false=hidden)
      Object.entries(columnPreferences).forEach(([colId, isVisible]) => {
        if (!isVisible) {
          newHidden.add(colId);
        }
      });
      setHiddenColumns(newHidden);
    } else if (columnPreferences === null || columnPreferences === '') {
      // If the backend returns no preferences, reset to default (all visible)
      setHiddenColumns(new Set());
    }
  }, [columnPreferences]);

  const handleSaveColumns = async (stagedHidden: Set<string>) => {
    if (!actualTableName) {
      // If no backend config provided, just update locally
      setHiddenColumns(stagedHidden);
      return;
    }

    // Construct payload: all columns, true if visible, false if hidden (in stagedHidden)
    const columnsPayload: Record<string, boolean> = {};
    columns.forEach((col) => {
      if (col.id !== 'actions') {
        columnsPayload[col.id] = !stagedHidden.has(col.id);
      }
    });

    try {
      const res = await updateColumns({
        tableName: actualTableName,
        columns: columnsPayload,
      }).unwrap();

      // Apply response back to state
      const finalHidden = new Set<string>();
      if (res) {
        const responseColumns = 'columns' in res ? res.columns : res;
        Object.entries(responseColumns).forEach(([colId, isVisible]) => {
          if (!isVisible) {
            finalHidden.add(colId);
          }
        });
      }
      setHiddenColumns(finalHidden);
    } catch (e) {
      console.error('Failed to update column preferences', e);
      // Revert or show error if needed
    }
  };

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

  const filterableColumns = useMemo(
    () =>
      columns
        .filter((col) => !!col)
        .filter(
          (col) =>
            (Array.isArray(col.filterOptions) && col.filterOptions.length > 0) ||
            !!col.isFilterLoading ||
            !!col.filterError,
        )
        .map((col) => ({
          ...col,
          filterOptions: col.filterOptions || [],
        })) as FilterableColumn<T>[],
    [columns],
  );
  const exportableColumns = visibleColumns
    .filter((col) => !!col)
    .filter((c): c is AccessorColumn<T> => c.id !== 'actions' && hasAccessor(c));
  const paginatedData =
    paginated && !props.serverSide
      ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : sortedData;
  const activeFilterCount =
    Object.values(columnFilters).filter(Boolean).length + (search ? 1 : 0) + additionalFilterCount;

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

  const isAllSelected =
    paginatedData.length > 0 && paginatedData.every((row) => selectedKeys.has(rowKey(row)));
  const isIndeterminate =
    paginatedData.some((row) => selectedKeys.has(rowKey(row))) && !isAllSelected;

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
        customFilterContent={props.customFilterContent}
        tableTitle={tableTitle}
        columns={columns}
        hiddenColumns={hiddenColumns}
        onSaveColumns={handleSaveColumns}
      />

      {loading || isPreferencesFetching ? (
        <TableSkeleton
          rows={rowsPerPage}
          columns={visibleColumns.length}
          hasCheckbox={!!props.selectable}
        />
      ) : isMobile ? (
        <DataTableMobile
          paginatedData={paginatedData}
          rowKey={rowKey}
          onRowClick={onRowClick}
          selectable={props.selectable}
          selectedKeys={selectedKeys}
          handleSelectOne={handleSelectOne}
          columns={visibleColumns}
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
          columns={visibleColumns}
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
          showColumnDividers={showColumnDividers}
        />
      )}

      {paginated && (
        <StyledTablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          labelDisplayedRows={({ count, page }) =>
            `Page ${page + 1} of ${Math.max(1, Math.ceil(count / rowsPerPage))}`
          }
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
