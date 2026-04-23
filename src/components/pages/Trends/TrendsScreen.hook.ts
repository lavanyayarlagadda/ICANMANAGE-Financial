import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch, RootState } from '@/store';
import {
    setIsGlobalFetching,
    setIsReloading,
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
import { format } from 'date-fns';
import { calculateDatesFromLabel } from '@/utils/dateUtils';
import {
    useGetForecastSummaryQuery,
    useGetReconciliationPerformanceQuery,
    useGetForecastDashboardQuery,
    useGetExecutiveSummaryQuery,
    useGetPaymentMixQuery,
    useGetAdjustmentBreakdownQuery,
    useGetPayerPerformanceQuery,
    useLazyGetRemittanceClaimsQuery,
    useLazySearchServiceLinesQuery,
} from '@/store/api/financialsApi';
import { PayerPerformanceRecord, RemittanceDetail } from '@/interfaces/financials';
import { isRemittanceDetail, normalizeRemittanceClaims } from '@/utils/normalizeRemittanceClaims';

export const useTrendsScreen = ({ skip = false }: { skip?: boolean } = {}) => {
    const dispatch = useAppDispatch();
    const trendsData = useAppSelector((s: RootState) => s.financials.trendsData);
    const { user } = useAppSelector((s: RootState) => s.auth);
    const { tenants, selectedTenantId } = useAppSelector((s: RootState) => s.tenant);
    const { activeSubTab, actionTriggers } = useAppSelector((s: RootState) => s.ui);
    const { globalFilters } = useAppSelector((s: RootState) => s.financials);

    const activeTenantName = useMemo(() => {
        const selected = tenants.find(t => t.tenantId === selectedTenantId);
        return selected?.displayName || tenants[0]?.displayName || '';
    }, [tenants, selectedTenantId]);

    const isMindpath = useMemo(() => {
        const userCompany = user?.company?.toLowerCase() || '';
        const tenantName = activeTenantName.toLowerCase();
        return userCompany.includes('mindpath') || tenantName.includes('mindpath');
    }, [user, activeTenantName]);

    const location = useLocation();

    const isForecastPath = useMemo(() => location.pathname.includes('/forecast'), [location.pathname]);
    const isSummaryPath = useMemo(() => location.pathname.includes('/summary'), [location.pathname]);
    const isPayerPath = useMemo(() => location.pathname.includes('/payer-performance'), [location.pathname]);

    const [queryParams, setQueryParams] = useState<any>({
        fromDate: globalFilters.fromDate,
        toDate: globalFilters.toDate,
    });

    const [drillDownParams, setDrillDownParams] = useState({
        page: 0,
        size: 10,
        sortField: 'paymentDate',
        sortOrder: 'desc' as 'asc' | 'desc',
    });

    const reloadCount = useRef(actionTriggers.reload);

    const { data: forecastSummary, isFetching: isFetchingForecast, refetch: refetchForecast } = useGetForecastSummaryQuery(queryParams, { skip: skip || activeSubTab !== 0 || !isForecastPath });
    const { data: reconPerformance, isFetching: isFetchingRecon, refetch: refetchRecon } = useGetReconciliationPerformanceQuery(queryParams, { skip: skip || activeSubTab !== 0 || !isForecastPath });
    const { data: dashboardData, isFetching: isFetchingDashboard, refetch: refetchDash } = useGetForecastDashboardQuery(queryParams, { skip: skip || activeSubTab !== 0 || !isForecastPath || isMindpath });

    const { data: execSummary, isFetching: isFetchingExec, refetch: refetchExec } = useGetExecutiveSummaryQuery(queryParams, { skip: skip || activeSubTab !== 1 || !isSummaryPath });
    const { data: paymentMix, isFetching: isFetchingMix, refetch: refetchMix } = useGetPaymentMixQuery(queryParams, { skip: skip || activeSubTab !== 1 || !isSummaryPath });
    const { data: adjBreakdown, isFetching: isFetchingAdj, refetch: refetchAdj } = useGetAdjustmentBreakdownQuery(queryParams, { skip: skip || activeSubTab !== 1 || !isSummaryPath });
    const { data: payerPerformance, isFetching: isFetchingPayer, refetch: refetchPayer } = useGetPayerPerformanceQuery(queryParams, { skip: skip || activeSubTab !== 2 || !isPayerPath });

    const [triggerGetRemittance] = useLazyGetRemittanceClaimsQuery();
    const [triggerSearchServiceLines] = useLazySearchServiceLinesQuery();

    const isFetching = isFetchingForecast || isFetchingRecon || isFetchingDashboard || isFetchingExec || isFetchingMix || isFetchingAdj || isFetchingPayer;

    useEffect(() => {
        if (actionTriggers.reload > reloadCount.current) {
            const doReload = async () => {
                try {
                    dispatch(setIsReloading(true));
                    if (activeSubTab === 0) {
                        const tasks: Promise<any>[] = [refetchForecast().unwrap(), refetchRecon().unwrap()];
                        if (!isMindpath) tasks.push(refetchDash().unwrap());
                        await Promise.all(tasks);
                    } else if (activeSubTab === 1) {
                        await Promise.all([refetchExec().unwrap(), refetchMix().unwrap(), refetchAdj().unwrap()]);
                    } else if (activeSubTab === 2) {
                        await refetchPayer().unwrap();
                    }
                } finally {
                    dispatch(setIsReloading(false));
                }
            };
            doReload();
            reloadCount.current = actionTriggers.reload;
        }
    }, [actionTriggers.reload, activeSubTab, refetchForecast, refetchRecon, refetchDash, refetchExec, refetchMix, refetchAdj, refetchPayer, dispatch, isMindpath]);

    useEffect(() => {
        dispatch(setIsGlobalFetching(isFetching));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [isFetching, dispatch]);

    const handleDrillDown = useCallback(async (row: PayerPerformanceRecord) => {
        try {
            dispatch(setGlobalDrillingDown(true));
            // Use identifier from the row. If identifier is missing, we use row.id
            const identifier = row.id || '';
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
            console.error('Failed to fetch remittance drill-down data:', err);
        } finally {
            dispatch(setGlobalDrillingDown(false));
        }
    }, [dispatch, triggerGetRemittance, triggerSearchServiceLines, drillDownParams]);

    const handleRangeChange = useCallback((range: string) => {
        if (range.includes(' to ')) {
            const [from, to] = range.split(' to ');
            setQueryParams((prev: any) => {
                if (prev.fromDate === from && prev.toDate === to) return prev;
                return { ...prev, fromDate: from, toDate: to, page: 0 };
            });
            // Update global filters for persistence - label is 'Custom' if it's a date string
            dispatch(setGlobalFilters({ fromDate: from, toDate: to, rangeLabel: 'Custom' }));
        } else {
            // It's a preset label
            const dates = calculateDatesFromLabel(range);
            if (dates) {
                setQueryParams((prev: any) => ({ ...prev, fromDate: dates.from, toDate: dates.to, page: 0 }));
                // Update global filters for persistence - preserve the label
                dispatch(setGlobalFilters({ fromDate: dates.from, toDate: dates.to, rangeLabel: range }));
            }
        }
    }, [dispatch]);

    const handleSortChange = useCallback((colId: string, direction: 'asc' | 'desc') => {
        setQueryParams((prev: any) => ({ ...prev, sortField: colId, sortOrder: direction, page: 0 }));
    }, []);

    const handlePageChange = useCallback((p: number) => setQueryParams((prev: any) => ({ ...prev, page: p })), []);
    const handleRowsPerPageChange = useCallback((s: number) => setQueryParams((prev: any) => ({ ...prev, size: s, page: 0 })), []);

    return {
        activeSubTab,
        isMindpath,
        trendsData,
        forecastSummary,
        reconPerformance,
        dashboardData: dashboardData?.data ?? [],
        totalElementsDashboard: dashboardData?.data?.length ?? 0,
        execSummary,
        paymentMix,
        adjBreakdown,
        payerPerformanceRecords: payerPerformance?.data?.content ?? [],
        totalElementsPayer: payerPerformance?.data?.totalElements ?? 0,
        queryParams,
        globalFilters,
        drillDownParams,
        handleRangeChange,
        handleSortChange,
        handlePageChange,
        handleRowsPerPageChange,
        onDrillDownParamsChange: (params: Partial<typeof drillDownParams>) => setDrillDownParams(prev => ({ ...prev, ...params })),
        handleDrillDown
    };
};
