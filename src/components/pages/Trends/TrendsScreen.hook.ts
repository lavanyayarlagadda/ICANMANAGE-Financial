import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setIsGlobalFetching, setIsReloading } from '@/store/slices/uiSlice';
import { format, subMonths } from 'date-fns';
import {
  useGetForecastSummaryQuery,
  useGetReconciliationPerformanceQuery,
  useGetForecastDashboardQuery,
  useGetExecutiveSummaryQuery,
  useGetPaymentMixQuery,
  useGetAdjustmentBreakdownQuery,
} from '@/store/api/financialsApi';

export const useTrendsScreen = () => {
    const dispatch = useAppDispatch();
    const trendsData = useAppSelector((s) => s.financials.trendsData);
    const user = useAppSelector((s) => s.auth.user);
 const { selectedTenantId } = useAppSelector((s) => s.tenant);
const isMindPath = useMemo(
  () =>
    user?.company?.toLowerCase() === 'mindpath' ||
    selectedTenantId?.toLowerCase() === 'mindpath',
  [user, selectedTenantId]
);  const { activeSubTab } = useAppSelector((s) => s.ui);

    const [queryParams, setQueryParams] = useState({
        fromDate: format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
        toDate: format(new Date(), 'yyyy-MM-dd'),
    });

    const { actionTriggers } = useAppSelector(s => s.ui);
    const reloadCount = React.useRef(actionTriggers.reload);

    const { data: forecastSummary, isFetching: isFetchingForecast, refetch: refetchForecast } = useGetForecastSummaryQuery(queryParams, { skip: activeSubTab !== 0 });
    const { data: reconPerformance, isFetching: isFetchingRecon, refetch: refetchRecon } = useGetReconciliationPerformanceQuery(queryParams, { skip: activeSubTab !== 0 });
    const { data: dashboardData, isFetching: isFetchingDashboard, refetch: refetchDash } = useGetForecastDashboardQuery(queryParams, { skip: activeSubTab !== 0 });

    const { data: execSummary, isFetching: isFetchingExec, refetch: refetchExec } = useGetExecutiveSummaryQuery(queryParams, { skip: activeSubTab !== 1 });
    const { data: paymentMix, isFetching: isFetchingMix, refetch: refetchMix } = useGetPaymentMixQuery(queryParams, { skip: activeSubTab !== 1 });
    const { data: adjBreakdown, isFetching: isFetchingAdj, refetch: refetchAdj } = useGetAdjustmentBreakdownQuery(queryParams, { skip: activeSubTab !== 1 });

    const isFetching = isFetchingForecast || isFetchingRecon || isFetchingDashboard || isFetchingExec || isFetchingMix || isFetchingAdj;

    useEffect(() => {
        if (actionTriggers.reload > reloadCount.current) {
            const doReload = async () => {
                try {
                    dispatch(setIsReloading(true));
                    if (activeSubTab === 0) {
                        await Promise.all([refetchForecast(), refetchRecon(), refetchDash()]);
                    } else {
                        await Promise.all([refetchExec(), refetchMix(), refetchAdj()]);
                    }
                } finally {
                    dispatch(setIsReloading(false));
                }
            };
            doReload();
            reloadCount.current = actionTriggers.reload;
        }
    }, [actionTriggers.reload, activeSubTab, refetchForecast, refetchRecon, refetchDash, refetchExec, refetchMix, refetchAdj, dispatch]);

    useEffect(() => {
        dispatch(setIsGlobalFetching(isFetching));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [isFetching, dispatch]);

    const handleRangeChange = useCallback((range: string) => {
        if (range.includes(' to ')) {
            const [from, to] = range.split(' to ');
            setQueryParams(prev => {
                if (prev.fromDate === from && prev.toDate === to) return prev;
                return { fromDate: from, toDate: to };
            });
        }
    }, []);

    return {
        activeSubTab,
        isMindPath,
        trendsData,
        forecastSummary,
        reconPerformance,
        dashboardData,
        execSummary,
        paymentMix,
        adjBreakdown,
        handleRangeChange
    };
};
