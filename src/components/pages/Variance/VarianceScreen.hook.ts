import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import {
    setIsReloading,
    setIsGlobalFetching,
    setIsDrillingDown as setGlobalDrillingDown,
    setActiveExportType
} from '@/store/slices/uiSlice';
import {
    setShowRemittanceDetail,
    setSelectedPaymentId,
    setRemittanceDetail,
    setRemittanceClaims,
    setSelectedClaimIndex,
    setGlobalFilters
} from '@/store/slices/financialsSlice';
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
import { format } from 'date-fns';
import { calculateDatesFromLabel } from '@/utils/dateUtils';
import { FeeScheduleVariance, PaymentVariance, RemittanceDetail } from '@/interfaces/financials';
import { TableQueryParams } from '@/interfaces/api';
import { isRemittanceDetail, normalizeRemittanceClaims } from '@/utils/normalizeRemittanceClaims';
import { downloadFileFromBlob } from '@/utils/downloadHelper';

export const useVarianceScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const { activeSubTab, actionTriggers, globalFilters } = useAppSelector((s) => ({
        activeSubTab: s.ui.activeSubTab,
        actionTriggers: s.ui.actionTriggers,
        globalFilters: s.financials.globalFilters
    }));

    const [queryParams, setQueryParams] = useState<TableQueryParams>({
        page: 0,
        size: 10,
        sortField: 'paymentDate',
        sortOrder: 'desc' as 'asc' | 'desc',
        fromDate: globalFilters.fromDate,
        toDate: globalFilters.toDate,
    });

    const [drillDownParams, setDrillDownParams] = useState({
        page: 0,
        size: 10,
        sortField: 'paymentDate',
        sortOrder: 'desc' as 'asc' | 'desc',
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
    const [triggerSearchServiceLines] = useLazySearchServiceLinesQuery();
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
            const identifier = row.claimId || row.transactionNo || row.id || '';
            if (identifier) {
                dispatch(setSelectedPaymentId(identifier));

                // Call both APIs simultaneously
                const [claimResult] = await Promise.all([
                    triggerGetRemittance({
                        claimId: identifier,
                        page: drillDownParams.page + 1,
                        size: drillDownParams.size,
                        sort: drillDownParams.sortField,
                        desc: drillDownParams.sortOrder === 'desc'
                    }).unwrap(),
                    triggerSearchServiceLines({
                        page: drillDownParams.page + 1,
                        size: drillDownParams.size,
                        sort: drillDownParams.sortField,
                        desc: drillDownParams.sortOrder === 'desc',
                        check: identifier
                    }).unwrap()
                ]);

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
            }
        } catch (err) {
            console.error('Failed to fetch remittance details:', err);
        } finally {
            dispatch(setGlobalDrillingDown(false));
        }
    }, [dispatch, triggerGetRemittance, triggerSearchServiceLines, drillDownParams]);

    useEffect(() => {
        if (skip) {
            dispatch(setIsGlobalFetching(false));
            return;
        }
        dispatch(setIsGlobalFetching(feeFetching || paymentFetching));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [feeFetching, paymentFetching, skip, dispatch]);

    const handleRangeChange = useCallback((range: string) => {
        if (range.includes(' to ')) {
            const [from, to] = range.split(' to ');
            setQueryParams(prev => {
                if (prev.fromDate === from && prev.toDate === to) return prev;
                return { ...prev, fromDate: from, toDate: to, page: 0 };
            });
            // Update global filters for persistence - label is 'Custom' if it's a date string
            dispatch(setGlobalFilters({ fromDate: from, toDate: to, rangeLabel: 'Custom' }));
        } else {
            // It's a preset label
            const dates = calculateDatesFromLabel(range);
            if (dates) {
                setQueryParams(prev => {
                    if (prev.fromDate === dates.from && prev.toDate === dates.to) return prev;
                    return { ...prev, fromDate: dates.from, toDate: dates.to, page: 0 };
                });
                // Update global filters for persistence - preserve the label
                dispatch(setGlobalFilters({ fromDate: dates.from, toDate: dates.to, rangeLabel: range }));
            }
        }
    }, [dispatch]);
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

            const filename = `${activeSubTab === 0 ? 'fee-schedule-variance' : 'payment-variance'}-${queryParams.fromDate}-to-${queryParams.toDate}.${format}`;
            downloadFileFromBlob(blob, filename);

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
        globalFilters,
        drillDownParams,
        feeData,
        feeSummaryData,
        paymentData,
        paymentSummaryData,
        totalElementsFee: feeData?.data?.totalElements ?? 0,
        totalElementsPayment: paymentData?.data?.totalElements ?? 0,
        handleDrillDown,
        handleRangeChange,
        handleSortChange,
        handlePageChange,
        handleRowsPerPageChange,
        onDrillDownParamsChange: (params: Partial<typeof drillDownParams>) => setDrillDownParams(prev => ({ ...prev, ...params })),
        refetchFee,
        refetchPayment,
        dispatch
    };
};
