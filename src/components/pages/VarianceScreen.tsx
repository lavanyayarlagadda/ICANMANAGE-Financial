import React, { useRef, useEffect, useState } from 'react';
import { Box, Typography, useTheme, IconButton, Grid, CircularProgress } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
  useLazyGetRemittanceClaimsQuery
} from '@/store/api/financialsApi';
import { subMonths, format } from 'date-fns';

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
    isLoading: feeLoading,
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
    isLoading: paymentLoading,
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

  const handleDrillDown = async (row: any) => {
    try {
      dispatch(setGlobalDrillingDown(true));
      const identifier = row.claimId || row.id;
      dispatch(setSelectedPaymentId(identifier));

      const claimResult = await triggerGetRemittance(identifier).unwrap() as any;
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
      console.error('Failed to fetch remittance details:', err);
    } finally {
      dispatch(setGlobalDrillingDown(false));
    }
  };

  const isFetching = feeFetching || paymentFetching;
  const isLoading = feeLoading || paymentLoading;

  useEffect(() => {
    dispatch(setIsGlobalFetching(isFetching));
    return () => { dispatch(setIsGlobalFetching(false)); };
  }, [isFetching, dispatch]);

  const exportCount = useRef(actionTriggers.export);
  const printCount = useRef(actionTriggers.print);
  const reloadCount = useRef(actionTriggers.reload);

  const handleExport = (format: 'pdf' | 'xlsx') => {
    dispatch(setActiveExportType(format));
    setTimeout(() => {
      dispatch(setActiveExportType(null));
      alert(`Exporting Variance Analysis as ${format.toUpperCase()}... (Endpoint pending)`);
    }, 1200);
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

    {
      id: 'action',
      label: 'ACTION',
      minWidth: 80,
      align: 'center',
      render: (r) => (
        <IconButton
          size="small"
          sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
          onClick={() => handleDrillDown(r)}
        >
          <VisibilityIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
        </IconButton>
      ),
    },
  ];

  const paymentColumns: DataColumn<PaymentVariance>[] = [
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
    },
    {
      id: 'action',
      label: 'ACTION',
      minWidth: 80,
      align: 'center',
      render: (r) => (
        <IconButton
          size="small"
          sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
          onClick={() => handleDrillDown(r)}
        >
          <VisibilityIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
        </IconButton>
      ),
    },
  ];

  const pageTitle = activeSubTab === 0 ? 'Fee Schedule Variance Analysis' : 'Payment Variance Analysis';
  const pageDescription = activeSubTab === 0
    ? 'Compares expected allowed amounts (fee schedule) against actual payer allowed amounts to identify underpayments.'
    : 'Identifies variances between actual paid amounts and expected payments based on contractual terms and remittance detail.';

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
        columns={(activeSubTab === 0 ? feeColumns : paymentColumns) as any}
        data={(activeSubTab === 0 ? (feeData?.data?.content ?? []) : (paymentData?.data?.content ?? [])) as any}
        rowKey={(r: any) => r.id || `${r.patientName}-${r.variance}-${r.paymentDate || ''}`}
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
      />
      {/* )} */}
    </Box>
  );
};

export default VarianceScreen;

