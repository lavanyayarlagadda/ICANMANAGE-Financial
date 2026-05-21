import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Typography, useTheme, Grid } from '@mui/material';
import RowActionMenu from '@/components/molecules/RowActionMenu';
import { useAppSelector, useAppDispatch } from '@/store';
import { FeeScheduleVariance, PaymentVariance } from '@/types/financials';
import { formatCurrency } from '@/utils/formatters';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import SummaryCard from '@/components/atoms/SummaryCard';
import { setActiveExportType, setIsReloading, setIsGlobalFetching, setIsDrillingDown as setGlobalDrillingDown } from '@/store/slices/uiSlice';
import { setShowRemittanceDetail, setSelectedPaymentId, setRemittanceDetail, setRemittanceClaims, setSelectedClaimIndex } from '@/store/slices/financialsSlice';
import {
  useSearchFeeScheduleVarianceQuery,
  useGetFeeScheduleVarianceSummaryQuery,
  useSearchPaymentVarianceQuery,
  useGetPaymentVarianceSummaryQuery,
  useLazyGetRemittanceClaimsQuery,
  useLazySearchServiceLinesQuery,
  useLazyExportFeeScheduleVarianceQuery,
  useLazyExportPaymentVarianceQuery
} from '@/store/api/financialsApi';
import { subMonths, format } from 'date-fns';
import { RemittanceDetail } from '@/interfaces/financials';

type DataWithArray<T> = { data?: T[] };
type VarianceRow = FeeScheduleVariance | PaymentVariance;

const VarianceScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { activeSubTab, actionTriggers } = useAppSelector((s) => s.ui);

  const [queryParams, setQueryParams] = useState({
    page: 0,
    size: 10,
    sortField: 'paymentDate',
    sortOrder: 'desc' as 'asc' | 'desc',
    fromDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
    toDate: format(new Date(), 'yyyy-MM-dd'),
  });

  // Fee Schedule Variance Data
  const {
    data: feeData,
    isFetching: feeFetching,
    refetch: refetchFee
  } = useSearchFeeScheduleVarianceQuery({
    page: queryParams.page + 1,
    size: queryParams.size,
    sort: queryParams.sortField,
    desc: queryParams.sortOrder === 'desc',
    fromDate: queryParams.fromDate,
    toDate: queryParams.toDate
  }, { skip: activeSubTab !== 0 });

  const { data: feeSummaryData } = useGetFeeScheduleVarianceSummaryQuery({
    fromDate: queryParams.fromDate,
    toDate: queryParams.toDate
  }, { skip: activeSubTab !== 0 });

  // Payment Variance Data
  const {
    data: paymentData,
    isFetching: paymentFetching,
    refetch: refetchPayment
  } = useSearchPaymentVarianceQuery({
    page: queryParams.page + 1,
    size: queryParams.size,
    sort: queryParams.sortField,
    desc: queryParams.sortOrder === 'desc',
    fromDate: queryParams.fromDate,
    toDate: queryParams.toDate
  }, { skip: activeSubTab !== 1 });

  const { data: paymentSummaryData } = useGetPaymentVarianceSummaryQuery({
    fromDate: queryParams.fromDate,
    toDate: queryParams.toDate
  }, { skip: activeSubTab !== 1 });

  const [triggerGetRemittance] = useLazyGetRemittanceClaimsQuery();
  const [triggerSearchServiceLines] = useLazySearchServiceLinesQuery();
  const [triggerExportFee] = useLazyExportFeeScheduleVarianceQuery();
  const [triggerExportPayment] = useLazyExportPaymentVarianceQuery();

  const handleDrillDown = async (row: VarianceRow) => {
    try {
      dispatch(setGlobalDrillingDown(true));
const identifier =
  row.transactionNo ??
  row.claimId ??
  row.adjustmentId ??
  row.id ??
  '';

if (!identifier) {
  console.error('No identifier found');
  return;
}

dispatch(setSelectedPaymentId(identifier));

const [claimResult] = await Promise.all([
  triggerGetRemittance({
    claimId: identifier
  }).unwrap(),
  triggerSearchServiceLines({
    check: identifier,
    page: queryParams.page + 1,
    size: queryParams.size,
    sort: queryParams.sortField || 'lineNumber',
    desc: queryParams.sortOrder === 'desc'
  }).unwrap()
]);

      const claimResultData =
  (claimResult as DataWithArray<RemittanceDetail>)?.data;

const claimsArr: RemittanceDetail[] = Array.isArray(claimResultData)
  ? claimResultData
  : Array.isArray(claimResult)
    ? (claimResult as RemittanceDetail[])
    : claimResult
      ? [claimResult as RemittanceDetail]
      : [];

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
      console.error('Failed to fetch drill-down details:', err);
    } finally {
      dispatch(setGlobalDrillingDown(false));
    }
  };

  const isFetching = activeSubTab === 0 ? feeFetching : paymentFetching;

  useEffect(() => {
    dispatch(setIsGlobalFetching(isFetching));
    return () => { dispatch(setIsGlobalFetching(false)); };
  }, [isFetching, dispatch]);

  const exportCount = useRef(actionTriggers.export);
  const printCount = useRef(actionTriggers.print);
  const reloadCount = useRef(actionTriggers.reload);

  const handleExport = useCallback(async (format: 'pdf' | 'xlsx') => {
    try {
      dispatch(setActiveExportType(format));

      const params = {
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate,
        format
      };

      let blob: Blob;
      if (activeSubTab === 0) {
        blob = await triggerExportFee(params).unwrap();
      } else {
        blob = await triggerExportPayment(params).unwrap();
      }

      // Create a URL for the blob and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeSubTab === 0 ? 'fee-schedule-variance' : 'payment-variance'}-${queryParams.fromDate}-to-${queryParams.toDate}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export. Please try again.');
    } finally {
      dispatch(setActiveExportType(null));
    }
  }, [dispatch, queryParams.fromDate, queryParams.toDate, activeSubTab, triggerExportFee, triggerExportPayment]);

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
        dispatch(setIsReloading(true));
        if (activeSubTab === 0) await refetchFee();
        else await refetchPayment();
        dispatch(setIsReloading(false));
      };
      doReload();
      reloadCount.current = actionTriggers.reload;
    }
  }, [actionTriggers.reload, activeSubTab, refetchFee, refetchPayment, dispatch]);

  const handleRangeChange = (range: string) => {
    if (range.includes(' to ')) {
      const [from, to] = range.split(' to ');
      setQueryParams(prev => ({ ...prev, fromDate: from, toDate: to, page: 0 }));
    }
  };

  const handleSortChange = (colId: string, direction: 'asc' | 'desc') => {
    setQueryParams(prev => ({ ...prev, sortField: colId, sortOrder: direction, page: 0 }));
  };

  const feeSummary = feeSummaryData?.data;
  const paymentSummary = paymentSummaryData?.data;

  const summaryValues = activeSubTab === 0 ? {
    totalExpected: feeSummary?.totalExpected ?? 0,
    totalActual: feeSummary?.totalActualAllowed ?? 0,
    totalLeakage: feeSummary?.totalLeakage ?? 0,
    label2: 'TOTAL ACTUAL ALLOWED'
  } : {
    totalExpected: paymentSummary?.totalExpected ?? 0,
    totalActual: paymentSummary?.totalActualPaid ?? 0,
    totalLeakage: paymentSummary?.totalLeakage ?? 0,
    label2: 'TOTAL ACTUAL PAID'
  };

  const feeColumns: DataColumn<FeeScheduleVariance>[] = [
    {
      id: 'action',
      label: 'ACTION',
      minWidth: 80,
      align: 'center',
      render: (r) => (
        <RowActionMenu
          onView={() => handleDrillDown(r)}
        />
      ),
    },
    {
      id: 'paymentDate',
      label: 'PAYMENT DATE',
      minWidth: 120,
      accessor: (r) => r.paymentDate,
      render: (r) => <Typography variant="body2">{r.paymentDate}</Typography>
    },
    {
      id: 'patientName',
      label: 'PATIENT NAME',
      minWidth: 150,
      accessor: (r) => r.patientName,
      render: (r) => (
        <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 500, textTransform: 'uppercase' }}>
          {r.patientName}
        </Typography>
      )
    },
    {
      id: 'payerName',
      label: 'PAYER NAME',
      minWidth: 180,
      accessor: (r) => r.payerName || '',
      render: (r) => <Typography variant="body2">{r.payerName}</Typography>
    },
    {
      id: 'expectedAllowed',
      label: 'EXPECTED ALLOWED',
      minWidth: 140,
      align: 'right',
      accessor: (r) => Number(r.expectedAllowed),
      render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(Number(r.expectedAllowed))}</Typography>
    },
    {
      id: 'actualAllowed',
      label: 'ACTUAL ALLOWED',
      minWidth: 140,
      align: 'right',
      accessor: (r) => Number(r.actualAllowed),
      render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(Number(r.actualAllowed))}</Typography>
    },
    {
      id: 'variance',
      label: 'VARIANCE',
      minWidth: 110,
      align: 'right',
      accessor: (r) => Number(r.variance),
      render: (r) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: Number(r.variance) > 0 ? theme.palette.error.main : theme.palette.text.primary,
          }}
        >
          {formatCurrency(Number(r.variance))}
        </Typography>
      ),
    },
    {
      id: 'adjustmentCode',
      label: 'ADJUSTMENT CODES',
      minWidth: 150,
      align: 'right',
      accessor: (r) => r.adjustmentCode || '',
      render: (r) => <Typography variant="body2">{r.adjustmentCode}</Typography>
    },


  ];

  const paymentColumns: DataColumn<PaymentVariance>[] = [
    {
      id: 'action',
      label: 'ACTION',
      minWidth: 80,
      align: 'center',
      render: (r) => (
        <RowActionMenu
          onView={() => handleDrillDown(r)}
        />
      ),
    },
    {
      id: 'paymentDate',
      label: 'PAYMENT DATE',
      minWidth: 120,
      accessor: (r) => r.paymentDate || '',
      render: (r) => <Typography variant="body2">{r.paymentDate}</Typography>
    },
    {
      id: 'patientName',
      label: 'PATIENT NAME',
      minWidth: 150,
      accessor: (r) => r.patientName,
      render: (r) => (
        <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 500, textTransform: 'uppercase' }}>
          {r.patientName}
        </Typography>
      )
    },
    {
      id: 'payerName',
      label: 'PAYER NAME',
      minWidth: 180,
      accessor: (r) => r.payerName || '',
      render: (r) => <Typography variant="body2">{r.payerName}</Typography>
    },
    {
      id: 'expectedAllowed',
      label: 'EXPECTED PAID',
      minWidth: 140,
      align: 'right',
      accessor: (r) => Number(r.expectedAllowed),
      render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(Number(r.expectedAllowed))}</Typography>
    },
    {
      id: 'actualAllowed',
      label: 'ACTUAL PAID',
      minWidth: 140,
      align: 'right',
      accessor: (r) => Number(r.actualAllowed),
      render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(Number(r.actualAllowed))}</Typography>
    },
    {
      id: 'variance',
      label: 'VARIANCE',
      minWidth: 110,
      align: 'right',
      accessor: (r) => Number(r.variance),
      render: (r) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: Number(r.variance) > 0 ? theme.palette.error.main : theme.palette.text.primary,
          }}
        >
          {formatCurrency(Number(r.variance))}
        </Typography>
      ),
    },
    {
      id: 'adjustmentCode',
      label: 'ADJUSTMENT CODES',
      minWidth: 150,
      align: 'right',

      accessor: (r) => r.adjustmentCode || '',
      render: (r) => <Typography variant="body2">{r.adjustmentCode}</Typography>
    }
  ];

  const pageTitle = activeSubTab === 0 ? 'Fee Schedule Variance Analysis' : 'Payment Variance Analysis';
  const pageDescription = activeSubTab === 0
    ? 'Compares expected allowed amounts (fee schedule) against actual payer allowed amounts to identify underpayments.'
    : 'Identifies variances between actual paid amounts and expected payments based on contractual terms and remittance detail.';
  const activeColumns = (activeSubTab === 0 ? feeColumns : paymentColumns) as unknown as DataColumn<VarianceRow>[];
  const activeData = (activeSubTab === 0 ? (feeData?.data?.content ?? []) : (paymentData?.data?.content ?? [])) as VarianceRow[];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'rgb(10, 22, 40)' }}>
          {pageTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {pageDescription}
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard title="TOTAL EXPECTED" value={formatCurrency(summaryValues.totalExpected)} variant="default" backgroundColor="#fff" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard title={summaryValues.label2} value={formatCurrency(summaryValues.totalActual)} backgroundColor="#fff" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard title="TOTAL LEAKAGE" value={formatCurrency(summaryValues.totalLeakage)} variant="default" backgroundColor="#fff" />
        </Grid>
      </Grid>

      {/* {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : ( */}
      <DataTable
        columns={activeColumns}
        data={activeData}
        rowKey={(r: VarianceRow) => r.id || `${r.patientName}-${r.variance}-${r.paymentDate || ''}`}
        exportTitle={pageTitle}
        customToolbarContent={<RangeDropdown onChange={handleRangeChange} />}
        dictionaryId="variance-analysis"
        serverSide
        totalElements={activeSubTab === 0 ? (feeData?.data?.totalElements ?? 0) : (paymentData?.data?.totalElements ?? 0)}
        page={queryParams.page}
        rowsPerPage={queryParams.size}
        sortCol={queryParams.sortField}
        sortDir={queryParams.sortOrder}
        onPageChange={(p) => setQueryParams(prev => ({ ...prev, page: p }))}
        onRowsPerPageChange={(s) => setQueryParams(prev => ({ ...prev, size: s, page: 0 }))}
        onSortChange={handleSortChange}
        download={false}
      />
      {/* )} */}
    </Box>
  );
};

export default VarianceScreen;

