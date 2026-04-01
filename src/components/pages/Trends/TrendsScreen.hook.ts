import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/store';
import { setIsGlobalFetching } from '@/store/slices/uiSlice';
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

    const { data: forecastSummary, isFetching: isFetchingForecast } = useGetForecastSummaryQuery(queryParams, { skip: activeSubTab !== 0 });
    const { data: reconPerformance, isFetching: isFetchingRecon } = useGetReconciliationPerformanceQuery(queryParams, { skip: activeSubTab !== 0 });
    const { data: dashboardData, isFetching: isFetchingDashboard } = useGetForecastDashboardQuery(queryParams, { skip: activeSubTab !== 0 });

    const { data: execSummary, isFetching: isFetchingExec } = useGetExecutiveSummaryQuery(queryParams, { skip: activeSubTab !== 1 });
    const { data: paymentMix, isFetching: isFetchingMix } = useGetPaymentMixQuery(queryParams, { skip: activeSubTab !== 1 });
    const { data: adjBreakdown, isFetching: isFetchingAdj } = useGetAdjustmentBreakdownQuery(queryParams, { skip: activeSubTab !== 1 });

    const isFetching = isFetchingForecast || isFetchingRecon || isFetchingDashboard || isFetchingExec || isFetchingMix || isFetchingAdj;

    useEffect(() => {
        dispatch(setIsGlobalFetching(isFetching));
        return () => { dispatch(setIsGlobalFetching(false)); };
    }, [isFetching, dispatch]);

    const handleRangeChange = useCallback((range: string) => {
        if (range.includes(' to ')) {
            const [from, to] = range.split(' to ');
            setQueryParams({ fromDate: from, toDate: to });
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
