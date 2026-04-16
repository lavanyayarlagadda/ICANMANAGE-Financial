import React from 'react';
import {
  Box,
  Typography,
  Chip,
  InputAdornment,
  IconButton,
  Collapse,
  FormControl,
  Select,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
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
import { FilterableColumn } from './DataTable.hook';

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
  download?: boolean;
  onDownload?: () => void;
  handleCSVExport: () => void;
  handlePDFExport: () => void;
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
  download,
  onDownload,
  handleCSVExport,
  handlePDFExport,
}: DataTableToolbarProps<T>) {
  const [downloadAnchor, setDownloadAnchor] = React.useState<null | HTMLElement>(null);

  return (
    <ToolbarContainer>
      {selectable && selectedKeys.size > 0 && (
        <SelectionBar>
          <Typography variant="body2" color="primary" fontWeight={600}>
            ({selectedKeys.size}) Rows Selected
          </Typography>
          <Typography variant="body2" color="text.secondary">·</Typography>
          <ActionLink variant="body2" onClick={() => handleSelectionChange(new Set())}>
            Deselect All
          </ActionLink>
          <Typography variant="body2" color="text.secondary">·</Typography>
          <ActionLink variant="body2" onClick={() => handleSelectionChange(new Set(sortedData.map(rowKey)))}>
            Select Max
          </ActionLink>

          {(activeFilterCount > 0 || customToolbarContent) && (
            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 16, alignSelf: 'center' }} />
          )}
        </SelectionBar>
      )}

      <ToolbarRow isMobile={isMobile}>
        <ToolbarLeft>
          <RecordsText variant="caption">
            {totalCount ?? sortedData.length} records
          </RecordsText>
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
            {filterableColumns.length > 0 && (
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
                      <IconButton size="small" onClick={() => { setSearch(''); onSearchChange?.(''); }}>
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Box>

          <ActionGroup>
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
                    <MenuItem onClick={() => { setDownloadAnchor(null); onDownload(); }}>
                      <ListItemIcon><TableChartIcon fontSize="small" /></ListItemIcon>
                      <ListItemText>Download Excel</ListItemText>
                    </MenuItem>
                  ) : (
                    <MenuItem onClick={() => { handleCSVExport(); setDownloadAnchor(null); }}>
                      <ListItemIcon><TableChartIcon fontSize="small" /></ListItemIcon>
                      <ListItemText>Download CSV</ListItemText>
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => { handlePDFExport(); setDownloadAnchor(null); }}>
                    <ListItemIcon><PictureAsPdfIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Download PDF</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            )}
          </ActionGroup>
        </ToolbarRight>
      </ToolbarRow>

      <Collapse in={showFilters}>
        <FilterWrapper>
          {/* <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
            <FilterListIcon fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight={700} color="primary">Quick Filters:</Typography>
          </Box> */}
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {filterableColumns.map((col) => (
              <FormControl key={col.id} size="small" sx={{ minWidth: 140 }}>
                <Select
                  displayEmpty
                  value={columnFilters[col.id] || ''}
                  onChange={(e) => {
                    const next = { ...columnFilters, [col.id]: String(e.target.value) };
                    setColumnFilters(next);
                    onFilterChange?.(next);
                    setInternalPage(0);
                  }}
                  renderValue={(v) => v || <Typography variant="caption" color="text.secondary">All {col.label}</Typography>}
                  sx={{
                    height: 32,
                    fontSize: '0.8125rem',
                    backgroundColor: '#fff',
                    borderRadius: '6px',
                    '& .MuiSelect-select': { py: 0 }
                  }}
                >
                  <MenuItem value=""><em>Show All</em></MenuItem>
                  {col.filterOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
          </Box>
        </FilterWrapper>
      </Collapse>
    </ToolbarContainer>
  );
}
