import React, { useMemo, useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Collapse,
  MenuItem,
  Select,
  FormControl,
  Button,
  Menu,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Checkbox,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DictionaryDrawer from '@/components/molecules/DictionaryDrawer/DictionaryDrawer';
import {
  MainContainer,
  ToolbarContainer,
  ScrollableTableContainer,
  CustomTableRow,
  FilterCollapseContainer,
} from './DataTable.styles';
import { useDataTable, DataColumn, SortDirection } from './DataTable.hook';

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
}

function DataTable<T>({
  columns,
  data,
  rowKey,
  paginated = true,
  download = true,
  rowsPerPageOptions = [10, 25, 50],
  onRowClick,
  expandedContent,
  expandedRows,
  searchable = false,
  exportTitle = 'Data Export',
  dictionaryId,
  ...props
}: DataTableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showFilters, setShowFilters] = useState(false);
  const [downloadAnchor, setDownloadAnchor] = useState<null | HTMLElement>(null);

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
    ...props,
  });

  const paginatedData = useMemo(() => 
    paginated && !props.serverSide ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : sortedData,
    [paginated, props.serverSide, sortedData, page, rowsPerPage]
  );

  const filterableColumns = useMemo(() => columns.filter((c) => c.filterOptions && c.filterOptions.length > 0), [columns]);
  const exportableColumns = useMemo(() => columns.filter((c) => c.id !== 'actions' && c.accessor), [columns]);
  const activeFilterCount = useMemo(() => Object.values(columnFilters).filter(Boolean).length + (search ? 1 : 0), [columnFilters, search]);

  const handleSelectAll = useCallback((checked: boolean) => {
    const newSelection = new Set(selectedKeys);
    paginatedData.forEach(row => {
      const key = rowKey(row);
      if (checked) newSelection.add(key);
      else newSelection.delete(key);
    });
    handleSelectionChange(newSelection);
  }, [paginatedData, selectedKeys, rowKey, handleSelectionChange]);

  const isAllSelected = useMemo(() => paginatedData.length > 0 && paginatedData.every(row => selectedKeys.has(rowKey(row))), [paginatedData, selectedKeys, rowKey]);
  const isIndeterminate = useMemo(() => paginatedData.some(row => selectedKeys.has(rowKey(row))) && !isAllSelected, [paginatedData, selectedKeys, rowKey, isAllSelected]);

  const handleCSVExport = useCallback(() => {
    const headers = exportableColumns.map((c) => c.exportLabel || (typeof c.label === 'string' ? c.label : String(c.id)));
    const exportDataRows = (props.serverSide ? data : sortedData).map((row) => exportableColumns.map((col) => String(col.accessor!(row))));
    const csvContent = [headers.join(','), ...exportDataRows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadAnchor(null);
  }, [exportableColumns, props.serverSide, data, sortedData, exportTitle]);

  const handlePDFExport = useCallback(() => {
    const headers = exportableColumns.map((c) => c.exportLabel || (typeof c.label === 'string' ? c.label : String(c.id)));
    const exportDataRows = (props.serverSide ? data : sortedData).map((row) => exportableColumns.map((col) => String(col.accessor!(row))));
    const doc = new jsPDF({ orientation: headers.length > 6 ? 'landscape' : 'portrait' });
    doc.setFontSize(14).text(exportTitle, 14, 18);
    autoTable(doc, { head: [headers], body: exportDataRows, startY: 30, styles: { fontSize: 7 } });
    doc.save(`${exportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
    setDownloadAnchor(null);
  }, [exportableColumns, props.serverSide, data, sortedData, exportTitle]);

  const toolbar = (
    <ToolbarContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flex: 1 }}>
        {searchable && (
          <TextField
            placeholder="Search..."
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              props.onSearchChange?.(e.target.value);
              setInternalPage(0);
            }}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment>,
                endAdornment: search && <InputAdornment position="end"><IconButton size="small" onClick={() => setSearch('')}><ClearIcon fontSize="small" /></IconButton></InputAdornment>,
              }
            }}
            sx={{ minWidth: { xs: '100%', sm: 240 }, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: theme.palette.background.paper } }}
          />
        )}
        {props.customToolbarContent}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {filterableColumns.length > 0 && (
          <Button startIcon={<FilterListIcon fontSize="small" />} variant={showFilters ? "contained" : "outlined"} size="small" onClick={() => setShowFilters(!showFilters)} sx={{ borderRadius: 2, textTransform: 'none' }}>
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        )}
        {download && (
          <>
            <Button startIcon={<FileDownloadIcon fontSize="small" />} variant="outlined" size="small" onClick={(e) => props.onDownload ? props.onDownload() : setDownloadAnchor(e.currentTarget)} sx={{ borderRadius: 2, textTransform: 'none' }}>Export</Button>
            <Menu anchorEl={downloadAnchor} open={Boolean(downloadAnchor)} onClose={() => setDownloadAnchor(null)} slotProps={{ paper: { sx: { minWidth: 160 } as any } }}>
              <MenuItem onClick={handleCSVExport}><ListItemIcon><TableChartIcon fontSize="small" /></ListItemIcon><ListItemText>Export as CSV</ListItemText></MenuItem>
              <MenuItem onClick={handlePDFExport}><ListItemIcon><PictureAsPdfIcon fontSize="small" /></ListItemIcon><ListItemText>Export as PDF</ListItemText></MenuItem>
            </Menu>
          </>
        )}
        {activeFilterCount > 0 && <IconButton size="small" onClick={clearAllFilters} sx={{ color: theme.palette.error.main, backgroundColor: `${theme.palette.error.main}10` }}><ClearIcon fontSize="small" /></IconButton>}
      </Box>
      <Collapse in={showFilters} sx={{ width: '100%' }}>
        <FilterCollapseContainer sx={{ display: 'flex', gap: 2, mt: 2 }}>
          {filterableColumns.map((col) => (
            <FormControl key={col.id} size="small" sx={{ minWidth: 150 }}>
              <Select
                displayEmpty
                value={columnFilters[col.id] || ''}
                onChange={(e) => {
                  const next = { ...columnFilters, [col.id]: e.target.value as string };
                  setColumnFilters(next);
                  props.onFilterChange?.(next);
                  setInternalPage(0);
                }}
                renderValue={(v) => v || <Typography variant="caption" color="text.secondary">{col.label}</Typography>}
              >
                <MenuItem value=""><em>All {col.label}</em></MenuItem>
                {col.filterOptions!.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </Select>
            </FormControl>
          ))}
        </FilterCollapseContainer>
      </Collapse>
    </ToolbarContainer>
  );

  if (isMobile) {
    const visibleColumns = columns.filter((c) => c.id !== 'actions' && !c.hideOnMobile);
    const actionsCol = columns.find((c) => c.id === 'actions');
    return (
      <Box>
        {toolbar}
        {paginatedData.map((row) => {
          const key = rowKey(row);
          return (
            <Card key={key} sx={{ mb: 1.5, border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }} onClick={() => onRowClick?.(row)}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  {props.selectable && <Checkbox size="small" checked={selectedKeys.has(key)} onClick={e => e.stopPropagation()} onChange={e => { const s = new Set(selectedKeys); e.target.checked ? s.add(key) : s.delete(key); handleSelectionChange(s); }} />}
                  {actionsCol?.render?.(row)}
                </Box>
                {visibleColumns.map(col => (
                  <Box key={col.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography variant="caption" fontWeight={600}>{col.label}</Typography>
                    <Box>{col.render ? col.render(row) : (col.accessor ? col.accessor(row) : null)}</Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </Box>
    );
  }

  return (
    <MainContainer>
      {toolbar}
      <ScrollableTableContainer>
        <Table stickyHeader size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow>
              {props.selectable && <TableCell padding="checkbox" sx={{ width: 50 }}><Checkbox size="small" indeterminate={isIndeterminate} checked={isAllSelected} onChange={e => handleSelectAll(e.target.checked)} /></TableCell>}
              {columns.map(col => (
                <TableCell key={col.id} align={col.align || 'left'} sx={{ width: col.minWidth }} sortDirection={sortCol === col.id ? sortDir : false}>
                  {col.accessor && !col.disableSort ? (
                    <TableSortLabel active={sortCol === col.id} direction={sortCol === col.id ? sortDir : 'asc'} onClick={() => handleSort(col.id)}>{col.label}</TableSortLabel>
                  ) : col.label}
                  {descriptions?.[col.id] && <IconButton size="small" onClick={() => handleHeaderClick(col.id)}><MenuBookIcon sx={{ fontSize: 13 }} /></IconButton>}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map(row => {
              const key = rowKey(row);
              return (
                <CustomTableRow key={key} hover onClick={() => onRowClick?.(row)} isSelected={selectedKeys.has(key)} clickable={!!onRowClick}>
                  {props.selectable && <TableCell padding="checkbox"><Checkbox size="small" checked={selectedKeys.has(key)} onClick={e => e.stopPropagation()} onChange={e => { const s = new Set(selectedKeys); e.target.checked ? s.add(key) : s.delete(key); handleSelectionChange(s); }} /></TableCell>}
                  {columns.map(col => <TableCell key={col.id} align={col.align || 'left'}>{col.render ? col.render(row) : (col.accessor ? col.accessor(row) : null)}</TableCell>)}
                </CustomTableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollableTableContainer>
      {paginated && (
        <TablePagination
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => { props.onPageChange?.(p); if (!props.serverSide) setInternalPage(p); }}
          onRowsPerPageChange={e => { const rpp = parseInt(e.target.value, 10); props.onRowsPerPageChange?.(rpp); if (!props.serverSide) { setInternalRowsPerPage(rpp); setInternalPage(0); } }}
        />
      )}
      <DictionaryDrawer open={dictionaryOpen} onClose={() => setDictionaryOpen(false)} selectedField={selectedField} />
    </MainContainer>
  );
}

export default DataTable;
