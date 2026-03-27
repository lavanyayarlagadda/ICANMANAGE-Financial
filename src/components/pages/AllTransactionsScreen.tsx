import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import { Typography, Chip, useTheme } from '@mui/material';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu';
import { useAppSelector, useAppDispatch } from '@/store';
import { AllTransaction } from '@/types/financials';
import { formatCurrency } from '@/utils/formatters';
import { openViewDialog, openEditDialog, openConfirmDelete, setActiveExportType } from '@/store/slices/uiSlice';
import { AmountText, BalanceText, transactionTypeColors } from './AllTransactionsScreen.styles';

const AllTransactionsScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { allTransactions } = useAppSelector((s) => s.financials);
  const user = useAppSelector((s) => s.auth.user);
  const isMindPath = user?.company?.toLowerCase() === 'mindpath';
  const { actionTriggers } = useAppSelector(s => s.ui);

  const filteredTransactions = useMemo(() => isMindPath 
    ? allTransactions.filter(t => t.transactionType !== 'PIP') 
    : allTransactions, [allTransactions, isMindPath]);

  // Refs to prevent mount calls
  const exportCount = useRef(actionTriggers.export);
  const printCount = useRef(actionTriggers.print);
  const reloadCount = useRef(actionTriggers.reload);

  const handleExport = useCallback((formatType: 'pdf' | 'xlsx') => {
    dispatch(setActiveExportType(formatType));
    setTimeout(() => {
      dispatch(setActiveExportType(null));
      alert(`Exporting All Transactions as ${formatType.toUpperCase()}... (Endpoint pending)`);
    }, 1500);
  }, [dispatch]);

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

  const columns = useMemo<DataColumn<AllTransaction>[]>(() => [
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
    { id: 'effectiveDate', label: 'Effective Date', minWidth: 120 },
    {
      id: 'transactionType',
      label: 'Category',
      minWidth: 140,
      filterOptions: ['PAYMENT', 'RECOUPMENT', 'FORWARD_BALANCE', 'ADJUSTMENT', ...(!isMindPath ? ['PIP'] : [])],
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
    { id: 'type', label: 'Type', minWidth: 100 },
    { id: 'description', label: 'Description', minWidth: 240 },
    { id: 'sourceProvider', label: 'Source / Provider', minWidth: 180 },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 120,
      align: 'right',
      render: (r) => (
        <AmountText variant="body2" amount={r.amount}>
          {formatCurrency(r.amount)}
        </AmountText>
      ),
    },
    {
      id: 'openBalance',
      label: 'Open Balance',
      minWidth: 120,
      align: 'right',
      render: (r) => r.openBalance != null ? (
        <BalanceText variant="body2">{formatCurrency(r.openBalance)}</BalanceText>
      ) : '–',
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120, 
      filterOptions: ['Reconciled', 'Open', 'Pending', 'Partially Applied', 'Disputed'], 
      render: (r) => <StatusBadge status={r.status} /> 
    },
  ], [dispatch, isMindPath]);

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
