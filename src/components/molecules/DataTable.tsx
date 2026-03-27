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
  Tooltip,
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
import DictionaryDrawer from './DictionaryDrawer';
import { getDescriptionsForTable, TableDescription, TableDescriptions } from '@/services/descriptionService';
import {
  MainContainer,
  ToolbarContainer,
  ScrollableTableContainer,
  CustomTableRow,
  FilterCollapseContainer,
} from './DataTable.styles';


export interface DataColumn<T> {
  id: string;
  label: React.ReactNode;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => React.ReactNode;
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
  /** ID for dictionary lookups. If provided, headers will show a dictionary icon. */
  dictionaryId?: string;
  /** Server-side support props */
  serverSide?: boolean;
  totalElements?: number;
  page?: number;
  rowsPerPage?: number;
  sortCol?: string;
  sortDir?: 'asc' | 'desc';
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  onSortChange?: (colId: string, direction: 'asc' | 'desc') => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  onSearchChange?: (query: string) => void;
  download?:boolean;
  onDownload?: () => void;
}


function DataTable<T>({
  columns,
  data,
  rowKey,
  paginated = true,
  download=true,
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
  
  // Internal state
  const [internalPage, setInternalPage] = React.useState(0);
  const [internalRowsPerPage, setInternalRowsPerPage] = React.useState(rowsPerPageOptions[0]);
  const [internalSortCol, setInternalSortCol] = React.useState<string | null>(null);
  const [internalSortDir, setInternalSortDir] = React.useState<SortDirection>('asc');
  const [internalSearch, setInternalSearch] = React.useState('');
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<Record<string, string>>({});
  
  // Use props if provided (for server-side control), otherwise use internal state
  const page = props.page !== undefined ? props.page : internalPage;
  const rowsPerPage = props.rowsPerPage !== undefined ? props.rowsPerPage : internalRowsPerPage;
  const sortCol = props.sortCol !== undefined ? props.sortCol : internalSortCol;
  const sortDir = (props.sortDir !== undefined ? props.sortDir : internalSortDir) as SortDirection;
  const search = internalSearch; // Search is always internal but notifies
  const columnFilters = internalColumnFilters;

  const [showFilters, setShowFilters] = React.useState(false);
  const [downloadAnchor, setDownloadAnchor] = React.useState<null | HTMLElement>(null);
  const [descriptions, setDescriptions] = React.useState<TableDescriptions | null>(null);
  const [dictionaryOpen, setDictionaryOpen] = React.useState(false);
  const [selectedField, setSelectedField] = React.useState<TableDescription | null>(null);

  React.useEffect(() => {
    if (dictionaryId) {
      getDescriptionsForTable(dictionaryId).then(setDescriptions);
    }
  }, [dictionaryId]);

  const handleHeaderClick = (colId: string, label: string) => {
    if (descriptions && descriptions[colId]) {
      setSelectedField(descriptions[colId]);
      setDictionaryOpen(true);
    }
  };


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
    let newDir: SortDirection = 'asc';
    if (sortCol === colId) {
      newDir = sortDir === 'asc' ? 'desc' : 'asc';
    }

    if (props.onSortChange) {
      props.onSortChange(colId, newDir);
    } else {
      setInternalSortCol(colId);
      setInternalSortDir(newDir);
      setInternalPage(0);
    }
  };

  const isSortable = (col: DataColumn<T>) => col.accessor && !col.disableSort;

  // Filter data
  let filteredData = data;

  if (search.trim() && !props.serverSide) {
    const q = search.toLowerCase();
    filteredData = filteredData.filter((row) =>
      columns.some((col) => {
        if (!col.accessor) return false;
        const val = col.accessor(row);
        return String(val).toLowerCase().includes(q);
      })
    );
  }

  if (!props.serverSide) {
    Object.entries(columnFilters).forEach(([colId, filterVal]) => {
      if (!filterVal) return;
      const col = columns.find((c) => c.id === colId);
      if (!col?.accessor) return;
      filteredData = filteredData.filter((row) => {
        const val = String(col.accessor!(row));
        return val === filterVal;
      });
    });
  }

  if (sortCol && !props.serverSide) {
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

  const paginatedData = paginated && !props.serverSide ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : filteredData;

  const totalCount = props.serverSide ? (props.totalElements ?? data.length) : filteredData.length;

  const activeFilterCount = Object.values(columnFilters).filter(Boolean).length + (search ? 1 : 0);

  const clearAllFilters = () => {
    setInternalSearch('');
    setInternalColumnFilters({});
    setInternalSortCol(null);
    setInternalPage(0);
    props.onSearchChange?.('');
    props.onFilterChange?.({});
    if (props.onSortChange) props.onSortChange('', 'asc');
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
    const headers: string[] = exportableColumns.map((c) => c.exportLabel || (typeof c.label === 'string' ? c.label : String(c.id)));
    const rows: string[][] = filteredData.map((row) =>
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
    <ToolbarContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flex: 1 }}>
        {searchable && (
          <TextField
            placeholder="Search..."
            size="small"
            value={search}
            onChange={(e) => {
              setInternalSearch(e.target.value);
              props.onSearchChange?.(e.target.value);
              setInternalPage(0);
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => {
                      setInternalSearch('');
                      props.onSearchChange?.('');
                    }}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }
            }}
            sx={{ 
              minWidth: { xs: '100%', sm: 240 }, 
              '& .MuiOutlinedInput-root': { 
                borderRadius: 2, 
                backgroundColor: theme.palette.inputBackground 
              } 
            }}
          />
        )}
        {props.customToolbarContent}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {filterableColumns.length > 0 && (
          <Button
            startIcon={<FilterListIcon fontSize="small" />}
            variant={showFilters ? "contained" : "outlined"}
            size="small"
            onClick={() => setShowFilters(!showFilters)}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        )}
        
        {download && (
          <>
            <Button
              startIcon={<FileDownloadIcon fontSize="small" />}
              variant="outlined"
              size="small"
              onClick={(e) => props.onDownload ? props.onDownload() : setDownloadAnchor(e.currentTarget)}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Export
            </Button>
            <Menu
              anchorEl={downloadAnchor}
              open={Boolean(downloadAnchor)}
              onClose={() => setDownloadAnchor(null)}
            >
              {props.onDownload ? (
                <MenuItem onClick={() => { setDownloadAnchor(null); props.onDownload?.(); }}>
                  <ListItemIcon><TableChartIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Export to Excel</ListItemText>
                </MenuItem>
              ) : (
                <MenuItem onClick={handleCSVExport}>
                  <ListItemIcon><TableChartIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Export as CSV</ListItemText>
                </MenuItem>
              )}
              <MenuItem onClick={handlePDFExport}>
                <ListItemIcon><PictureAsPdfIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Export as PDF</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}

        {activeFilterCount > 0 && (
          <IconButton 
            size="small" 
            onClick={clearAllFilters} 
            sx={{ 
              color: theme.palette.error.main,
              backgroundColor: `${theme.palette.error.main}10`,
              '&:hover': { backgroundColor: `${theme.palette.error.main}20` }
            }}
            title="Clear all filters"
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Collapse in={showFilters} sx={{ width: '100%' }}>
        <FilterCollapseContainer sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          {filterableColumns.map((col) => (
            <FormControl key={col.id} size="small" sx={{ minWidth: 150 }}>
              <Select
                displayEmpty
                value={columnFilters[col.id] || ''}
                onChange={(e) => {
                  const val = e.target.value as string;
                  const next = { ...columnFilters, [col.id]: val };
                  setInternalColumnFilters(next);
                  props.onFilterChange?.(next);
                  setInternalPage(0);
                }}
                sx={{ 
                  fontSize: '0.8rem', 
                  borderRadius: 2, 
                  backgroundColor: theme.palette.inputBackground 
                }}
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
        </FilterCollapseContainer>
      </Collapse>
    </ToolbarContainer>
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
                ...(selectedKeys.has(key) && { backgroundColor: `${theme.palette.selectionBackground} !important` }),
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: 'none',
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
                    {actionsCol && actionsCol.render?.(row)}
                  </Box>
                )}
                {visibleColumns.map((col, idx) => (
                  <Box key={col.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 0.5, gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.2, minWidth: 100, flexShrink: 0 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          {col.label}
                        </Typography>
                        {descriptions && descriptions[col.id] && (
                          <IconButton 
                            size="small" 
                            sx={{ p: 0.1 }} 
                            onClick={(e) => { e.stopPropagation(); handleHeaderClick(col.id, String(col.label)); }}
                          >
                            <MenuBookIcon sx={{ fontSize: 11, color: theme.palette.primary.main, opacity: 0.7 }} />
                          </IconButton>
                        )}
                      </Box>
                      <Box sx={{ textAlign: 'right', flex: 1 }}>
                        {col.render ? col.render(row) : (col.accessor ? col.accessor(row) : null)}
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
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, p) => {
              if (props.onPageChange) {
                props.onPageChange(p);
              } else {
                setInternalPage(p);
              }
            }}
            onRowsPerPageChange={(e) => {
              const rpp = parseInt(e.target.value, 10);
              if (props.onRowsPerPageChange) {
                props.onRowsPerPageChange(rpp);
              } else {
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
      </Box>
    );
  }

  // Desktop: regular table
  return (
    <MainContainer>
      {toolbar}
      <ScrollableTableContainer>
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {col.label}
                        {descriptions && descriptions[col.id] && (
                          <IconButton 
                            size="small" 
                            sx={{ p: 0.2, ml: 0.5 }} 
                            onClick={(e) => { e.stopPropagation(); handleHeaderClick(col.id, String(col.label)); }}
                          >
                            <MenuBookIcon sx={{ fontSize: 13, color: theme.palette.primary.main, opacity: 0.7 }} />
                          </IconButton>
                        )}
                      </Box>
                    </TableSortLabel>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {col.label}
                      {descriptions && descriptions[col.id] && (
                        <IconButton 
                          size="small" 
                          sx={{ p: 0.2, ml: 0.5 }} 
                          onClick={(e) => { e.stopPropagation(); handleHeaderClick(col.id, String(col.label)); }}
                        >
                          <MenuBookIcon sx={{ fontSize: 13, color: theme.palette.primary.main, opacity: 0.7 }} />
                        </IconButton>
                      )}
                    </Box>
                  )}

                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (props.selectable ? 1 : 0)} align="center" sx={{ py: 4 }}>
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
                    <CustomTableRow
                      hover
                      onClick={() => onRowClick?.(row)}
                      clickable={!!onRowClick}
                      isSelected={selectedKeys.has(key)}
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
                          {col.render ? col.render(row) : (col.accessor ? col.accessor(row) : null)}
                        </TableCell>
                      ))}
                    </CustomTableRow>
                    {expandedContent && expandedRows?.has(key) && (
                      <TableRow>
                        <TableCell colSpan={columns.length + (props.selectable ? 1 : 0)} sx={{ p: 0, border: 0 }}>
                          <Box sx={{ p: 2, backgroundColor: 'action.hover' }}>{expandedContent(row)}</Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </ScrollableTableContainer>
      {paginated && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => {
            if (props.onPageChange) {
              props.onPageChange(p);
            } else {
              setInternalPage(p);
            }
          }}
          onRowsPerPageChange={(e) => {
            const rpp = parseInt(e.target.value, 10);
            if (props.onRowsPerPageChange) {
              props.onRowsPerPageChange(rpp);
            } else {
              setInternalRowsPerPage(rpp);
              setInternalPage(0);
            }
          }}
          sx={{ flexShrink: 0, borderTop: (t) => `1px solid ${t.palette.divider}`, overflow: 'hidden !important', '& .MuiTablePagination-toolbar': { minHeight: 40, p: 0, px: 2, overflow: 'hidden !important' }, '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': { m: 0 } }}
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
