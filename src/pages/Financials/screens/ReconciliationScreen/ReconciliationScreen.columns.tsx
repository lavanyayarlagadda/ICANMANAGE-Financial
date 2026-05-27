import React, { useMemo } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ChatBubbleOutline } from '@mui/icons-material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { HighlightCell } from './ReconciliationScreen.styles';
import { ReconciliationRow, ReconciliationStatus } from './ReconciliationScreen.hook';

interface HeaderData {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  filterOptions?: string[];
  isCurrency?: boolean;
  highlightOnZero?: boolean;
  isLink?: boolean;
}

interface UseReconciliationColumnsProps {
  headerData: HeaderData[];
  view: ReconciliationStatus;
  setSelectedRow: (row: ReconciliationRow) => void;
  setSelectedTxNo: (txNo: string) => void;
  setEditDialogOpen: (open: boolean) => void;
  setAssignUserOpen: (open: boolean) => void;
  setCommentsRow: (row: ReconciliationRow) => void;
  setCommentsDialogOpen: (open: boolean) => void;
  setEftDialogOpen: (open: boolean) => void;
}

export const useReconciliationColumns = ({
  headerData,
  view,
  setSelectedRow,
  setSelectedTxNo,
  setEditDialogOpen,
  setAssignUserOpen,
  setCommentsRow,
  setCommentsDialogOpen,
  setEftDialogOpen,
}: UseReconciliationColumnsProps): DataColumn<ReconciliationRow>[] => {
  return useMemo(() => headerData
    .filter(h => h.id !== 'actions' || view !== 'reconciled')
    .map((header) => ({
      id: header.id as keyof ReconciliationRow,
      label: header.label,
      align: header.align,
      filterOptions: view === 'reconciled'
        ? (header.id === 'complexStatus' ? header.filterOptions : undefined)
        : header.filterOptions,
      accessor: (row) => {
        const val = row[header.id as keyof ReconciliationRow];
        if (Array.isArray(val)) return val.join(', ');
        return (val as string | number) ?? '';
      },
      render: (row) => {
        const val = row[header.id as keyof ReconciliationRow];

        if (header.id === 'actions') {
          return (
            <RowActionMenu
              onEdit={() => {
                setSelectedRow(row);
                setSelectedTxNo(row.transactionNo);
                setEditDialogOpen(true);
              }}
              extraActions={[
                {
                  label: 'Assign User',
                  icon: <PersonAddIcon fontSize="small" />,
                  onClick: () => {
                    setSelectedRow(row);
                    setSelectedTxNo(row.transactionNo);
                    setAssignUserOpen(true);
                  }
                },
                {
                  label: 'Comment',
                  icon: <ChatBubbleOutline fontSize="small" />,
                  onClick: () => {
                    setCommentsRow(row);
                    setCommentsDialogOpen(true);
                  }
                }
              ]}
            />
          );
        }

        if (header.isCurrency) {
          const content = (
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'inherit' }}>
              {formatCurrency(Number(val))}
            </Typography>
          );
          return header.highlightOnZero && Number(val) === 0 ? <HighlightCell>{formatCurrency(Number(val))}</HighlightCell> : content;
        }

        if (header.id === 'reconcileDate') {
          return (
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {formatDate(val as string)}
            </Typography>
          );
        }

        if (header.isLink) {
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: row.isEdited ? 'success.main' : 'primary.main',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                onClick={() => {
                  setSelectedRow(row);
                  setSelectedTxNo(String(val));
                  setEftDialogOpen(true);
                }}
              >
                {String(val ?? '-')}
              </Typography>
              {view === 'reconciled' && (
                <IconButton
                  size="small"
                  sx={{
                    p: 0.2,
                    color: 'text.disabled',
                    '&:hover': { color: 'primary.main', bgcolor: 'grey.100' }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommentsRow(row);
                    setCommentsDialogOpen(true);
                  }}
                >
                  <ChatBubbleOutline sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>
          );
        }

        return (val as string | number) ?? '-';
      }
    })), [
      headerData,
      view,
      setSelectedRow,
      setSelectedTxNo,
      setEditDialogOpen,
      setAssignUserOpen,
      setCommentsRow,
      setCommentsDialogOpen,
      setEftDialogOpen,
    ]);
};
