import React from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import summaryContract from "@/data/depositReconciliationExecutiveSummary.json";

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
  type PayerRow,
} from "./helpers/depositReconciliationHelpers";

import { useDepositReconciliation } from "./hooks/useDepositReconciliation";

import { DepositReconciliationHeader } from "./sections/DepositReconciliationHeader";
import { DepositReconciliationHeroCards } from "./sections/DepositReconciliationHeroCards";
import { DepositReconciliationAging } from "./sections/DepositReconciliationAging";
import { SectionTable } from "./sections/SectionTable";
import { DepositReconciliationTopPayers } from "./sections/DepositReconciliationTopPayers";

const DepositReconciliationScreen: React.FC<{ skip?: boolean }> = ({
  skip = false,
}) => {
  const theme = useTheme();
  const contract = summaryContract;

  const {
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
  } = useDepositReconciliation({ contract, skip });

  const executiveData = unwrapResponse(executiveResponse);
  const agingData = unwrapResponse(agingResponse);
  const adjustedCashData = unwrapResponse(adjustedCashResponse);
  const reconciledData = unwrapResponse(reconciledResponse);
  const unreconciledData = unwrapResponse(unreconciledResponse);
  const topPayersData = unwrapResponse(topPayersResponse);

  // const executiveMeta = pickRecord(executiveData, ["meta", "screenMeta"]);
  const screenMeta = {
    title: summaryContract.screenMeta.title,
    subtitle: summaryContract.screenMeta.subtitle,
    updatedAt: executiveData.lastUpdated,
  };

  const monthAtGlanceTitle = "📌 This month at a glance";
  
  let insights = pickArray<string>(executiveData, ["atAGlanceInsights"]);
  if (insights.length === 0) {
    const mag = pickRecord(executiveData, ["monthAtGlance", "insightsSummary"]);
    insights = pickArray<string>(mag, ["insights", "points"]);
  }

  const heroCardsFromApi = pickArray<unknown>(executiveData, [
    "kpiCards",
    "heroCards",
    "cards",
  ]);
  const heroCards = normalizeHeroCards(heroCardsFromApi);

  const agingBucketsFromApi = pickArray<unknown>(agingData, [
    "buckets",
    "agingBuckets",
  ]);
  const agingRows = normalizeAgingRows(agingBucketsFromApi);
  const agingSummary = normalizeAgingSummary(agingData);

  const adjustedCashTable = normalizeFlatTrendTable(
    adjustedCashData,
    forecastWindow,
  );
  const postedTable = normalizeGroupedTrendTable(
    reconciledData,
    forecastWindow,
  );
  const notPostedTable = normalizeGroupedTrendTable(
    unreconciledData,
    forecastWindow,
  );

  const topPayersFromApi = pickArray<unknown>(topPayersData, [
    "rows",
    "topPayers",
    "data",
  ]);
  const topPayers = normalizeTopPayerRows(topPayersFromApi);

  const safeInsights = ensureArray<string>(insights);
  const safeHeroCards = ensureArray<HeroCard>(heroCards).filter((card) => {
    const id = toText(card.id).toLowerCase();
    const title = toText(card.title).toLowerCase();
    return (
      id !== "dso-days-in-ar" &&
      title !== "dso — days in a/r" &&
      title !== "dso - days in a/r"
    );
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
    <Box
      sx={{ px: 2, pb: 3, pt: 1, minWidth: 0, width: "100%", maxWidth: "100%" }}
    >
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
      {safeInsights.length > 0 && (
        <Card
          sx={{ mb: 2, borderLeft: `4px solid ${theme.palette.error.main}` }}
        >
          <CardContent>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: theme.palette.error.main, mb: 1 }}
            >
              {monthAtGlanceTitle}
            </Typography>
            {safeInsights.map((line, idx) => (
              <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                {toText(line)}
              </Typography>
            ))}
          </CardContent>
        </Card>
      )}
      <DepositReconciliationHeroCards heroCards={safeHeroCards} />

      <DepositReconciliationAging
        agingData={agingData}
        agingSummary={agingSummary}
        agingRows={safeAgingRows}
      />

      <SectionTable
        title={String(adjustedCashData.title || "")}
        description={String(adjustedCashData.description || "")}
        columns={safeAdjustedCashColumns}
        rows={safeAdjustedCashRows}
        compareMode={compareMode}
      />
      <SectionTable
        title={String(reconciledData.title || "")}
        description={String(reconciledData.description || "")}
        columns={safePostedColumns}
        rows={safePostedRows}
        compareMode={compareMode}
      />
      <SectionTable
        title={String(unreconciledData.title || "")}
        description={String(unreconciledData.description || "")}
        columns={safeNotPostedColumns}
        rows={safeNotPostedRows}
        compareMode={compareMode}
      />

      <DepositReconciliationTopPayers
        topPayersData={topPayersData}
        topPayers={safeTopPayers}
        compareMode={compareMode}
      />

      <Card sx={{ borderLeft: `4px solid ${theme.palette.error.main}` }}>
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: theme.palette.error.main }}
          >
            {contract.readGuide.title}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {ensureArray<string>(contract.readGuide.points).map(
              (point, idx) => (
                <Typography
                  component="li"
                  variant="body2"
                  key={idx}
                  sx={{ mb: 0.5 }}
                  dangerouslySetInnerHTML={{
                    __html: point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  }}
                />
              ),
            )}
          </Box>
        </CardContent>
      </Card>    </Box>
  );
};

export default DepositReconciliationScreen;
