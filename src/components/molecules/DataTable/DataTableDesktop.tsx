import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Box,
  TableSortLabel,
  IconButton,
  useTheme,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmptyState from '../../atoms/EmptyState/EmptyState';
import {
  ScrollableTableContainer,
  HeaderTableCell,
  StyledTableRow,
} from './DataTable.styles';
import { DataColumn, SortDirection } from './DataTable.hook';
import { TableDescriptions } from '@/services/descriptionService';

interface DataTableDesktopProps<T> {
  selectable?: boolean;
  isIndeterminate: boolean;
  isAllSelected: boolean;
  handleSelectAll: (checked: boolean) => void;
  columns: DataColumn<T>[];
  sortCol: string | null;
  sortDir: SortDirection;
  isSortable: (col: DataColumn<T>) => boolean;
  handleSort: (colId: string) => void;
  descriptions?: TableDescriptions | null;
  handleHeaderClick: (colId: string) => void;
  paginatedData: T[];
  selectedKeys: Set<string>;
  onRowClick?: (row: T) => void;
  rowKey: (row: T) => string;
  handleSelectOne: (key: string, checked: boolean) => void;
  expandedContent?: (row: T) => React.ReactNode;
  expandedRows?: Set<string>;
  disableHover?: boolean;
  getRowStyle?: (row: T) => React.CSSProperties;
  dense?: boolean;
}

export function DataTableDesktop<T>({
  selectable,
  isIndeterminate,
  isAllSelected,
  handleSelectAll,
  columns,
  sortCol,
  sortDir,
  isSortable,
  handleSort,
  descriptions,
  handleHeaderClick,
  paginatedData,
  selectedKeys,
  onRowClick,
  rowKey,
  handleSelectOne,
  expandedContent,
  expandedRows,
  disableHover = false,
  getRowStyle,
  dense = false,
}: DataTableDesktopProps<T>) {
  const theme = useTheme();

  return (
    <ScrollableTableContainer>
      <Table
        stickyHeader
        size={dense ? "small" : "medium"}
        sx={{
          minWidth: 'max-content',
          '& .MuiTableCell-root': { p: dense ? 0.5 : 1, minHeight: dense ? 32 : 40 },
          '& .MuiTableHead-root .MuiTableCell-root': { py: dense ? 0.5 : 1, minHeight: dense ? 40 : 48 }
        }}
      >
        <TableHead>
          <TableRow>
            {selectable && (
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
              <HeaderTableCell
                key={col.id}
                align={col.align || 'center'}
                sx={{ minWidth: col.minWidth, whiteSpace: 'nowrap' }}
                sortDirection={sortCol === col.id ? sortDir : false}
              >
                {isSortable(col) ? (
                  <TableSortLabel
                    active={sortCol === col.id}
                    direction={sortCol === col.id ? sortDir : 'asc'}
                    onClick={() => handleSort(col.id)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: (col.align || 'center') === 'center' ? 'center' : col.align === 'right' ? 'flex-end' : 'flex-start',
                      '& .MuiTableSortLabel-icon': {
                        opacity: sortCol === col.id ? 1 : 0.3,
                        marginLeft: '4px',
                        marginRight: 0,
                        order: 1, // Ensure icon is always after label
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {col.label}
                      {descriptions && descriptions[col.id] && (
                        <IconButton
                          size="small"
                          sx={{ p: 0.2, ml: 0.5 }}
                          onClick={(e) => { e.stopPropagation(); handleHeaderClick(col.id); }}
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
                        onClick={(e) => { e.stopPropagation(); handleHeaderClick(col.id); }}
                      >
                        <MenuBookIcon sx={{ fontSize: 13, color: theme.palette.primary.main, opacity: 0.7 }} />
                      </IconButton>
                    )}
                  </Box>
                )}
              </HeaderTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (selectable ? 1 : 0)} align="center" sx={{ p: 0 }}>
                <EmptyState
                  icon="search"
                  title="No Records Found"
                  description="Adjust your filters or search terms to find what you're looking for."
                />
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row) => {
              const key = rowKey(row);
              return (
                <React.Fragment key={key}>
                  <StyledTableRow
                    hover={!disableHover}
                    clickable={!!onRowClick}
                    isSelected={selectedKeys.has(key)}
                    onClick={() => onRowClick?.(row)}
                    sx={{ ...getRowStyle?.(row) }}
                  >
                    {selectable && (
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
                      <TableCell key={col.id} align={col.align || 'center'}>
                        {col.render(row)}
                      </TableCell>
                    ))}
                  </StyledTableRow>
                  {expandedContent && expandedRows?.has(key) && (
                    <TableRow>
                      <TableCell colSpan={columns.length + (selectable ? 1 : 0)} sx={{ p: 0, border: 0 }}>
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
    </ScrollableTableContainer>
  );
}
