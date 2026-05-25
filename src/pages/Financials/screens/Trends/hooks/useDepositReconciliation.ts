import React from "react";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/store";
import { setIsGlobalFetching, setIsReloading } from "@/store/slices/uiSlice";
import {
  useGetDepositReconciliationAdjustedCashDepositQuery,
  useGetDepositReconciliationAgingQuery,
  useGetDepositReconciliationExecutiveSummaryQuery,
  useGetDepositReconciliationPostedEmrReconciledQuery,
  useGetDepositReconciliationPostedEmrUnreconciledQuery,
  useGetDepositReconciliationTopPayersQuery,
  useLazyExportDepositReconciliationPdfQuery,
} from "@/store/api/financialsApi";
import { downloadFileFromBlob } from "@/utils/downloadHelper";
import { formatDateForFilename } from "@/utils/formatters";
import {
  getCalendarTrailingWindowRange,
  parseTrailingWindowMonths,
} from "@/utils/dateUtils";
import type {
  DepositReconAgingQueryParams,
  DepositReconTrendsQueryParams,
} from "@/interfaces/api";
import { toText } from "../helpers/depositReconciliationHelpers";

interface UseDepositReconciliationProps {
  contract: {
    controls?: {
      trailingWindow?: { selected?: string };
      forecastWindow?: { selected?: string };
      comparisonMode?: { selected?: string };
    };
  };
  skip: boolean;
}

export const useDepositReconciliation = ({
  contract,
  skip,
}: UseDepositReconciliationProps) => {
  const dispatch = useAppDispatch();
  const { globalFilters } = useAppSelector((s) => s.financials);

  const [trailingWindow, setTrailingWindow] = React.useState<string>(
    toText(contract.controls?.trailingWindow?.selected || "3m"),
  );
  const [forecastWindow, setForecastWindow] = React.useState<string>(
    toText(contract.controls?.forecastWindow?.selected || "3m"),
  );
  const [compareMode, setCompareMode] = React.useState<string>(
    toText(contract.controls?.comparisonMode?.selected || "MoM"),
  );

  const trendsQueryParams = React.useMemo((): DepositReconTrendsQueryParams => {
    const trailingWindowMonths = parseTrailingWindowMonths(trailingWindow);
    const forecastMonths =
      forecastWindow === "6m" ? 6 : forecastWindow === "3m" ? 3 : 0;
    const toDateObj = globalFilters.toDate ? new Date(globalFilters.toDate) : new Date();
    
    // Subtract (months - 1) so that we span exactly `trailingWindowMonths` calendar months 
    // including the current month. E.g., May minus 2 months = March (March, April, May = 3 months).
    const fromDateObj = subMonths(toDateObj, Math.max(0, trailingWindowMonths - 1));

    return {
      fromDate: from,
      toDate: to,
      asOfDate: format(asOfDate, "yyyy-MM-dd"),
      trailingWindowMonths,
      forecastMonths,
      compare: compareMode.toUpperCase(),
    };
  }, [trailingWindow, forecastWindow, compareMode, globalFilters.toDate]);

  const [triggerExportPdf, { isFetching: isExportingPdf }] =
    useLazyExportDepositReconciliationPdfQuery();

  const handleExportPdf = React.useCallback(async () => {
    try {
      const result = await triggerExportPdf(trendsQueryParams).unwrap();
      if (result) {
        downloadFileFromBlob(
          result,
          `Deposit_Reconciliation_${formatDateForFilename(trendsQueryParams.fromDate!)}_to_${formatDateForFilename(trendsQueryParams.toDate!)}.pdf`,
        );
      }
    } catch (err) {
      console.error("PDF export failed:", err);
    }
  }, [triggerExportPdf, trendsQueryParams]);

  const agingQueryParams = React.useMemo(
    (): DepositReconAgingQueryParams => ({
      fromDate: trendsQueryParams.fromDate!,
      toDate: trendsQueryParams.toDate!,
    }),
    [trendsQueryParams.fromDate, trendsQueryParams.toDate],
  );

  const {
    data: executiveResponse,
    isFetching: isFetchingExecutive,
    refetch: refetchExecutive,
    isError: isErrorExecutive
  } = useGetDepositReconciliationExecutiveSummaryQuery(trendsQueryParams, {
    skip,
  });
  const {
    data: agingResponse,
    isFetching: isFetchingAging,
    refetch: refetchAging,
    isError: isErrorAging
  } = useGetDepositReconciliationAgingQuery(agingQueryParams, { skip });
  const {
    data: adjustedCashResponse,
    isFetching: isFetchingAdjustedCash,
    refetch: refetchAdjustedCash,
    isError: isErrorAdjustedCash
  } = useGetDepositReconciliationAdjustedCashDepositQuery(trendsQueryParams, {
    skip,
  });
  const {
    data: reconciledResponse,
    isFetching: isFetchingReconciled,
    refetch: refetchReconciled,
    isError: isErrorReconciled
  } = useGetDepositReconciliationPostedEmrReconciledQuery(trendsQueryParams, {
    skip,
  });
  const {
    data: unreconciledResponse,
    isFetching: isFetchingUnreconciled,
    refetch: refetchUnreconciled,
    isError: isErrorUnreconciled
  } = useGetDepositReconciliationPostedEmrUnreconciledQuery(trendsQueryParams, {
    skip,
  });
  const {
    data: topPayersResponse,
    isFetching: isFetchingTopPayers,
    refetch: refetchTopPayers,
    isError: isErrorTopPayers
  } = useGetDepositReconciliationTopPayersQuery(trendsQueryParams, { skip });

  const { actionTriggers } = useAppSelector((s) => s.ui);
  const printCount = React.useRef(actionTriggers.print);
  const reloadCount = React.useRef(actionTriggers.reload);

  React.useEffect(() => {
    if (actionTriggers.print > printCount.current) {
      handleExportPdf();
      printCount.current = actionTriggers.print;
    }
  }, [actionTriggers.print, handleExportPdf]);

  React.useEffect(() => {
    if (actionTriggers.reload > reloadCount.current) {
      const doReload = async () => {
        try {
          dispatch(setIsReloading(true));
          await Promise.all([
            refetchExecutive(),
            refetchAging(),
            refetchAdjustedCash(),
            refetchReconciled(),
            refetchUnreconciled(),
            refetchTopPayers(),
          ]);
        } catch (err) {
          console.error("Reload failed:", err);
        } finally {
          dispatch(setIsReloading(false));
        }
      };
      doReload();
      reloadCount.current = actionTriggers.reload;
    }
  }, [
    actionTriggers.reload,
    dispatch,
    refetchExecutive,
    refetchAging,
    refetchAdjustedCash,
    refetchReconciled,
    refetchUnreconciled,
    refetchTopPayers,
  ]);

  const isAnyError =
    isErrorExecutive ||
    isErrorAging ||
    isErrorAdjustedCash ||
    isErrorReconciled ||
    isErrorUnreconciled ||
    isErrorTopPayers;

  const isLoadingData =
    isFetchingExecutive ||
    isFetchingAging ||
    isFetchingAdjustedCash ||
    isFetchingReconciled ||
    isFetchingUnreconciled ||
    isFetchingTopPayers ||
    isExportingPdf;

  React.useEffect(() => {
    if (skip || isAnyError) {
      dispatch(setIsGlobalFetching(false));
      return;
    }
    dispatch(setIsGlobalFetching(isLoadingData));
    return () => {
      dispatch(setIsGlobalFetching(false));
    };
  }, [dispatch, isLoadingData, isAnyError, skip]);

  return {
    trailingWindow,
    setTrailingWindow,
    forecastWindow,
    setForecastWindow,
    compareMode,
    setCompareMode,
    executiveResponse,
    agingResponse,
    adjustedCashResponse,
    reconciledResponse,
    unreconciledResponse,
    topPayersResponse,
  };
};
