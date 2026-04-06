import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import {
  setIsReloading, 
  setIsGlobalFetching, 
  setIsDrillingDown as setGlobalDrillingDown ,
  setActiveExportType
} from '@/store/slices/uiSlice';
import { 
  setShowRemittanceDetail, 
  setSelectedPaymentId, 
  setRemittanceDetail, 
  setRemittanceClaims, 
  setSelectedClaimIndex 
} from '@/store/slices/financialsSlice';
import {
  useSearchFeeScheduleVarianceQuery,
  useGetFeeScheduleVarianceSummaryQuery,
  useSearchPaymentVarianceQuery,
  useGetPaymentVarianceSummaryQuery,
  useLazyGetRemittanceClaimsQuery,
  useLazyExportFeeScheduleVarianceQuery,
  useLazyExportPaymentVarianceQuery
} from '@/store/api/financialsApi';
import { subMonths, format } from 'date-fns';
import { FeeScheduleVariance, PaymentVariance, RemittanceDetail } from '@/interfaces/financials';
import { isRemittanceDetail, normalizeRemittanceClaims } from '@/utils/normalizeRemittanceClaims';

export const useVarianceScreen = ({ skip = false }: { skip?: boolean } = {}) => {
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

    const reloadCount = React.useRef(actionTriggers.reload);

    const { data: feeData, isFetching: feeFetching, refetch: refetchFee } = useSearchFeeScheduleVarianceQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === 'desc',
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate
    }, { skip: skip || activeSubTab !== 0 });

    const { data: feeSummaryData, refetch: refetchFeeSummary } = useGetFeeScheduleVarianceSummaryQuery({
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate
    }, { skip: skip || activeSubTab !== 0 });

    const { data: paymentData, isFetching: paymentFetching, refetch: refetchPayment } = useSearchPaymentVarianceQuery({
        page: queryParams.page + 1,
        size: queryParams.size,
        sort: queryParams.sortField,
        desc: queryParams.sortOrder === 'desc',
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate
    }, { skip: skip || activeSubTab !== 1 });

    const { data: paymentSummaryData, refetch: refetchPaymentSummary } = useGetPaymentVarianceSummaryQuery({
        fromDate: queryParams.fromDate,
        toDate: queryParams.toDate
    }, { skip: skip || activeSubTab !== 1 });
  const exportCount = useRef(actionTriggers.export);
  const printCount = useRef(actionTriggers.print);
    const [triggerGetRemittance] = useLazyGetRemittanceClaimsQuery();
  const [triggerExportFee] = useLazyExportFeeScheduleVarianceQuery();
  const [triggerExportPayment] = useLazyExportPaymentVarianceQuery();
    useEffect(() => {
        if (actionTriggers.reload > reloadCount.current) {
            const doReload = async () => {
                try {
                    dispatch(setIsReloading(true));
                    if (activeSubTab === 0) {
                        await Promise.all([refetchFee(), refetchFeeSummary()]);
                    } else {
                        await Promise.all([refetchPayment(), refetchPaymentSummary()]);
                    }
                } finally {
                    dispatch(setIsReloading(false));
                }
            };
            doReload();
            reloadCount.current = actionTriggers.reload;
        }
    }, [actionTriggers.reload, activeSubTab, refetchFee, refetchFeeSummary, refetchPayment, refetchPaymentSummary, dispatch]);

    const handleDrillDown = useCallback(async (row: FeeScheduleVariance | PaymentVariance) => {
        try {
            dispatch(setGlobalDrillingDown(true));
            const identifier = row.id || '';
            if (!identifier) return;

            dispatch(setSelectedPaymentId(identifier));

            const claimResult = await triggerGetRemittance(identifier).unwrap();
            const claimsArr = normalizeRemittanceClaims(claimResult);

            if (claimsArr.length === 0) {
                dispatch(setRemittanceClaims([]));
                dispatch(setRemittanceDetail(null));
                dispatch(setShowRemittanceDetail(true));
                return;
            }

            dispatch(setRemittanceClaims(claimsArr));
            dispatch(setSelectedClaimIndex(0));
            const selectedClaim: RemittanceDetail | null = claimsArr.find(isRemittanceDetail) ?? null;
            dispatch(setRemittanceDetail(selectedClaim));
            dispatch(setShowRemittanceDetail(true));
        } catch (err) {
            console.error('Failed to fetch remittance details:', err);
        } finally {
            dispatch(setGlobalDrillingDown(false));
            dispatch(setIsReloading(false));
        }
    }, [dispatch, triggerGetRemittance]);

    useEffect(() => {
        dispatch(setIsGlobalFetching(feeFetching || paymentFetching));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [feeFetching, paymentFetching, dispatch]);

    const handleRangeChange = useCallback((range: string) => {
        if (range.includes(' to ')) {
            const [from, to] = range.split(' to ');
            setQueryParams(prev => {
                if (prev.fromDate === from && prev.toDate === to) return prev;
                return { ...prev, fromDate: from, toDate: to, page: 0 };
            });
        }
    }, []);
 const handleExport = async (format: 'pdf' | 'xlsx') => {
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
    const handleSortChange = useCallback((colId: string, direction: 'asc' | 'desc') => {
        setQueryParams(prev => ({ ...prev, sortField: colId, sortOrder: direction, page: 0 }));
    }, []);

    const handlePageChange = useCallback((p: number) => setQueryParams(prev => ({ ...prev, page: p })), []);
    const handleRowsPerPageChange = useCallback((s: number) => setQueryParams(prev => ({ ...prev, size: s, page: 0 })), []);

    return {
        activeSubTab,
        actionTriggers,
        queryParams,
        feeData,
        feeSummaryData,
        paymentData,
        paymentSummaryData,
        handleDrillDown,
        handleRangeChange,
        handleSortChange,
        handlePageChange,
        handleRowsPerPageChange,
        refetchFee,
        refetchPayment,
        dispatch
    };
};
