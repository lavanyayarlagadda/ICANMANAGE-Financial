import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu';
import { useAppSelector, useAppDispatch } from '@/store';
import { PaymentTransaction } from '@/types/financials';
import { formatCurrency } from '@/utils/formatters';
import { openEditDialog, openConfirmDelete } from '@/store/slices/uiSlice';
import { setShowRemittanceDetail, setSelectedPaymentId, setRemittanceDetail, setRemittanceClaims, setSelectedClaimIndex } from '@/store/slices/financialsSlice';
import { setActiveExportType, setIsReloading, setIsDrillingDown as setGlobalDrillingDown, setIsGlobalFetching } from '@/store/slices/uiSlice';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { subMonths, format } from 'date-fns';
import { useSearchPaymentsQuery, useLazyExportPaymentsQuery, useLazyGetRemittanceClaimsQuery } from '@/store/api/financialsApi';
import { downloadFileFromBlob } from '@/utils/downloadHelper';
import { ScreenWrapper, TransactionNumber, MonospaceBox } from './PaymentsScreen.styles';

const PaymentsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { actionTriggers, isDrillingDown, activeExportType, isReloading } = useAppSelector(s => s.ui);

  // Unified search state
  const [queryParams, setQueryParams] = useState({
    page: 0,
    size: 10,
    sortField: '',
    sortOrder: 'desc' as 'asc' | 'desc',
    status: null as string | null,
    fromDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
    toDate: format(new Date(), 'yyyy-MM-dd'),
  });
  const { data, isLoading, isError, isFetching, refetch } = useSearchPaymentsQuery({
    page: queryParams.page + 1, // API is 1-indexed
    size: queryParams.size,
    sort: queryParams.sortField,
    desc: queryParams.sortOrder === 'desc',
    status: queryParams.status === 'All' ? null : queryParams.status,
    fromDate: queryParams.fromDate,
    toDate: queryParams.toDate
  });

  const payments = data?.data?.content ?? [];
  const totalElements = data?.data?.totalElements ?? 0;

  const [triggerExport] = useLazyExportPaymentsQuery();
  const [triggerGetRemittance] = useLazyGetRemittanceClaimsQuery();

  // Refs to prevent mount calls
  const exportCount = useRef(actionTriggers.export);
  const printCount = useRef(actionTriggers.print);
  const reloadCount = useRef(actionTriggers.reload);

  // Sync isFetching to global store
  useEffect(() => {
    dispatch(setIsGlobalFetching(isFetching));
    return () => {
      dispatch(setIsGlobalFetching(false));
    };
  }, [isFetching, dispatch]);

  const handleExport = useCallback(async (formatType: 'pdf' | 'xlsx') => {
    try {
      dispatch(setActiveExportType(formatType));
      const result = await triggerExport({
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate,
        format: formatType
      }).unwrap();

      if (result !== undefined) {
        downloadFileFromBlob(
          result as unknown as Blob,
          `Payments_Report_${queryParams.fromDate}_to_${queryParams.toDate}.${formatType}`
        );
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      dispatch(setActiveExportType(null));
    }
  }, [dispatch, queryParams.fromDate, queryParams.toDate, triggerExport]);

  // Handle Global Action Triggers from FinancialsTabs
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
          await refetch();
        } finally {
          dispatch(setIsReloading(false));
        }
      };
      doReload();
      reloadCount.current = actionTriggers.reload;
    }
  }, [actionTriggers.reload, refetch, dispatch]);

  const handleDrillDown = useCallback(async (row: PaymentTransaction) => {
    try {
      dispatch(setGlobalDrillingDown(true));
      dispatch(setSelectedPaymentId(row.transactionNo));

      const claimResult = await triggerGetRemittance(row.transactionNo).unwrap() as any;
      const claimsArr = Array.isArray(claimResult?.data) ? claimResult.data : (Array.isArray(claimResult) ? claimResult : (claimResult ? [claimResult] : []));

      if (claimsArr.length === 0) {
        dispatch(setRemittanceClaims([]));
        dispatch(setRemittanceDetail(null));
        dispatch(setShowRemittanceDetail(true));
        return;
      }

      dispatch(setRemittanceClaims(claimsArr));
      dispatch(setSelectedClaimIndex(0));
      dispatch(setRemittanceDetail(claimsArr[0]));
      dispatch(setShowRemittanceDetail(true));
    } catch (err) {
      console.error('Failed to fetch primary remittance details:', err);
    } finally {
      dispatch(setGlobalDrillingDown(false));
    }
  }, [dispatch, triggerGetRemittance]);

  const handleRangeChange = useCallback((range: string) => {
    if (range.includes(' to ')) {
      const [from, to] = range.split(' to ');
      setQueryParams(prev => {
        if (prev.fromDate === from && prev.toDate === to) return prev;
        return { ...prev, fromDate: from, toDate: to, page: 0 };
      });
    }
  }, []);

  const handleFilterChange = useCallback((filters: Record<string, string>) => {
    if (filters.status !== undefined) {
      const newStatus = filters.status || null;
      setQueryParams(prev => prev.status === newStatus ? prev : { ...prev, status: newStatus, page: 0 });
    }
  }, []);

  const handleSortChange = useCallback((colId: string, direction: 'asc' | 'desc') => {
    setQueryParams(prev => {
      if (prev.sortField === colId && prev.sortOrder === direction) return prev;
      return { ...prev, sortField: colId, sortOrder: direction, page: 0 };
    });
  }, []);

  const columns = useMemo<DataColumn<PaymentTransaction>[]>(() => [
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 60,
      render: (r) => (
        <RowActionMenu
          onView={() => handleDrillDown(r)}
          onEdit={() => dispatch(openEditDialog(r as unknown as Record<string, unknown>))}
          onDelete={() => dispatch(openConfirmDelete({ id: r.id, type: 'payment' }))}
          extraActions={[
            { label: 'Copy ID', icon: <ContentCopyIcon fontSize="small" />, onClick: () => navigator.clipboard.writeText(r.id) },
          ]}
        />
      ),
    },
    { id: 'effectiveDate', label: 'Effective Date', minWidth: 120 },
    { id: 'type', label: 'Type', minWidth: 90 },
    {
      id: 'transactionNo',
      label: 'Transaction Number',
      minWidth: 220,
      render: (r) => (
        <TransactionNumber variant="body2" onClick={() => handleDrillDown(r)}>
          {r.transactionNo}
        </TransactionNumber>
      ),
    },
    { id: 'payer', label: 'Payer', minWidth: 180 },
    { id: 'amount', label: 'Amount', minWidth: 110, align: 'right', render: (r) => <MonospaceBox>{formatCurrency(r.amount)}</MonospaceBox> },
    { id: 'openBalance', label: 'Open Balance', minWidth: 120, align: 'right', render: (r) => r.openBalance != null ? formatCurrency(r.openBalance) : 'N/A' },
    { id: 'status', label: 'Status', minWidth: 120, filterOptions: ['All', 'Reconciled', 'Partially Applied', 'Pending'], render: (r) => <StatusBadge status={r.status} /> },
  ], [dispatch, handleDrillDown]);

  const onPageChange = useCallback((p: number) => setQueryParams(prev => prev.page === p ? prev : { ...prev, page: p }), []);
  const onRowsPerPageChange = useCallback((s: number) => setQueryParams(prev => prev.size === s ? prev : { ...prev, size: s, page: 0 }), []);

  // if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, height: '60vh' }}><CircularProgress /></Box>;
  if (isError) return <Box sx={{ p: 4, color: 'error.main' }}>Error loading payments.</Box>;

  return (
    <ScreenWrapper>
      <DataTable
        columns={columns}
        data={payments}
        rowKey={(r) => r.id}
        exportTitle="Payments"
        customToolbarContent={<RangeDropdown onChange={handleRangeChange} />}
        dictionaryId="all-transactions"
        serverSide
        totalElements={totalElements}
        page={queryParams.page}
        rowsPerPage={queryParams.size}
        sortCol={queryParams.sortField}
        sortDir={queryParams.sortOrder}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        download={false}
      />
    </ScreenWrapper>
  );
};

export default PaymentsScreen;
