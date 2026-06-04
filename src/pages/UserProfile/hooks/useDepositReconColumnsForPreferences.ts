import { useMemo } from 'react';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { useAppSelector } from '@/store';
import {
  useGetDepositReconciliationAdjustedCashDepositQuery,
  useGetDepositReconciliationPostedEmrReconciledQuery,
  useGetDepositReconciliationPostedEmrUnreconciledQuery,
} from '@/store/api/financialsApi';
import { normalizeGroupedTrendTable, normalizeFlatTrendTable } from '@/pages/Financials/screens/Trends/helpers/depositReconciliationHelpers';
import type { TrendColumn, GenericRecord } from '@/pages/Financials/screens/Trends/helpers/depositReconTypes';
import { parseTrailingWindowMonths } from '@/utils/dateUtils';
import type { DepositReconTrendsQueryParams } from '@/interfaces/api';

export const useDepositReconColumnsForPreferences = (skip: boolean) => {
  const { globalFilters } = useAppSelector((s) => s.financials);

  // Default values to mimic the screen's initial load
  const trailingWindowMonths = parseTrailingWindowMonths('3m');
  const forecastMonths = 3;
  const compareMode: string = 'MOM';

  const trendsQueryParams = useMemo((): DepositReconTrendsQueryParams => {
    const toDateObj = globalFilters.toDate ? new Date(globalFilters.toDate) : new Date();
    const fromDateObj = subMonths(toDateObj, Math.max(0, trailingWindowMonths - 1));
    return {
      fromDate: format(startOfMonth(fromDateObj), 'yyyy-MM-dd'),
      toDate: format(endOfMonth(toDateObj), 'yyyy-MM-dd'),
      trailingWindowMonths,
      forecastMonths,
      compare: compareMode,
    };
  }, [trailingWindowMonths, forecastMonths, compareMode, globalFilters.toDate]);

  const { data: adjustedCashResponse } = useGetDepositReconciliationAdjustedCashDepositQuery(trendsQueryParams, { skip });
  const { data: reconciledResponse } = useGetDepositReconciliationPostedEmrReconciledQuery(trendsQueryParams, { skip });
  const { data: unreconciledResponse } = useGetDepositReconciliationPostedEmrUnreconciledQuery(trendsQueryParams, { skip });

  const columnsMap = useMemo(() => {
    if (skip) return {};

    const adjustedCashData = adjustedCashResponse && 'data' in adjustedCashResponse ? adjustedCashResponse.data : adjustedCashResponse;
    const reconciledData = reconciledResponse && 'data' in reconciledResponse ? reconciledResponse.data : reconciledResponse;
    const unreconciledData = unreconciledResponse && 'data' in unreconciledResponse ? unreconciledResponse.data : unreconciledResponse;

    // Use empty object as fallback to prevent normalization crashes
    const adjustedCashTable = normalizeFlatTrendTable((adjustedCashData || {}) as GenericRecord, '3m');
    const postedTable = normalizeGroupedTrendTable((reconciledData || {}) as GenericRecord, '3m');
    const notPostedTable = normalizeGroupedTrendTable((unreconciledData || {}) as GenericRecord, '3m');

    const deltaLabel = compareMode === 'YOY' ? 'Δ YoY' : 'Δ MoM';

    const extractLabels = (columns: TrendColumn[]) => {
      if (!columns || columns.length === 0) return [];
      return ['Row Name', 'Trend', deltaLabel, ...columns.map(c => c.label)];
    };

    return {
      'Adjusted Cash': extractLabels(adjustedCashTable?.columns || []),
      'Reconciled': extractLabels(postedTable?.columns || []),
      'Unreconciled': extractLabels(notPostedTable?.columns || []),
    };
  }, [adjustedCashResponse, reconciledResponse, unreconciledResponse, compareMode, skip]);

  return columnsMap;
};
