import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  Chip,
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
  Link,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface DataColumn<T> {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  render: (row: T) => React.ReactNode;
  hideOnMobile?: boolean;
  primary?: boolean;
  /** Accessor for sorting & filtering — return a string or number from the row */
  accessor?: (row: T) => string | number;
  /** If true, sorting is disabled for this column */
  disableSort?: boolean;
  /** Provide an array of filter options for a dropdown filter on this column */
  filterOptions?: string[];
  /** Label used for export columns. Defaults to label. */
  exportLabel?: string;
}

type SortDirection = 'asc' | 'desc';

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
  /** Title used for PDF export header */
  exportTitle?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedKeys: Set<string>) => void;
  selectedKeys?: Set<string>;
  customToolbarContent?: React.ReactNode;
}

function DataTable<T>({
  columns,
  data,
  rowKey,
  paginated = true,
  rowsPerPageOptions = [10, 25, 50],
  onRowClick,
  expandedContent,
  expandedRows,
  searchable = true,
  exportTitle = 'Data Export',
  ...props
}: DataTableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [sortCol, setSortCol] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDirection>('asc');
  const [search, setSearch] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<Record<string, string>>({});
  const [downloadAnchor, setDownloadAnchor] = React.useState<null | HTMLElement>(null);

  const [internalSelected, setInternalSelected] = React.useState<Set<string>>(new Set());
  const selectedKeys = props.selectedKeys ?? internalSelected;

  const handleSelectionChange = (newSelection: Set<string>) => {
    setInternalSelected(newSelection);
    props.onSelectionChange?.(newSelection);
  };

  const filterableColumns = columns.filter((c) => c.filterOptions && c.filterOptions.length > 0);
  // All columns with accessor are sortable (unless disableSort). Columns without accessor but not 'actions' get text-based sorting.
  const exportableColumns = columns.filter((c) => c.id !== 'actions' && c.accessor);

  const handleSort = (colId: string) => {
    if (sortCol === colId) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(colId);
      setSortDir('asc');
    }
    setPage(0);
  };

  const isSortable = (col: DataColumn<T>) => col.accessor && !col.disableSort;

  // Filter data
  let filteredData = data;

  if (search.trim()) {
    const q = search.toLowerCase();
    filteredData = filteredData.filter((row) =>
      columns.some((col) => {
        if (!col.accessor) return false;
        const val = col.accessor(row);
        return String(val).toLowerCase().includes(q);
      })
    );
  }

  Object.entries(columnFilters).forEach(([colId, filterVal]) => {
    if (!filterVal) return;
    const col = columns.find((c) => c.id === colId);
    if (!col?.accessor) return;
    filteredData = filteredData.filter((row) => {
      const val = String(col.accessor!(row));
      return val === filterVal;
    });
  });

  if (sortCol) {
    const col = columns.find((c) => c.id === sortCol);
    if (col?.accessor) {
      filteredData = [...filteredData].sort((a, b) => {
        const aVal = col.accessor!(a);
        const bVal = col.accessor!(b);
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
        }
        const cmp = String(aVal).localeCompare(String(bVal));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
  }

  const paginatedData = paginated ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : filteredData;

  const activeFilterCount = Object.values(columnFilters).filter(Boolean).length + (search ? 1 : 0);

  const clearAllFilters = () => {
    setSearch('');
    setColumnFilters({});
    setSortCol(null);
    setPage(0);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allPaginatedKeys = paginatedData.map(rowKey);
      const newSelection = new Set(selectedKeys);
      allPaginatedKeys.forEach(k => newSelection.add(k));
      handleSelectionChange(newSelection);
    } else {
      const allPaginatedKeys = paginatedData.map(rowKey);
      const newSelection = new Set(selectedKeys);
      allPaginatedKeys.forEach(k => newSelection.delete(k));
      handleSelectionChange(newSelection);
    }
  };

  const handleSelectOne = (key: string, checked: boolean) => {
    const newSelection = new Set(selectedKeys);
    if (checked) newSelection.add(key);
    else newSelection.delete(key);
    handleSelectionChange(newSelection);
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => selectedKeys.has(rowKey(row)));
  const isIndeterminate = paginatedData.some(row => selectedKeys.has(rowKey(row))) && !isAllSelected;

  // --- Export functions ---
  const getExportData = () => {
    const headers = exportableColumns.map((c) => c.exportLabel || c.label);
    const rows = filteredData.map((row) =>
      exportableColumns.map((col) => {
        const val = col.accessor!(row);
        return String(val);
      })
    );
    return { headers, rows };
  };

  const handleCSVExport = () => {
    const { headers, rows } = getExportData();
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => {
          const escaped = cell.replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloadAnchor(null);
  };

  const handlePDFExport = () => {
    const { headers, rows } = getExportData();
    const doc = new jsPDF({ orientation: headers.length > 6 ? 'landscape' : 'portrait' });

    doc.setFontSize(14);
    doc.text(exportTitle, 14, 18);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()} | Records: ${filteredData.length}`, 14, 25);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 30,
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [33, 150, 243], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { left: 10, right: 10 },
    });

    doc.save(`${exportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
    setDownloadAnchor(null);
  };

  const toolbar = (
    <Box sx={{ px: 1.5, py: 0.5, display: 'flex', flexDirection: 'column', gap: 0.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
      {props.selectable && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          {selectedKeys.size > 0 && (
            <>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                ({selectedKeys.size}) Rows Selected
              </Typography>
              <Typography variant="body2" color="text.secondary">·</Typography>
              <Link component="button" variant="body2" onClick={() => handleSelectionChange(new Set())} sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                Deselect All
              </Link>
              <Typography variant="body2" color="text.secondary">·</Typography>
              <Link component="button" variant="body2" onClick={() => {
                const maxSelection = new Set(filteredData.map(rowKey));
                handleSelectionChange(maxSelection);
              }} sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                Select Max
              </Link>

              {(activeFilterCount > 0 || props.customToolbarContent) && (
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              )}
            </>
          )}
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', width: '100%', justifyContent: 'flex-start' }}>
        <Typography variant="caption" color="text.secondary">
          {filteredData.length} record{filteredData.length !== 1 ? 's' : ''}
        </Typography>

        {activeFilterCount > 0 && (
          <Chip
            label={`${activeFilterCount} active filter${activeFilterCount > 1 ? 's' : ''}`}
            size="small"
            onDelete={clearAllFilters}
            color="primary"
            variant="outlined"
          />
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          {props.customToolbarContent}
          {searchable && (

            <TextField

              size="small"
              placeholder="Search…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              sx={{ flex: 1, minWidth: 180, maxWidth: 320 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => { setSearch(''); setPage(0); }}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          )}

          {filterableColumns.length > 0 && (
            <IconButton
              size="small"
              onClick={() => setShowFilters((p) => !p)}
              color={showFilters ? 'primary' : 'default'}
              sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          )}

          {/* Download button */}
          {exportableColumns.length > 0 && (
            <>
              <Button
                size="small"
                startIcon={<FileDownloadIcon fontSize="small" />}
                onClick={(e) => setDownloadAnchor(e.currentTarget)}
                sx={{ textTransform: 'none', minWidth: 'auto' }}
                color="inherit"
              >
                {!isMobile && 'Export'}
              </Button>
              <Menu
                anchorEl={downloadAnchor}
                open={Boolean(downloadAnchor)}
                onClose={() => setDownloadAnchor(null)}
              >
                <MenuItem onClick={handleCSVExport}>
                  <ListItemIcon><TableChartIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Download CSV</ListItemText>
                </MenuItem>
                <MenuItem onClick={handlePDFExport}>
                  <ListItemIcon><PictureAsPdfIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Download PDF</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )}

        </Box>
      </Box>

      <Collapse in={showFilters}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', pt: 0.5 }}>
          {filterableColumns.map((col) => (
            <FormControl key={col.id} size="small" sx={{ minWidth: 140 }}>
              <Select
                displayEmpty
                value={columnFilters[col.id] || ''}
                onChange={(e) => {
                  setColumnFilters((prev) => ({ ...prev, [col.id]: e.target.value as string }));
                  setPage(0);
                }}
                sx={{ fontSize: '0.8rem' }}
                renderValue={(v) => v || <Typography variant="caption" color="text.secondary">{col.label}</Typography>}
              >
                <MenuItem value="">
                  <em>All {col.label}</em>
                </MenuItem>
                {col.filterOptions!.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Box>
      </Collapse>
    </Box>
  );

  // Mobile: render as cards
  if (isMobile) {
    const visibleColumns = columns.filter((c) => c.id !== 'actions' && !c.hideOnMobile);
    const actionsCol = columns.find((c) => c.id === 'actions');

    return (
      <Box>
        {toolbar}
        {paginatedData.map((row) => {
          const key = rowKey(row);
          return (
            <Card
              key={key}
              sx={{
                mb: 1.5,
                cursor: onRowClick ? 'pointer' : 'default',
                ...(selectedKeys.has(key) && { backgroundColor: '#F4F9FF' }),
              }}
              onClick={() => onRowClick?.(row)}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {(actionsCol || props.selectable) && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    {props.selectable ? (
                      <Checkbox
                        size="small"
                        checked={selectedKeys.has(key)}
                        onChange={(e) => handleSelectOne(key, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : <Box />}
                    {actionsCol && actionsCol.render(row)}
                  </Box>
                )}
                {visibleColumns.map((col, idx) => (
                  <Box key={col.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 0.5, gap: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, minWidth: 100, flexShrink: 0 }}>
                        {col.label}
                      </Typography>
                      <Box sx={{ textAlign: 'right', flex: 1 }}>
                        {col.render(row)}
                      </Box>
                    </Box>
                    {idx < visibleColumns.length - 1 && <Divider sx={{ my: 0.25 }} />}
                  </Box>
                ))}
                {expandedContent && expandedRows?.has(key) && (
                  <Box sx={{ mt: 1, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                    {expandedContent(row)}
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })}
        {paginated && (
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        )}
      </Box>
    );
  }

  // Desktop: regular table
  return (
    <Paper sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {toolbar}
      <TableContainer
        sx={{
          flex: 1,
          minHeight: 0,
          maxHeight: 'calc(100vh - 240px)',
          overflowX: 'auto',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          '&::-webkit-scrollbar': {
            width: '0px',
            height: '0px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#bdbdbd',
            borderRadius: '10px',
            '&:hover': {
              background: '#9e9e9e',
            },
          },
        }}
      >
        <Table stickyHeader size="small" sx={{ '& .MuiTableCell-root': { p: 1, minHeight: 40 }, '& .MuiTableHead-root .MuiTableCell-root': { py: 1, minHeight: 48 } }}>
          <TableHead>
            <TableRow>
              {props.selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{ minWidth: col.minWidth, whiteSpace: 'nowrap' }}
                  sortDirection={sortCol === col.id ? sortDir : false}
                >
                  {isSortable(col) ? (
                    <TableSortLabel
                      active={sortCol === col.id}
                      direction={sortCol === col.id ? sortDir : 'asc'}
                      onClick={() => handleSort(col.id)}
                      sx={{
                        '& .MuiTableSortLabel-icon': {
                          opacity: sortCol === col.id ? 1 : 0.3,
                        },
                      }}
                      hideSortIcon={false}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No records found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const key = rowKey(row);
                return (
                  <React.Fragment key={key}>
                    <TableRow
                      hover
                      onClick={() => onRowClick?.(row)}
                      sx={{
                        cursor: onRowClick ? 'pointer' : 'default',
                        ...(selectedKeys.has(key) && { backgroundColor: '#F4F9FF !important' }),
                      }}
                      selected={selectedKeys.has(key)}
                    >
                      {props.selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            size="small"
                            checked={selectedKeys.has(key)}
                            onChange={(e) => handleSelectOne(key, e.target.checked)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                      )}
                      {columns.map((col) => (
                        <TableCell key={col.id} align={col.align || 'left'}>
                          {col.render(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandedContent && expandedRows?.has(key) && (
                      <TableRow>
                        <TableCell colSpan={columns.length} sx={{ p: 0, border: 0 }}>
                          <Box sx={{ p: 2, backgroundColor: 'action.hover' }}>
                            {expandedContent(row)}
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {paginated && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ flexShrink: 0, borderTop: (t) => `1px solid ${t.palette.divider}`, overflow: 'hidden !important', '& .MuiTablePagination-toolbar': { minHeight: 40, p: 0, px: 2, overflow: 'hidden !important' }, '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { m: 0 } }}
        />
      )}
    </Paper>
  );
}

export default DataTable;
