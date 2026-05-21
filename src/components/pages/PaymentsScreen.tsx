import React from 'react';
import { Box, Typography, useTheme, CircularProgress } from '@mui/material';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu';
import { useAppSelector, useAppDispatch } from '@/store';
import { PaymentTransaction } from '@/interfaces/financials';
import { formatCurrency } from '@/utils/formatters';
import { openEditDialog, openConfirmDelete } from '@/store/slices/uiSlice';
import { setShowRemittanceDetail, setSelectedPaymentId, setRemittanceDetail, setRemittanceClaims, setSelectedClaimIndex } from '@/store/slices/financialsSlice';
import { setActiveExportType, setIsReloading, setIsDrillingDown as setGlobalDrillingDown, setIsGlobalFetching } from '@/store/slices/uiSlice';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { subMonths, format } from 'date-fns';
import { useSearchPaymentsQuery, useLazyExportPaymentsQuery, useLazyGetRemittanceClaimsQuery, useLazySearchServiceLinesQuery, useGetPaymentStatusQuery } from '@/store/api/financialsApi';
import { downloadFileFromBlob } from '@/utils/downloadHelper';
import { useRef } from 'react';

type DataWithArray<T> = { data?: T[] };

const PaymentsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { actionTriggers, isDrillingDown, activeExportType, isReloading } = useAppSelector(s => s.ui);

  // Unified search state
  const [queryParams, setQueryParams] = React.useState({
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
    status: queryParams.status,
    fromDate: queryParams.fromDate,
    toDate: queryParams.toDate
  });
  const { data: statusData } = useGetPaymentStatusQuery();

  const payments = data?.data?.content ?? [];
  const totalElements = data?.data?.totalElements ?? 0;

  const [triggerExport] = useLazyExportPaymentsQuery();
  const [triggerGetRemittance] = useLazyGetRemittanceClaimsQuery();
  const [triggerSearchServiceLines] = useLazySearchServiceLinesQuery();
  const statusOptions = React.useMemo(() => {
    if (!Array.isArray(statusData?.data)) {
      return [];
    }
    return statusData.data
      .filter((item) => item?.postingStatusMasterId != null && !!item?.postingStatus)
      .map((item) => item.postingStatus);
  }, [statusData]);

  const statusLabelToIdMap = React.useMemo(() => {
    const map = new Map<string, string>();
    (statusData?.data ?? []).forEach((item) => {
      if (item?.postingStatus && item?.postingStatusMasterId != null) {
        map.set(item.postingStatus, String(item.postingStatusMasterId));
      }
    });
    return map;
  }, [statusData]);

  const validStatusIds = React.useMemo(() => new Set(statusLabelToIdMap.values()), [statusLabelToIdMap]);

  React.useEffect(() => {
    if (!queryParams.status || statusOptions.length === 0) {
      return;
    }
    const hasSelectedStatus = validStatusIds.has(queryParams.status);
    if (!hasSelectedStatus) {
      setQueryParams((prev) => ({ ...prev, status: null, page: 0 }));
    }
  }, [queryParams.status, statusOptions, validStatusIds]);

  // Refs to prevent mount calls
  const exportCount = useRef(actionTriggers.export);
  const printCount = useRef(actionTriggers.print);
  const reloadCount = useRef(actionTriggers.reload);

  // Sync isFetching to global store - use a ref to track if we've already dispatched for the current state to avoid loops
  const lastFetching = React.useRef(false);
  React.useEffect(() => {
    if (isFetching !== lastFetching.current) {
      dispatch(setIsGlobalFetching(isFetching));
      lastFetching.current = isFetching;
    }
    return () => {
      if (lastFetching.current) {
        dispatch(setIsGlobalFetching(false));
      }
    };
  }, [isFetching, dispatch]);

  const handleExport = async (formatType: 'pdf' | 'xlsx') => {
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
  };

  // Handle Global Action Triggers from FinancialsTabs
  React.useEffect(() => {
    if (actionTriggers.export > exportCount.current) {
      handleExport('xlsx');
      exportCount.current = actionTriggers.export;
    }
  }, [actionTriggers.export]);

  React.useEffect(() => {
    if (actionTriggers.print > printCount.current) {
      handleExport('pdf');
      printCount.current = actionTriggers.print;
    }
  }, [actionTriggers.print]);

  React.useEffect(() => {
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

  const handleDrillDown = async (row: PaymentTransaction) => {
    try {
      dispatch(setGlobalDrillingDown(true));
      const identifier = row.transactionNo || row.adjustmentId || row.recoupmentId || row.id;
      dispatch(setSelectedPaymentId(identifier));

      // Fetch remittance claim details and service lines simultaneously
      const [claimResult, slResult] = await Promise.all([
        triggerGetRemittance(identifier).unwrap(),
        triggerSearchServiceLines({
          check: identifier,
          page: queryParams.page + 1,
          size: queryParams.size,
          sort: queryParams.sortField || 'lineNumber',
          desc: queryParams.sortOrder === 'desc'
        }).unwrap()
      ]);

      const claimResultData = (claimResult as DataWithArray<unknown>)?.data;
      const claimsArr = Array.isArray(claimResultData)
        ? claimResultData
        : (Array.isArray(claimResult) ? claimResult : (claimResult ? [claimResult] : []));

      // If no claims, just show empty
      if (claimsArr.length === 0) {
        dispatch(setRemittanceClaims([]));
        dispatch(setRemittanceDetail(null));
        dispatch(setShowRemittanceDetail(true));
        return;
      }

      // Update state
      dispatch(setRemittanceClaims(claimsArr));
      dispatch(setSelectedClaimIndex(0));
      dispatch(setRemittanceDetail(claimsArr[0]));
      dispatch(setShowRemittanceDetail(true));
    } catch (err) {
      console.error('Failed to fetch drill-down details:', err);
    } finally {
      dispatch(setGlobalDrillingDown(false));
    }
  };

  const handleRangeChange = (range: string) => {
    if (range.includes(' to ')) {
      const [from, to] = range.split(' to ');
      setQueryParams(prev => {
        if (prev.fromDate === from && prev.toDate === to) return prev;
        return { ...prev, fromDate: from, toDate: to, page: 0 };
      });
    }
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    if (filters.status !== undefined) {
      const selectedLabel = filters.status || '';
      const mappedStatusId = selectedLabel ? (statusLabelToIdMap.get(selectedLabel) ?? null) : null;
      const newStatus = mappedStatusId;
      setQueryParams(prev => prev.status === newStatus ? prev : { ...prev, status: newStatus, page: 0 });
    }
  };

  const handleSortChange = (colId: string, direction: 'asc' | 'desc') => {
    setQueryParams(prev => {
      if (prev.sortField === colId && prev.sortOrder === direction) return prev;
      return { ...prev, sortField: colId, sortOrder: direction, page: 0 };
    });
  };

  const columns: DataColumn<PaymentTransaction>[] = [
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 60,
      render: (r) => (
        <RowActionMenu
          onView={() => handleDrillDown(r)}
        />
      ),
    },
    { id: 'effectiveDate', label: 'Effective Date', minWidth: 120, accessor: (r) => r.effectiveDate ?? '', render: (r) => r.effectiveDate ?? '' },
    { id: 'type', label: 'Type', minWidth: 90, accessor: (r) => r.type ?? '', render: (r) => r.type ?? '' },
    {
      id: 'transactionNo',
      label: 'Transaction Number',
      minWidth: 220,
      accessor: (r) => r.transactionNo ?? '',
      render: (r) => (
        <Typography
          variant="body2"
          sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main', textDecoration: 'underline' } }}
        // onClick={() => handleDrillDown(r)}
        >
          {r.transactionNo}
        </Typography>
      ),
    },
    { id: 'payer', label: 'Payer', minWidth: 180, accessor: (r) => r.payer ?? '', render: (r) => r.payer ?? '' },
    { id: 'amount', label: 'Amount', minWidth: 110, align: 'right', accessor: (r) => r.amount ?? 0, render: (r) => <Box sx={{ fontFamily: 'monospace' }}>{formatCurrency(r.amount)}</Box> },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      accessor: (r) => r.status ?? '',
      filterOptions: statusOptions,
      render: (r) => <StatusBadge status={r.status} />
    },
  ];

  // if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, height: '60vh' }}><CircularProgress /></Box>;
  if (isError) return <Box sx={{ p: 4, color: 'error.main' }}>Error loading payments.</Box>;

  return (
    <Box sx={{ position: 'relative' }}>
      <DataTable
        columns={columns}
        data={payments}
        rowKey={(r) => r.id ?? ''}
        exportTitle="Payments"
        customToolbarContent={<RangeDropdown onChange={handleRangeChange} />}
        dictionaryId="all-transactions"
        serverSide
        totalElements={totalElements}
        page={queryParams.page}
        rowsPerPage={queryParams.size}
        sortCol={queryParams.sortField}
        sortDir={queryParams.sortOrder}
        onPageChange={(p) => setQueryParams(prev => prev.page === p ? prev : { ...prev, page: p })}
        onRowsPerPageChange={(s) => setQueryParams(prev => prev.size === s ? prev : { ...prev, size: s, page: 0 })}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        download={false}
      />
    </Box>
  );
};

export default PaymentsScreen;
