import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Typography,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
  const theme = useTheme();
  const visibleColumns = columns.filter((c) => c.id !== 'actions' && !c.hideOnMobile);
  const actionsCol = columns.find((c) => c.id === 'actions');

  return (
    <Box sx={{ p: 1.5 }}>
      {paginatedData.map((row) => {
        const key = rowKey(row);
        const isSelected = selectedKeys.has(key);
        const isExpanded = expandedRows?.has(key);

        return (
          <Card
            key={key}
            sx={{
              mb: 1.5,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              boxShadow: isSelected ? `0 0 0 2px ${theme.palette.primary.light}20` : 'none',
              backgroundColor: isSelected ? '#F4F9FF' : 'background.paper',
              transition: 'all 0.2s ease',
              cursor: onRowClick ? 'pointer' : 'default',
              ...getRowStyle?.(row),
            }}
            onClick={() => onRowClick?.(row)}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              {(actionsCol || selectable) && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  {selectable ? (
                    <Checkbox
                      size="small"
                      checked={isSelected}
                      onChange={(e) => handleSelectOne(key, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : <Box />}
                  {actionsCol?.render?.(row)}
                </Box>
              )}

              {visibleColumns.map((col, idx) => (
                <Box key={col.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 0.75, gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 100 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {col.label}
                      </Typography>
                      {descriptions?.[col.id] && (
                        <IconButton
                          size="small"
                          sx={{ p: 0.2 }}
                          onClick={(e) => { e.stopPropagation(); handleHeaderClick(col.id); }}
                        >
                          <MenuBookIcon sx={{ fontSize: 12, color: theme.palette.primary.main, opacity: 0.7 }} />
                        </IconButton>
                      )}
                    </Box>
                    <Box sx={{ textAlign: 'right', flex: 1 }}>
                      {col.render(row)}
                    </Box>
                  </Box>
                  {idx < visibleColumns.length - 1 && <Divider sx={{ opacity: 0.5, my: 0.25 }} />}
                </Box>
              ))}

              {expandedContent && isExpanded && (
                <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px dashed ${theme.palette.divider}` }}>
                  {expandedContent(row)}
                </Box>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}

