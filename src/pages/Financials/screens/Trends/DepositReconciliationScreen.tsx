import React from 'react';
import { Box, Card, CardContent, Divider, Typography, useTheme } from '@mui/material';
import { format, subMonths } from 'date-fns';
import summaryContract from '@/data/depositReconciliationExecutiveSummary.json';
import { useAppDispatch, useAppSelector } from '@/store';
import { setIsGlobalFetching, setIsReloading } from '@/store/slices/uiSlice';
import {
  useGetDepositReconciliationAdjustedCashDepositQuery,
  useGetDepositReconciliationAgingQuery,
  useGetDepositReconciliationExecutiveSummaryQuery,
  useGetDepositReconciliationPostedEmrReconciledQuery,
  useGetDepositReconciliationPostedEmrUnreconciledQuery,
  useGetDepositReconciliationTopPayersQuery,
  useLazyExportDepositReconciliationPdfQuery
} from '@/store/api/financialsApi';
import { downloadFileFromBlob } from '@/utils/downloadHelper';
import { formatDateForFilename } from '@/utils/formatters';
import type {
  DepositReconAgingQueryParams,
  DepositReconTrendsQueryParams
} from '@/interfaces/api';

import {
  unwrapResponse,
  pickRecord,
  pickArray,
  normalizeHeroCards,
  normalizeAgingRows,
  normalizeAgingSummary,
  normalizeFlatTrendTable,
  normalizeGroupedTrendTable,
  normalizeTopPayerRows,
  toText,
  ensureArray,
  type HeroCard,
  type AgingRow,
  type SectionRow,
  type PayerRow
} from './helpers/depositReconciliationHelpers';

import { DepositReconciliationHeader } from './sections/DepositReconciliationHeader';
import { DepositReconciliationHeroCards } from './sections/DepositReconciliationHeroCards';
import { DepositReconciliationAging } from './sections/DepositReconciliationAging';
import { SectionTable } from './sections/SectionTable';
import { DepositReconciliationTopPayers } from './sections/DepositReconciliationTopPayers';

const DepositReconciliationScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const contract = summaryContract;

  const [trailingWindow, setTrailingWindow] = React.useState<string>(
    toText(contract.controls?.trailingWindow?.selected || '3m')
  );
  const [forecastWindow, setForecastWindow] = React.useState<string>(
    toText(contract.controls?.forecastWindow?.selected || '3m')
  );
  const [compareMode, setCompareMode] = React.useState<string>(
    toText(contract.controls?.comparisonMode?.selected || 'MoM')
  );

  const trendsQueryParams = React.useMemo((): DepositReconTrendsQueryParams => {
    const trailingWindowMonths =
      trailingWindow === '24m' ? 24 :
      trailingWindow === '12m' ? 12 :
      trailingWindow === '6m' ? 6 : 3;
    const forecastMonths =
      forecastWindow === '6m' ? 6 :
      forecastWindow === '3m' ? 3 : 0;
    const toDateObj = new Date();
    const fromDateObj = subMonths(toDateObj, trailingWindowMonths);

    return {
      fromDate: format(fromDateObj, 'yyyy-MM-dd'),
      toDate: format(toDateObj, 'yyyy-MM-dd'),
      trailingWindowMonths,
      forecastMonths,
      compare: compareMode.toUpperCase()
    };
  }, [trailingWindow, forecastWindow, compareMode]);

  const [triggerExportPdf, { isFetching: isExportingPdf }] = useLazyExportDepositReconciliationPdfQuery();

  const handleExportPdf = React.useCallback(async () => {
    try {
      const result = await triggerExportPdf(trendsQueryParams).unwrap();
      if (result) {
        downloadFileFromBlob(
          result,
          `Deposit_Reconciliation_${formatDateForFilename(trendsQueryParams.fromDate!)}_to_${formatDateForFilename(trendsQueryParams.toDate!)}.pdf`
        );
      }
    } catch (err) {
      console.error('PDF export failed:', err);
    }
  }, [triggerExportPdf, trendsQueryParams]);

  const agingQueryParams = React.useMemo((): DepositReconAgingQueryParams => ({
    fromDate: trendsQueryParams.fromDate!,
    toDate: trendsQueryParams.toDate!
  }), [trendsQueryParams.fromDate, trendsQueryParams.toDate]);

  const { data: executiveResponse, isFetching: isFetchingExecutive, refetch: refetchExecutive } = useGetDepositReconciliationExecutiveSummaryQuery(trendsQueryParams, { skip: skip ?? false });
  const { data: agingResponse, isFetching: isFetchingAging, refetch: refetchAging } = useGetDepositReconciliationAgingQuery(agingQueryParams, { skip: skip ?? false });
  const { data: adjustedCashResponse, isFetching: isFetchingAdjustedCash, refetch: refetchAdjustedCash } = useGetDepositReconciliationAdjustedCashDepositQuery(trendsQueryParams, { skip: skip ?? false });
  const { data: reconciledResponse, isFetching: isFetchingReconciled, refetch: refetchReconciled } = useGetDepositReconciliationPostedEmrReconciledQuery(trendsQueryParams, { skip: skip ?? false });
  const { data: unreconciledResponse, isFetching: isFetchingUnreconciled, refetch: refetchUnreconciled } = useGetDepositReconciliationPostedEmrUnreconciledQuery(trendsQueryParams, { skip: skip ?? false });
  const { data: topPayersResponse, isFetching: isFetchingTopPayers, refetch: refetchTopPayers } = useGetDepositReconciliationTopPayersQuery(trendsQueryParams, { skip: skip ?? false });

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
            refetchTopPayers()
          ]);
        } catch (err) {
          console.error('Reload failed:', err);
        } finally {
          dispatch(setIsReloading(false));
        }
      };
      doReload();
      reloadCount.current = actionTriggers.reload;
    }
  }, [actionTriggers.reload, dispatch, refetchExecutive, refetchAging, refetchAdjustedCash, refetchReconciled, refetchUnreconciled, refetchTopPayers]);

  const isLoadingData =
    isFetchingExecutive ||
    isFetchingAging ||
    isFetchingAdjustedCash ||
    isFetchingReconciled ||
    isFetchingUnreconciled ||
    isFetchingTopPayers ||
    isExportingPdf;

  React.useEffect(() => {
    if (skip) {
      dispatch(setIsGlobalFetching(false));
      return;
    }
    dispatch(setIsGlobalFetching(isLoadingData));
    return () => {
      dispatch(setIsGlobalFetching(false));
    };
  }, [dispatch, isLoadingData, skip]);

  const executiveData = unwrapResponse(executiveResponse);
  const agingData = unwrapResponse(agingResponse);
  const adjustedCashData = unwrapResponse(adjustedCashResponse);
  const reconciledData = unwrapResponse(reconciledResponse);
  const unreconciledData = unwrapResponse(unreconciledResponse);
  const topPayersData = unwrapResponse(topPayersResponse);

  const executiveMeta = pickRecord(executiveData, ['meta', 'screenMeta']);
  const screenMeta = {
    title: toText(executiveMeta.title),
    subtitle: toText(executiveMeta.subtitle),
    updatedAt: executiveData.lastUpdated || executiveMeta.updatedAt
  };

  const monthAtGlanceTitle = toText(
    pickRecord(executiveData, ['monthAtGlance', 'insightsSummary']).title
  );
  const insights = pickArray<string>(executiveData, [
    'atAGlanceInsights',
    'insights',
    'highlights',
    'points'
  ]);

  const heroCardsFromApi = pickArray<unknown>(executiveData, ['kpiCards', 'heroCards', 'cards']);
  const heroCards = normalizeHeroCards(heroCardsFromApi);

  const agingBucketsFromApi = pickArray<unknown>(agingData, ['buckets', 'agingBuckets']);
  const agingRows = normalizeAgingRows(agingBucketsFromApi);
  const agingSummary = normalizeAgingSummary(agingData);

  const adjustedCashTable = normalizeFlatTrendTable(adjustedCashData, forecastWindow);
  const postedTable = normalizeGroupedTrendTable(reconciledData, forecastWindow);
  const notPostedTable = normalizeGroupedTrendTable(unreconciledData, forecastWindow);

  const topPayersFromApi = pickArray<unknown>(topPayersData, ['rows', 'topPayers', 'data']);
  const topPayers = normalizeTopPayerRows(topPayersFromApi);

  const safeInsights = ensureArray<string>(insights);
  const safeHeroCards = ensureArray<HeroCard>(heroCards).filter((card) => {
    const id = toText(card.id).toLowerCase();
    const title = toText(card.title).toLowerCase();
    return id !== 'dso-days-in-ar' && title !== 'dso — days in a/r' && title !== 'dso - days in a/r';
  });
  const safeAgingRows = ensureArray<AgingRow>(agingRows);
  const safeAdjustedCashRows = ensureArray<SectionRow>(adjustedCashTable.rows);
  const safeAdjustedCashColumns = adjustedCashTable.columns;
  const safePostedRows = ensureArray<SectionRow>(postedTable.rows);
  const safePostedColumns = postedTable.columns;
  const safeNotPostedRows = ensureArray<SectionRow>(notPostedTable.rows);
  const safeNotPostedColumns = notPostedTable.columns;
  const safeTopPayers = ensureArray<PayerRow>(topPayers);

  return (
    <Box sx={{ px: 2, pb: 3, pt: 1 }}>
      <DepositReconciliationHeader
        title={screenMeta.title}
        subtitle={screenMeta.subtitle}
        updatedAt={String(screenMeta.updatedAt)}
        trailingWindow={trailingWindow}
        setTrailingWindow={setTrailingWindow}
        forecastWindow={forecastWindow}
        setForecastWindow={setForecastWindow}
        compareMode={compareMode}
        setCompareMode={setCompareMode}
        controls={contract.controls}
      />

      <Card sx={{ mb: 2, borderLeft: `4px solid ${theme.palette.error.main}` }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.error.main, mb: 1 }}>
            {monthAtGlanceTitle}
          </Typography>
          {safeInsights.map((line, idx) => (
            <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
              {toText(line)}
            </Typography>
          ))}
        </CardContent>
      </Card>

      <DepositReconciliationHeroCards heroCards={safeHeroCards} />

      <DepositReconciliationAging
        agingData={agingData}
        agingSummary={agingSummary}
        agingRows={safeAgingRows}
      />

      <SectionTable
        title={String(adjustedCashData.title || '')}
        description={String(adjustedCashData.description || '')}
        columns={safeAdjustedCashColumns}
        rows={safeAdjustedCashRows}
      />
      <SectionTable
        title={String(reconciledData.title || '')}
        description={String(reconciledData.description || '')}
        columns={safePostedColumns}
        rows={safePostedRows}
      />
      <SectionTable
        title={String(unreconciledData.title || '')}
        description={String(unreconciledData.description || '')}
        columns={safeNotPostedColumns}
        rows={safeNotPostedRows}
      />

      <DepositReconciliationTopPayers
        topPayersData={topPayersData}
        topPayers={safeTopPayers}
      />

      <Card sx={{ borderLeft: `4px solid ${theme.palette.error.main}` }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
            {contract.readGuide.title}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {ensureArray<string>(contract.readGuide.points).map((point, idx) => (
              <Typography component="li" variant="body2" key={idx} sx={{ mb: 0.5 }}>
                {point}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DepositReconciliationScreen;
