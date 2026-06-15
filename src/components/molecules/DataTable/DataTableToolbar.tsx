import React from 'react';
import {
  Box,
  Typography,
  Chip,
  InputAdornment,
  IconButton,
  Collapse,
  FormControl,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Autocomplete,
  TextField,
  CircularProgress,
  createFilterOptions,
  Checkbox,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { EXPORT_FORMATS } from '@/constants/common';
import {
  ToolbarContainer,
  SelectionBar,
  ActionLink,
  ToolbarRow,
  ToolbarLeft,
  RecordsText,
  ToolbarRight,
  SearchField,
  ActionGroup,
  FilterButton,
  ExportButton,
  FilterWrapper,
} from './DataTable.styles';
import { FilterableColumn, DataColumn } from './DataTable.hook';

interface DataTableToolbarProps<T> {
  selectable?: boolean;
  selectedKeys: Set<string>;
  sortedData: T[];
  rowKey: (row: T) => string;
  handleSelectionChange: (keys: Set<string>) => void;
  isMobile: boolean;
  activeFilterCount: number;
  clearAllFilters: () => void;
  customToolbarContent?: React.ReactNode;
  searchable?: boolean;
  search: string;
  setSearch: (val: string) => void;
  onSearchChange?: (val: string) => void;
  setInternalPage: (page: number) => void;
  filterableColumns: FilterableColumn<T>[];
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  columnFilters: Record<string, string>;
  setColumnFilters: (filters: Record<string, string>) => void;
  totalCount?: number;
  onFilterChange?: (filters: Record<string, string>) => void;
  customFilterContent?: React.ReactNode;
  download?: boolean;
  onDownload?: () => void;
  handleCSVExport: () => void;
  handlePDFExport: () => void;
  tableTitle?: string;
  columns: DataColumn<T>[];
  hiddenColumns: Set<string>;
  onSaveColumns: (stagedHidden: Set<string>) => Promise<void>;
}

export function DataTableToolbar<T>({
  selectable,
  selectedKeys,
  sortedData,
  rowKey,
  handleSelectionChange,
  isMobile,
  activeFilterCount,
  clearAllFilters,
  customToolbarContent,
  searchable,
  search,
  setSearch,
  onSearchChange,
  setInternalPage,
  filterableColumns,
  showFilters,
  setShowFilters,
  columnFilters,
  setColumnFilters,
  totalCount,
  onFilterChange,
  customFilterContent,
  download,
  onDownload,
  handleCSVExport,
  handlePDFExport,
  tableTitle,
  columns,
  hiddenColumns,
  onSaveColumns,
}: DataTableToolbarProps<T>) {
  const [downloadAnchor, setDownloadAnchor] = React.useState<null | HTMLElement>(null);
  const [columnMenuAnchor, setColumnMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [stagedColumns, setStagedColumns] = React.useState<Set<string>>(new Set());
  const [isUpdatingColumns, setIsUpdatingColumns] = React.useState(false);

  const handleColumnMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setStagedColumns(new Set(hiddenColumns));
    setColumnMenuAnchor(event.currentTarget);
  };

  const hasChanges =
    stagedColumns.size !== hiddenColumns.size ||
    [...stagedColumns].some((col) => !hiddenColumns.has(col));

  const toggleColumnVisibility = (colId: string) => {
    setStagedColumns((prev) => {
      const newHidden = new Set(prev);
      if (newHidden.has(colId)) {
        newHidden.delete(colId);
      } else {
        newHidden.add(colId);
      }
      return newHidden;
    });
  };

  const handleUpdateColumns = async () => {
    setIsUpdatingColumns(true);
    try {
      await onSaveColumns(stagedColumns);
      setColumnMenuAnchor(null);
    } finally {
      setIsUpdatingColumns(false);
    }
  };

  return (
    <ToolbarContainer>
      {selectable && selectedKeys.size > 0 && (
        <SelectionBar>
          <Typography variant="body2" color="primary" fontWeight={600}>
            ({selectedKeys.size}) Rows Selected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ·
          </Typography>
          <ActionLink variant="body2" onClick={() => handleSelectionChange(new Set())}>
            Deselect All
          </ActionLink>
          <Typography variant="body2" color="text.secondary">
            ·
          </Typography>
          <ActionLink
            variant="body2"
            onClick={() => handleSelectionChange(new Set(sortedData.map(rowKey)))}
          >
            Select Max
          </ActionLink>

          {(activeFilterCount > 0 || customToolbarContent) && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 1, height: 16, alignSelf: 'center' }}
            />
          )}
        </SelectionBar>
      )}

      <ToolbarRow isMobile={isMobile}>
        <ToolbarLeft>
          {tableTitle ? (
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {tableTitle}
            </Typography>
          ) : (
            <RecordsText variant="caption">
              {totalCount ?? sortedData.length} record
              {(totalCount ?? sortedData.length) === 1 ? '' : 's'}
            </RecordsText>
          )}
          {activeFilterCount > 0 && (
            <Chip
              label={`${activeFilterCount} Active Filter${activeFilterCount > 1 ? 's' : ''}`}
              size="small"
              onDelete={clearAllFilters}
              color="primary"
              variant="outlined"
            />
          )}
        </ToolbarLeft>

        <ToolbarRight isMobile={isMobile}>
          {customToolbarContent}

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexShrink: 0 }}>
            {(filterableColumns.length > 0 || !!customFilterContent) && (
              <FilterButton
                size="small"
                onClick={() => setShowFilters(!showFilters)}
                color={showFilters ? 'primary' : 'default'}
              >
                <FilterListIcon fontSize="small" />
              </FilterButton>
            )}

            {searchable && (
              <SearchField
                isMobile={isMobile}
                size="small"
                placeholder="Search…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  onSearchChange?.(e.target.value);
                  setInternalPage(0);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSearch('');
                          onSearchChange?.('');
                        }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Box>

          <ActionGroup>
            <ExportButton
              size="small"
              variant="outlined"
              onClick={handleColumnMenuOpen}
              startIcon={<ViewColumnIcon fontSize="small" />}
              sx={{ minWidth: 0, px: 1 }}
            >
              Columns
            </ExportButton>
            <Menu
              anchorEl={columnMenuAnchor}
              open={Boolean(columnMenuAnchor)}
              onClose={() => setColumnMenuAnchor(null)}
              PaperProps={{
                style: {
                  maxHeight: 450,
                  width: 260,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 8,
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                  scrollbarWidth: 'thin',
                },
              }}
              MenuListProps={{ sx: { p: 0 } }}
            >
              <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                  Manage Columns
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  py: 1,
                  scrollbarWidth: 'thin',
                  '&::-webkit-scrollbar': { width: '6px' },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,.2)',
                    borderRadius: '4px',
                  },
                }}
              >
                {(() => {
                  const toggleableColumns = columns.filter((c) => c.label && c.id !== 'actions');
                  const visibleToggleableCount = toggleableColumns.filter(
                    (c) => !stagedColumns.has(c.id),
                  ).length;

                  return columns.map((col) => {
                    if (!col.label || col.id === 'actions') return null;
                    const isHidden = stagedColumns.has(col.id);
                    const isLastVisible = !isHidden && visibleToggleableCount === 1;

                    return (
                      <MenuItem
                        key={col.id}
                        onClick={() => {
                          if (!isLastVisible) toggleColumnVisibility(col.id);
                        }}
                        disabled={isUpdatingColumns || isLastVisible}
                        sx={{ py: 0.5, px: 2, minHeight: 36 }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Checkbox
                            checked={!isHidden}
                            disabled={isUpdatingColumns || isLastVisible}
                            size="small"
                            sx={{ p: 0.5 }}
                            disableRipple
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={col.label as React.ReactNode}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: 'text.secondary',
                            fontWeight: 500,
                          }}
                        />
                      </MenuItem>
                    );
                  });
                })()}
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.default',
                }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleUpdateColumns}
                  disabled={isUpdatingColumns || !hasChanges}
                  size="small"
                  sx={{ textTransform: 'none', fontWeight: 600, py: 0.75 }}
                >
                  {isUpdatingColumns ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    'Update Columns'
                  )}
                </Button>
              </Box>
            </Menu>

            {download && (
              <>
                <ExportButton
                  size="small"
                  variant="outlined"
                  startIcon={<FileDownloadIcon fontSize="small" />}
                  onClick={(e) => setDownloadAnchor(e.currentTarget)}
                >
                  Export
                </ExportButton>
                <Menu
                  anchorEl={downloadAnchor}
                  open={Boolean(downloadAnchor)}
                  onClose={() => setDownloadAnchor(null)}
                >
                  {onDownload ? (
                    <MenuItem
                      onClick={() => {
                        setDownloadAnchor(null);
                        onDownload();
                      }}
                    >
                      <ListItemIcon>
                        <TableChartIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Download {EXPORT_FORMATS.XLSX.toUpperCase()}</ListItemText>
                    </MenuItem>
                  ) : (
                    <MenuItem
                      onClick={() => {
                        handleCSVExport();
                        setDownloadAnchor(null);
                      }}
                    >
                      <ListItemIcon>
                        <TableChartIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Download CSV</ListItemText>
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      handlePDFExport();
                      setDownloadAnchor(null);
                    }}
                  >
                    <ListItemIcon>
                      <PictureAsPdfIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download {EXPORT_FORMATS.PDF.toUpperCase()}</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </ActionGroup>
        </ToolbarRight>
      </ToolbarRow>

      <Collapse in={showFilters}>
        <FilterWrapper>
          <Box
            sx={{
              display: 'flex',
              gap: 1.5,
              flexWrap: customFilterContent ? 'nowrap' : 'wrap',
              alignItems: 'center',
              width: '100%',
              overflowX: customFilterContent ? 'auto' : 'visible',
              pt: customFilterContent ? 2 : 0,
              pb: customFilterContent ? 1 : 0,
            }}
          >
            {filterableColumns.map((col) => {
              const options = col.filterOptions.map((opt) =>
                typeof opt === 'string' ? { label: opt, value: opt } : opt,
              );
              const value =
                options.find((o) => String(o.value) === String(columnFilters[col.id])) || null;

              return (
                <FormControl
                  key={col.id}
                  size="small"
                  sx={{ minWidth: 160, maxWidth: 200, flexShrink: 0 }}
                >
                  <Autocomplete
                    size="small"
                    options={options}
                    getOptionLabel={(option) => String(option.label || '')}
                    filterOptions={createFilterOptions({
                      matchFrom: 'any',
                      stringify: (option) => String(option.label || ''),
                      trim: true,
                    })}
                    value={value}
                    isOptionEqualToValue={(option, val) =>
                      String(option.value) === String(val.value)
                    }
                    onChange={(_, newValue) => {
                      const nextValue = newValue ? newValue.value : '';
                      const next = { ...columnFilters, [col.id]: String(nextValue) };
                      setColumnFilters(next);
                      onFilterChange?.(next);
                      setInternalPage(0);
                    }}
                    loading={col.isFilterLoading}
                    ListboxProps={{
                      sx: {
                        maxHeight: 200,
                        overflowY: 'auto',
                        scrollbarWidth: 'thin',
                      },
                    }}
                    renderOption={(props, option) => {
                      const { key: _key, ...rest } =
                        props as React.HTMLAttributes<HTMLLIElement> & { key?: React.Key };
                      return (
                        <li key={option.value || option.label} {...rest}>
                          {option.label}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={col.filterError ? 'Error loading...' : `All ${col.label}`}
                        error={!!col.filterError}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {col.isFilterLoading ? (
                                <CircularProgress color="inherit" size={16} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                </FormControl>
              );
            })}
            {customFilterContent}
          </Box>
        </FilterWrapper>
      </Collapse>
    </ToolbarContainer>
  );
}
