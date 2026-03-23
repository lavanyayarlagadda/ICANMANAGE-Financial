import React from 'react';
import { Box, Typography, Chip, useTheme } from '@mui/material';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu';
import { useAppSelector, useAppDispatch } from '@/store';
import { AllTransaction } from '@/types/financials';
import { formatCurrency } from '@/utils/formatters';
import { openViewDialog, openEditDialog, openConfirmDelete, setActiveExportType } from '@/store/slices/uiSlice';
import { useRef, useEffect } from 'react';

const transactionTypeColors: Record<string, { bg: string; text: string }> = {
  PAYMENT: { bg: '#E3F2FD', text: '#1565C0' },
  RECOUPMENT: { bg: '#FFEBEE', text: '#C62828' },
  FORWARD_BALANCE: { bg: '#FFF3E0', text: '#E65100' },
  ADJUSTMENT: { bg: '#F3E5F5', text: '#7B1FA2' },
  PIP: { bg: '#E8F5E9', text: '#2E7D32' },
};

const AllTransactionsScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const allTransactions = useAppSelector((s) => s.financials.allTransactions);
  const { actionTriggers } = useAppSelector(s => s.ui);

  // Refs to prevent mount calls
  const exportCount = useRef(actionTriggers.export);
  const printCount = useRef(actionTriggers.print);
  const reloadCount = useRef(actionTriggers.reload);

  const handleExport = (format: 'pdf' | 'xlsx') => {
    // For now, since AllTransactions might not have a server-side endpoint yet,
    // we'll just simulate a brief loader or tell the user.
    // If there was an endpoint, we'd call triggerExport here.
    dispatch(setActiveExportType(format));
    setTimeout(() => {
      dispatch(setActiveExportType(null));
      alert(`Exporting All Transactions as ${format.toUpperCase()}... (Endpoint pending)`);
    }, 1500);
  };

  useEffect(() => {
    if (actionTriggers.export > exportCount.current) {
      handleExport('xlsx');
      exportCount.current = actionTriggers.export;
    }
  }, [actionTriggers.export]);

  useEffect(() => {
    if (actionTriggers.print > printCount.current) {
      handleExport('pdf');
      printCount.current = actionTriggers.print;
    }
  }, [actionTriggers.print]);

  useEffect(() => {
    if (actionTriggers.reload > reloadCount.current) {
      // Simulate reload or fetch if using RTK Query
      reloadCount.current = actionTriggers.reload;
    }
  }, [actionTriggers.reload]);

  const columns: DataColumn<AllTransaction>[] = [
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 60,
      render: (r) => (
        <RowActionMenu
          onView={() => dispatch(openViewDialog(r as unknown as Record<string, unknown>))}
          onEdit={() => dispatch(openEditDialog(r as unknown as Record<string, unknown>))}
          onDelete={() => dispatch(openConfirmDelete({ id: r.id, type: 'transaction' }))}
        />
      ),
    },
    { id: 'effectiveDate', label: 'Effective Date', minWidth: 120, accessor: (r) => r.effectiveDate, render: (r) => r.effectiveDate },
    {
      id: 'transactionType',
      label: 'Category',
      minWidth: 140,
      accessor: (r) => r.transactionType,
      filterOptions: ['PAYMENT', 'RECOUPMENT', 'FORWARD_BALANCE', 'ADJUSTMENT', 'PIP'],
      render: (r) => {
        const colors = transactionTypeColors[r.transactionType] || { bg: '#F5F5F5', text: '#616161' };
        return (
          <Chip
            label={r.transactionType.replace('_', ' ')}
            size="small"
            sx={{ backgroundColor: colors.bg, color: colors.text, fontWeight: 600, fontSize: '0.7rem' }}
          />
        );
      },
    },
    { id: 'type', label: 'Type', minWidth: 100, accessor: (r) => r.type, render: (r) => r.type },
    { id: 'description', label: 'Description', minWidth: 240, accessor: (r) => r.description, render: (r) => r.description },
    { id: 'sourceProvider', label: 'Source / Provider', minWidth: 180, accessor: (r) => r.sourceProvider, render: (r) => r.sourceProvider },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 120,
      align: 'right',
      accessor: (r) => r.amount,
      render: (r) => (
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 600,
            color: r.amount < 0 ? theme.palette.error.main : theme.palette.text.primary,
          }}
        >
          {formatCurrency(r.amount)}
        </Typography>
      ),
    },
    {
      id: 'openBalance',
      label: 'Open Balance',
      minWidth: 120,
      align: 'right',
      accessor: (r) => r.openBalance ?? 0,
      render: (r) => r.openBalance != null ? (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.openBalance)}</Typography>
      ) : '–',
    },
    { id: 'status', label: 'Status', minWidth: 120, accessor: (r) => r.status, filterOptions: ['Reconciled', 'Open', 'Pending', 'Partially Applied', 'Disputed'], render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <DataTable
      columns={columns}
      data={allTransactions}
      rowKey={(r) => r.id}
      exportTitle="All Transactions"
      // selectable
      customToolbarContent={<RangeDropdown />}
      dictionaryId="all-transactions"
    />
  );
};

export default AllTransactionsScreen;
