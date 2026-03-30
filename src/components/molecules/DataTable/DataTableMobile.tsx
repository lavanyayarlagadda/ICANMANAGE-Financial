import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { DataColumn } from './DataTable.hook';

interface DataTableMobileProps<T> {
  paginatedData: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedKeys: Set<string>;
  handleSelectOne: (key: string, checked: boolean) => void;
  columns: DataColumn<T>[];
  descriptions?: Record<string, string>;
  handleHeaderClick: (colId: string) => void;
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
}: DataTableMobileProps<T>) {
  const theme = useTheme();
  const visibleColumns = columns.filter((c) => c.id !== 'actions' && !c.hideOnMobile);
  const actionsCol = columns.find((c) => c.id === 'actions');

  return (
    <Box sx={{ p: 1 }}>
      {paginatedData.map((row) => {
        const key = rowKey(row);
        return (
          <Card key={key} sx={{ mb: 1.5, border: `1px solid ${theme.palette.divider}`, boxShadow: 'none' }} onClick={() => onRowClick?.(row)}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                {selectable && (
                  <Checkbox
                    size="small"
                    checked={selectedKeys.has(key)}
                    onChange={(e) => handleSelectOne(key, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                {actionsCol?.render?.(row)}
              </Box>
              {visibleColumns.map((col) => (
                <Box key={col.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" fontWeight={600}>{col.label}</Typography>
                    {descriptions?.[col.id] && (
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleHeaderClick(col.id); }}
                      >
                        <MenuBookIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                    )}
                  </Box>
                  <Box sx={{ ml: 2, textAlign: 'right' }}>{col.render(row)}</Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
