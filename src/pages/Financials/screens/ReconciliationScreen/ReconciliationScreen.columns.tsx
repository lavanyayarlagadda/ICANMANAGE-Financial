import React, { useMemo } from 'react';
import { ChatBubbleOutline } from '@mui/icons-material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { formatCurrency, formatDate } from '@/utils/formatters';
import {
  HighlightCell,
  CurrencyTypography,
  DateTypography,
  LinkContainerBox,
  LinkTextTypography,
  CommentIconButton,
  StyledChatBubbleIcon,
} from './ReconciliationScreen.styles';
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
  return useMemo(
    () =>
      headerData
        .filter((h) => h.id !== 'actions' || view !== 'reconciled')
        .map((header) => ({
          id: header.id as keyof ReconciliationRow,
          label: header.label,
          align: header.align,
          filterOptions:
            view === 'reconciled'
              ? header.id === 'complexStatus'
                ? header.filterOptions
                : undefined
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
                      },
                    },
                    {
                      label: 'Comment',
                      icon: <ChatBubbleOutline fontSize="small" />,
                      onClick: () => {
                        setCommentsRow(row);
                        setCommentsDialogOpen(true);
                      },
                    },
                  ]}
                />
              );
            }

            if (header.isCurrency) {
              const content = (
                <CurrencyTypography variant="body2">
                  {formatCurrency(Number(val))}
                </CurrencyTypography>
              );
              return header.highlightOnZero && Number(val) === 0 ? (
                <HighlightCell>{formatCurrency(Number(val))}</HighlightCell>
              ) : (
                content
              );
            }

            if (header.id === 'reconcileDate') {
              return <DateTypography variant="body2">{formatDate(val as string)}</DateTypography>;
            }

            if (header.isLink) {
              return (
                <LinkContainerBox>
                  <LinkTextTypography
                    variant="body2"
                    isEdited={row.isEdited}
                    onClick={() => {
                      setSelectedRow(row);
                      setSelectedTxNo(String(val));
                      setEftDialogOpen(true);
                    }}
                  >
                    {String(val ?? '-')}
                  </LinkTextTypography>
                  {view === 'reconciled' && (
                    <CommentIconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCommentsRow(row);
                        setCommentsDialogOpen(true);
                      }}
                    >
                      <StyledChatBubbleIcon />
                    </CommentIconButton>
                  )}
                </LinkContainerBox>
              );
            }

            return (val as string | number) ?? '-';
          },
        })),
    [
      headerData,
      view,
      setSelectedRow,
      setSelectedTxNo,
      setEditDialogOpen,
      setAssignUserOpen,
      setCommentsRow,
      setCommentsDialogOpen,
      setEftDialogOpen,
    ],
  );
};
