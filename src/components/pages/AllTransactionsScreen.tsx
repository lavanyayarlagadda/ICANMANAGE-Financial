import React from 'react';
import { Typography, Chip, useTheme } from '@mui/material';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu';
import { useAppSelector, useAppDispatch } from '@/store';
import { AllTransaction } from '@/interfaces/financials';
import { formatCurrency } from '@/utils/formatters';
import { openViewDialog, setActiveExportType, setIsReloading } from '@/store/slices/uiSlice';
import { useRef, useEffect, useCallback } from 'react';

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
  const { allTransactions } = useAppSelector((s) => s.financials);
  const user = useAppSelector((s) => s.auth.user);
  const { selectedTenantId } = useAppSelector((s) => s.tenant);
  const isMindPath =
    user?.company?.toLowerCase() === 'mindpath' ||
    selectedTenantId?.toLowerCase() === 'mindpath';
  const { actionTriggers } = useAppSelector(s => s.ui);

  const filteredTransactions = isMindPath 
    ? allTransactions.filter(t => t.transactionType !== 'PIP') 
    : allTransactions;

  // Refs to prevent mount calls
  const exportCount = useRef(actionTriggers.export);
  const printCount = useRef(actionTriggers.print);
  const reloadCount = useRef(actionTriggers.reload);

  const handleExport = useCallback((format: 'pdf' | 'xlsx') => {
    // For now, since AllTransactions might not have a server-side endpoint yet,
    // we'll just simulate a brief loader or tell the user.
    // If there was an endpoint, we'd call triggerExport here.
    dispatch(setActiveExportType(format));
    setTimeout(() => {
      dispatch(setActiveExportType(null));
      alert(`Exporting All Transactions as ${format.toUpperCase()}... (Endpoint pending)`);
    }, 1500);
  }, [dispatch]);

  useEffect(() => {
    if (actionTriggers.export > exportCount.current) {
      handleExport('xlsx');
      exportCount.current = actionTriggers.export;
    }
  }, [actionTriggers.export, handleExport]);

  useEffect(() => {
    if (actionTriggers.print > printCount.current) {
      handleExport('pdf');
      printCount.current = actionTriggers.print;
    }
  }, [actionTriggers.print, handleExport]);

  useEffect(() => {
    if (actionTriggers.reload > reloadCount.current) {
      const doReload = async () => {
        try {
          dispatch(setIsReloading(true));
          await new Promise(r => setTimeout(r, 1000)); // Simulate fetch
        } finally {
          dispatch(setIsReloading(false));
        }
      };
      doReload();
      reloadCount.current = actionTriggers.reload;
    }
  }, [actionTriggers.reload, dispatch]);

  const columns: DataColumn<AllTransaction>[] = [
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 60,
      render: (r) => (
        <RowActionMenu
          onView={() => dispatch(openViewDialog(r as unknown as Record<string, unknown>))}
        />
      ),
    },
    { id: 'effectiveDate', label: 'Effective Date', minWidth: 120, accessor: (r) => r.effectiveDate, render: (r) => r.effectiveDate },
    {
      id: 'transactionType',
      label: 'Category',
      minWidth: 140,
      accessor: (r) => r.transactionType ?? '',
      filterOptions: ['PAYMENT', 'RECOUPMENT', 'FORWARD_BALANCE', 'ADJUSTMENT', ...(!isMindPath ? ['PIP'] : [])],
      render: (r) => {
        const colors = transactionTypeColors[r.transactionType ?? ''] || { bg: '#F5F5F5', text: '#616161' };
        return (
          <Chip
            label={(r.transactionType ?? '').replace('_', ' ')}
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
    { id: 'status', label: 'Status', minWidth: 120, accessor: (r) => r.status, filterOptions: ['Reconciled', 'Open', 'Pending', 'Partially Applied', 'Disputed'], render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <DataTable
      columns={columns}
      data={filteredTransactions}
      rowKey={(r) => r.id}
      exportTitle="All Transactions"
      // selectable
      customToolbarContent={<RangeDropdown />}
      dictionaryId="all-transactions"
    />
  );
};

export default AllTransactionsScreen;
