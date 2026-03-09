import React from 'react';
import { Box, Typography, Chip, useTheme } from '@mui/material';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import StatusBadge from '@/components/atoms/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu';
import { useAppSelector, useAppDispatch } from '@/store';
import { OtherAdjustmentRecord } from '@/types/financials';
import { formatCurrency } from '@/utils/formatters';
import { openViewDialog, openEditDialog, openConfirmDelete } from '@/store/slices/uiSlice';

const adjustmentTypeColors: Record<string, string> = {
  'WRITE-OFF': '#C62828',
  'CREDIT': '#1565C0',
  'INTEREST': '#F57F17',
  'CONTRACTUAL': '#7B1FA2',
  'REFUND': '#00838F',
  'TRANSFER': '#E65100',
  'RECLASSIFICATION': '#37474F',
  'CHARITY': '#2E7D32',
};

const OtherAdjustmentsScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const otherAdjustments = useAppSelector((s) => s.financials.otherAdjustments);

  const columns: DataColumn<OtherAdjustmentRecord>[] = [
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 60,
      render: (r) => (
        <RowActionMenu
          onView={() => dispatch(openViewDialog(r as unknown as Record<string, unknown>))}
          onEdit={() => dispatch(openEditDialog(r as unknown as Record<string, unknown>))}
          onDelete={() => dispatch(openConfirmDelete({ id: r.id, type: 'adjustment' }))}
        />
      ),
    },
    { id: 'adjustmentId', label: 'Adjustment ID', minWidth: 140, accessor: (r) => r.adjustmentId, render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.adjustmentId}</Typography> },
    { id: 'effectiveDate', label: 'Effective Date', minWidth: 120, accessor: (r) => r.effectiveDate, render: (r) => r.effectiveDate },
    {
      id: 'type',
      label: 'Type',
      minWidth: 140,
      accessor: (r) => r.type,
      filterOptions: ['WRITE-OFF', 'CREDIT', 'INTEREST', 'CONTRACTUAL', 'REFUND', 'TRANSFER', 'RECLASSIFICATION', 'CHARITY'],
      render: (r) => (
        <Chip
          label={r.type}
          size="small"
          sx={{
            backgroundColor: `${adjustmentTypeColors[r.type] || '#616161'}18`,
            color: adjustmentTypeColors[r.type] || '#616161',
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        />
      ),
    },
    { id: 'description', label: 'Description', minWidth: 240, accessor: (r) => r.description, render: (r) => r.description },
    { id: 'sourceProvider', label: 'Source / Provider', minWidth: 160, accessor: (r) => r.sourceProvider, render: (r) => r.sourceProvider },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 120,
      align: 'right',
      accessor: (r) => r.amount,
      render: (r) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: r.amount < 0 ? theme.palette.error.main : r.amount > 0 ? theme.palette.success.main : theme.palette.text.primary }}>
          {formatCurrency(r.amount)}
        </Typography>
      ),
    },
    { id: 'referenceId', label: 'Reference ID', minWidth: 110, accessor: (r) => r.referenceId, render: (r) => r.referenceId },
    { id: 'status', label: 'Status', minWidth: 120, accessor: (r) => r.status, filterOptions: ['Applied', 'Pending', 'Under Review'], render: (r) => <StatusBadge status={r.status} /> },
  ];

  return <DataTable columns={columns} data={otherAdjustments} rowKey={(r) => r.id} exportTitle="Other Adjustments" />;
};

export default OtherAdjustmentsScreen;
