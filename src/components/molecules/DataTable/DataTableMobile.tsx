import React from 'react';
import { Checkbox } from '@mui/material';
import EmptyState from '../../atoms/EmptyState/EmptyState';
import {
  MobileOuterContainer,
  StyledMobileCard,
  MobileCardContent,
  MobileActionRow,
  MobileItemRow,
  MobileLabelBox,
  MobileLabelText,
  MobileValueBox,
  MobileDivider,
  MobileExpandedContainer,
  StyledBookButton,
  StyledBookIcon,
} from './DataTable.styles';
import { DataColumn } from './DataTable.hook';
import { TableDescriptions } from '@/services/descriptionService';

interface DataTableMobileProps<T> {
  paginatedData: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedKeys: Set<string>;
  handleSelectOne: (key: string, checked: boolean) => void;
  columns: DataColumn<T>[];
  descriptions?: TableDescriptions | null;
  handleHeaderClick: (colId: string) => void;
  expandedContent?: (row: T) => React.ReactNode;
  expandedRows?: Set<string>;
  getRowStyle?: (row: T) => React.CSSProperties;
}

export function DataTableMobile<T>({
  paginatedData,
  rowKey,
  onRowClick,
  selectable,
  selectedKeys,
  handleSelectOne,
  columns,
  descriptions,
  handleHeaderClick,
  expandedContent,
  expandedRows,
  getRowStyle,
}: DataTableMobileProps<T>) {
  const visibleColumns = columns.filter((c) => c.id !== 'actions' && !c.hideOnMobile);
  const actionsCol = columns.find((c) => c.id === 'actions');

  return (
    <MobileOuterContainer>
      {paginatedData.length === 0 ? (
        <EmptyState
          icon="search"
          title="No Records Found"
          description="Adjust your filters or search terms to find what you're looking for."
        />
      ) : (
        paginatedData.map((row) => {
          const key = rowKey(row);
          const isSelected = selectedKeys.has(key);
          const isExpanded = expandedRows?.has(key);

          return (
            <StyledMobileCard
              key={key}
              isSelected={isSelected}
              clickable={!!onRowClick}
              style={getRowStyle?.(row)}
              onClick={() => onRowClick?.(row)}
            >
              <MobileCardContent>
                {(actionsCol || selectable) && (
                  <MobileActionRow>
                    {selectable ? (
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        onChange={(e) => handleSelectOne(key, e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div />
                    )}
                    {actionsCol?.render?.(row)}
                  </MobileActionRow>
                )}

                {visibleColumns.map((col, idx) => (
                  <React.Fragment key={col.id}>
                    <MobileItemRow>
                      <MobileLabelBox>
                        <MobileLabelText variant="caption" color="text.secondary">
                          {col.label}
                        </MobileLabelText>
                        {descriptions?.[col.id] && (
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
                      </MobileLabelBox>
                      <MobileValueBox align={col.align}>{col.render(row)}</MobileValueBox>
                    </MobileItemRow>
                    {idx < visibleColumns.length - 1 && <MobileDivider />}
                  </React.Fragment>
                ))}

                {expandedContent && isExpanded && (
                  <MobileExpandedContainer>{expandedContent(row)}</MobileExpandedContainer>
                )}
              </MobileCardContent>
            </StyledMobileCard>
          );
        })
      )}
    </MobileOuterContainer>
  );
}
