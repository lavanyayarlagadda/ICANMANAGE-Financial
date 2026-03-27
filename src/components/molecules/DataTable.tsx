import React, { useState, useMemo, useEffect } from 'react';
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
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DictionaryDrawer from './DictionaryDrawer';
import { getDescriptionsForTable, TableDescription, TableDescriptions } from '@/services/descriptionService';
import {
  MainContainer,
  ToolbarContainer,
  SelectionToolbar,
  MainToolbarActions,
  SearchFieldContainer,
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
  accessor?: (row: T) => string | number;
  disableSort?: boolean;
  filterOptions?: string[];
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
  exportTitle?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedKeys: Set<string>) => void;
  selectedKeys?: Set<string>;
  customToolbarContent?: React.ReactNode;
  dictionaryId?: string;
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
  searchable = false,
  exportTitle = 'Data Export',
  dictionaryId,
  ...props
}: DataTableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions?.[0] || 10);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [downloadAnchor, setDownloadAnchor] = useState<null | HTMLElement>(null);
  const [descriptions, setDescriptions] = useState<TableDescriptions | null>(null);
  const [dictionaryOpen, setDictionaryOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<TableDescription | null>(null);
  const [internalSelected, setInternalSelected] = useState<Set<string>>(new Set());

  const selectedKeys = props.selectedKeys ?? internalSelected;

  // Effects
  useEffect(() => {
    if (dictionaryId) {
      getDescriptionsForTable(dictionaryId).then(setDescriptions);
    }
  }, [dictionaryId]);

  // Performance Memoization
  const filteredData = useMemo(() => {
    let result = data;

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          if (!col.accessor) return false;
          const val = col.accessor(row);
          return String(val).toLowerCase().includes(q);
        })
      );
    }

    // Column filters
    Object.entries(columnFilters).forEach(([colId, filterVal]) => {
      if (!filterVal) return;
      const col = columns.find((c) => c.id === colId);
      if (!col?.accessor) return;
      result = result.filter((row) => {
        const val = String(col.accessor!(row));
        return val === filterVal;
      });
    });

    // Sorting
    if (sortCol) {
      const col = columns.find((c) => c.id === sortCol);
      if (col?.accessor) {
        result = [...result].sort((a, b) => {
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

    return result;
  }, [data, search, columnFilters, sortCol, sortDir, columns]);

  const paginatedData = useMemo(() => {
    return paginated ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : filteredData;
  }, [filteredData, paginated, page, rowsPerPage]);

  // Handlers
  const handleHeaderClick = (colId: string) => {
    if (descriptions && descriptions[colId]) {
      setSelectedField(descriptions[colId]);
      setDictionaryOpen(true);
    }
  };

  const handleSelectionChange = (newSelection: Set<string>) => {
    setInternalSelected(newSelection);
    props.onSelectionChange?.(newSelection);
  };

  const handleSort = (colId: string) => {
    if (sortCol === colId) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(colId);
      setSortDir('asc');
    }
    setPage(0);
  };

  const handleCSVExport = () => {
    const exportableCols = columns.filter((c) => c.id !== 'actions' && c.accessor);
    const headers = exportableCols.map((c) => c.exportLabel || (typeof c.label === 'string' ? c.label : String(c.id)));
    const rows = filteredData.map((row) => exportableCols.map((col) => String(col.accessor!(row))));

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
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
    const exportableCols = columns.filter((c) => c.id !== 'actions' && c.accessor);
    const headers = exportableCols.map((c) => c.exportLabel || (typeof c.label === 'string' ? c.label : String(c.id)));
    const rows = filteredData.map((row) => exportableCols.map((col) => String(col.accessor!(row))));
    
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

  const clearAllFilters = () => {
    setSearch('');
    setColumnFilters({});
    setSortCol(null);
    setPage(0);
  };

  const activeFilterCount = useMemo(() => {
    return Object.values(columnFilters).filter(Boolean).length + (search ? 1 : 0);
  }, [columnFilters, search]);

  const isAllSelected = paginatedData.length > 0 && paginatedData.every(row => selectedKeys.has(rowKey(row)));
  const isIndeterminate = paginatedData.some(row => selectedKeys.has(rowKey(row))) && !isAllSelected;

  const filterableColumns = columns.filter((c) => c.filterOptions && c.filterOptions.length > 0);
  const exportableCols = columns.filter((c) => c.id !== 'actions' && c.accessor);

  const toolbar = (
    <ToolbarContainer>
      {props.selectable && (
        <SelectionToolbar>
          {selectedKeys.size > 0 && (
            <>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                ({selectedKeys.size}) Rows Selected
              </Typography>
              <Typography variant="body2" color="text.secondary">·</Typography>
              <Link component="button" variant="body2" onClick={() => handleSelectionChange(new Set())} sx={{ cursor: 'pointer', textDecoration: 'none' }}>
                Deselect All
              </Link>
            </>
          )}
        </SelectionToolbar>
      )}

      <MainToolbarActions isMobile={isMobile}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="caption" color="text.secondary">
            {filteredData.length} record{filteredData.length !== 1 ? 's' : ''}
          </Typography>
          {activeFilterCount > 0 && (
            <Chip
              label={`${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''}`}
              size="small"
              onDelete={clearAllFilters}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        <SearchFieldContainer isMobile={isMobile}>
          {props.customToolbarContent}
          {searchable && (
            <TextField
              size="small"
              placeholder="Search…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              sx={{ minWidth: isMobile ? '100%' : 180 }}
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

          <Box sx={{ display: 'flex', gap: 1 }}>
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

            {exportableCols.length > 0 && (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<FileDownloadIcon fontSize="small" />}
                  onClick={(e) => setDownloadAnchor(e.currentTarget)}
                  sx={{ textTransform: 'none', border: `1px solid ${theme.palette.divider}` }}
                >
                  Export
                </Button>
                <Menu anchorEl={downloadAnchor} open={Boolean(downloadAnchor)} onClose={() => setDownloadAnchor(null)}>
                  <MenuItem onClick={handleCSVExport}>
                    <ListItemIcon><TableChartIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>CSV</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handlePDFExport}>
                    <ListItemIcon><PictureAsPdfIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>PDF</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </SearchFieldContainer>
      </MainToolbarActions>

      <Collapse in={showFilters}>
        <FilterCollapseContainer>
          {filterableColumns.map((col) => (
            <FormControl key={col.id} size="small" sx={{ minWidth: 140 }}>
              <Select
                displayEmpty
                value={columnFilters[col.id] || ''}
                onChange={(e) => {
                  setColumnFilters((prev) => ({ ...prev, [col.id]: e.target.value as string }));
                  setPage(0);
                }}
                renderValue={(v) => v || <Typography variant="caption" color="text.secondary">{col.label}</Typography>}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                {col.filterOptions!.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
              </Select>
            </FormControl>
          ))}
        </FilterCollapseContainer>
      </Collapse>
    </ToolbarContainer>
  );

  if (isMobile) {
    const visibleCols = columns.filter((c) => c.id !== 'actions' && !c.hideOnMobile);
    const actionsCol = columns.find((c) => c.id === 'actions');

    return (
      <Box>
        {toolbar}
        {paginatedData.map((row) => {
          const key = rowKey(row);
          return (
            <Card key={key} sx={{ mb: 1.5, ...(selectedKeys.has(key) && { backgroundColor: '#F4F9FF' }) }} onClick={() => onRowClick?.(row)}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  {props.selectable && (
                    <Checkbox
                      size="small"
                      checked={selectedKeys.has(key)}
                      onChange={(e) => {
                        const next = new Set(selectedKeys);
                        if (e.target.checked) next.add(key); else next.delete(key);
                        handleSelectionChange(next);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  {actionsCol && actionsCol.render?.(row)}
                </Box>
                {visibleCols.map((col, idx) => (
                  <Box key={col.id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{col.label}</Typography>
                      <Box sx={{ textAlign: 'right' }}>{col.render ? col.render(row) : (col.accessor ? col.accessor(row) : null)}</Box>
                    </Box>
                    {idx < visibleCols.length - 1 && <Divider sx={{ my: 0.25 }} />}
                  </Box>
                ))}
              </CardContent>
            </Card>
          );
        })}
        <TablePagination
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
        />
        <DictionaryDrawer open={dictionaryOpen} onClose={() => setDictionaryOpen(false)} selectedField={selectedField} />
      </Box>
    );
  }

  return (
    <MainContainer>
      {toolbar}
      <ScrollableTableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {props.selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={(e) => {
                      const next = new Set(selectedKeys);
                      paginatedData.forEach(r => e.target.checked ? next.add(rowKey(r)) : next.delete(rowKey(r)));
                      handleSelectionChange(next);
                    }}
                  />
                </TableCell>
              )}
              {columns.map((col) => {
                const isSortable = col.accessor && !col.disableSort;
                return (
                  <TableCell
                    key={col.id}
                    align={col.align || 'left'}
                    sortDirection={sortCol === col.id ? sortDir : false}
                    sx={{ minWidth: col.minWidth }}
                  >
                    {isSortable ? (
                      <TableSortLabel
                        active={sortCol === col.id}
                        direction={sortCol === col.id ? sortDir : 'asc'}
                        onClick={() => handleSort(col.id)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {col.label}
                          {descriptions && descriptions[col.id] && (
                            <IconButton size="small" sx={{ p: 0.2 }} onClick={(e) => { e.stopPropagation(); handleHeaderClick(col.id); }}>
                              <MenuBookIcon sx={{ fontSize: 13, color: theme.palette.primary.main, opacity: 0.7 }} />
                            </IconButton>
                          )}
                        </Box>
                      </TableSortLabel>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {col.label}
                        {descriptions && descriptions[col.id] && (
                          <IconButton size="small" sx={{ p: 0.2 }} onClick={(e) => { e.stopPropagation(); handleHeaderClick(col.id); }}>
                            <MenuBookIcon sx={{ fontSize: 13, color: theme.palette.primary.main, opacity: 0.7 }} />
                          </IconButton>
                        )}
                      </Box>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (props.selectable ? 1 : 0)} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">No records found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const key = rowKey(row);
                const isSelected = selectedKeys.has(key);
                return (
                  <React.Fragment key={key}>
                    <CustomTableRow
                      hover
                      onClick={() => onRowClick?.(row)}
                      clickable={!!onRowClick}
                      isSelected={isSelected}
                    >
                      {props.selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            size="small"
                            checked={isSelected}
                            onChange={(e) => {
                              const next = new Set(selectedKeys);
                              if (e.target.checked) next.add(key); else next.delete(key);
                              handleSelectionChange(next);
                            }}
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
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
        />
      )}
      <DictionaryDrawer open={dictionaryOpen} onClose={() => setDictionaryOpen(false)} selectedField={selectedField} />
    </MainContainer>
  );
}

export default DataTable;
