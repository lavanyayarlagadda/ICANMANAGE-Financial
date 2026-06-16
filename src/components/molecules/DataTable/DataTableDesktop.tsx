import React from 'react';
import { TableHead, TableBody, TableRow, TableCell, Checkbox } from '@mui/material';
import EmptyState from '../../atoms/EmptyState/EmptyState';
import {
  ScrollableTableContainer,
  HeaderTableCell,
  StyledTableRow,
  StyledTableCell,
  StyledMuiTable,
  StyledTableSortLabel,
  LabelIconContainer,
  StyledBookButton,
  StyledBookIcon,
  EmptyStateCell,
  ExpandedCell,
  ExpandedContentBox,
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
  showColumnDividers?: boolean;
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
  showColumnDividers = false,
}: DataTableDesktopProps<T>) {
  return (
    <ScrollableTableContainer>
      <StyledMuiTable stickyHeader dense={dense}>
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
            {columns.map((col, colIndex) => {
              const showDivider = showColumnDividers && colIndex > 0;
              return (
                <HeaderTableCell
                  key={col.id}
                  align={col.align || 'center'}
                  minWidth={col.minWidth}
                  showDivider={showDivider}
                  sortDirection={sortCol === col.id ? sortDir : false}
                >
                  {isSortable(col) ? (
                    <StyledTableSortLabel
                      active={sortCol === col.id}
                      direction={sortCol === col.id ? sortDir : 'asc'}
                      onClick={() => handleSort(col.id)}
                      align={col.align}
                      isActive={sortCol === col.id}
                    >
                      <LabelIconContainer align={col.align}>
                        {col.label}
                        {descriptions && descriptions[col.id] && (
                          <StyledBookButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleHeaderClick(col.id);
                            }}
                          >
                            <StyledBookIcon />
                          </StyledBookButton>
                        )}
                      </LabelIconContainer>
                    </StyledTableSortLabel>
                  ) : (
                    <LabelIconContainer align={col.align}>
                      {col.label}
                      {descriptions && descriptions[col.id] && (
                        <StyledBookButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleHeaderClick(col.id);
                          }}
                        >
                          <StyledBookIcon />
                        </StyledBookButton>
                      )}
                    </LabelIconContainer>
                  )}
                </HeaderTableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <EmptyStateCell colSpan={columns.length + (selectable ? 1 : 0)} align="center">
                <EmptyState
                  icon="search"
                  title="No Records Found"
                  description="Adjust your filters or search terms to find what you're looking for."
                />
              </EmptyStateCell>
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
                    style={getRowStyle?.(row)}
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
                    {columns.map((col, colIndex) => {
                      const rowIndex = paginatedData.indexOf(row);
                      const cellMeta = col.getCellProps?.(row, rowIndex, paginatedData);
                      if (cellMeta?.skip) return null;
                      const showDivider = showColumnDividers && colIndex > 0;
                      const isRowSpan = !!(cellMeta?.rowSpan && cellMeta.rowSpan > 1);
                      return (
                        <StyledTableCell
                          key={col.id}
                          align={col.align || 'center'}
                          rowSpan={cellMeta?.rowSpan}
                          colSpan={cellMeta?.colSpan}
                          showDivider={showDivider}
                          isRowSpan={isRowSpan}
                        >
                          {col.render(row)}
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                  {expandedContent && expandedRows?.has(key) && (
                    <TableRow>
                      <ExpandedCell colSpan={columns.length + (selectable ? 1 : 0)}>
                        <ExpandedContentBox>{expandedContent(row)}</ExpandedContentBox>
                      </ExpandedCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </StyledMuiTable>
    </ScrollableTableContainer>
  );
}
