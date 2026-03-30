import { useState, useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { 
  setIsReloading, 
  setIsGlobalFetching, 
  setIsDrillingDown as setGlobalDrillingDown 
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
  useLazyGetRemittanceClaimsQuery
} from '@/store/api/financialsApi';
import { subMonths, format } from 'date-fns';
import { FeeScheduleVariance, PaymentVariance, RemittanceDetail } from '@/interfaces/financials';

export const useVarianceScreen = () => {
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

    const { data: feeData, isFetching: feeFetching, refetch: refetchFee } = useSearchFeeScheduleVarianceQuery({
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

    const { data: paymentData, isFetching: paymentFetching, refetch: refetchPayment } = useSearchPaymentVarianceQuery({
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

    const handleDrillDown = useCallback(async (row: FeeScheduleVariance | PaymentVariance) => {
        try {
            dispatch(setGlobalDrillingDown(true));
            const identifier = row.id || '';
            if (!identifier) return;

            dispatch(setSelectedPaymentId(identifier));

            const claimResult = await triggerGetRemittance(identifier).unwrap() as RemittanceDetail | { data: RemittanceDetail[] } | RemittanceDetail[];
            
            let claimsArr: RemittanceDetail[] = [];
            if (Array.isArray(claimResult)) {
                claimsArr = claimResult;
            } else if (claimResult && 'data' in claimResult && Array.isArray(claimResult.data)) {
                claimsArr = claimResult.data;
            } else if (claimResult) {
                claimsArr = [claimResult as RemittanceDetail];
            }

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
            setQueryParams(prev => ({ ...prev, fromDate: from, toDate: to, page: 0 }));
        }
    }, []);

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
