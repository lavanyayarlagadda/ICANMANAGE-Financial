import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Box,
  Typography,
  TableSortLabel,
  IconButton,
  useTheme,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
}: DataTableDesktopProps<T>) {
  const theme = useTheme();

  return (
    <ScrollableTableContainer>
      <Table stickyHeader size="small" sx={{ '& .MuiTableCell-root': { p: 1, minHeight: 40 }, '& .MuiTableHead-root .MuiTableCell-root': { py: 1, minHeight: 48 } }}>
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
              <TableCell colSpan={columns.length + (selectable ? 1 : 0)} align="center" sx={{ py: 4 }}>
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
                  <StyledTableRow
                    clickable={!!onRowClick}
                    isSelected={selectedKeys.has(key)}
                    onClick={() => onRowClick?.(row)}
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
                      <TableCell key={col.id} align={col.align || 'left'}>
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
