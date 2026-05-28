import React from 'react';
import { TrendsWrapper } from './TrendsScreen.styles';
import { useTrendsScreen } from './TrendsScreen.hook';

import { ForecastTrendsSection } from './components/ForecastTrendsSection';
import { PayerPerformanceSection } from './components/PayerPerformanceSection';
import { ExecutiveSummarySection } from './components/ExecutiveSummarySection';

const TrendsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
  const {
    isForecastPath,
    isSummaryPath,
    isPayerPath,
    forecastSummary,
    reconPerformance,
    dashboardRows,
    dashboardTableTitle,
    execSummary,
    paymentMix,
    adjBreakdown,
    payerPerformanceRecords,
    totalElementsPayer,
    handleRangeChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleDrillDown,
    globalFilters,
    isMindpath,
    isFetching,
  } = useTrendsScreen({ skip });

  return (
    <TrendsWrapper>
      {isForecastPath && (
        <ForecastTrendsSection
          forecastSummary={forecastSummary}
          reconPerformance={reconPerformance}
          dashboardRows={dashboardRows || []}
          dashboardTableTitle={dashboardTableTitle}
          globalFilters={globalFilters}
          handleRangeChange={handleRangeChange}
          isMindpath={isMindpath}
          isFetching={isFetching}
        />
      )}

      {isSummaryPath && (
        <ExecutiveSummarySection
          execSummary={execSummary}
          paymentMix={paymentMix}
          adjBreakdown={adjBreakdown}
          isMindpath={isMindpath}
        />
      )}

      {isPayerPath && (
        <PayerPerformanceSection
          payerPerformanceRecords={payerPerformanceRecords}
          totalElementsPayer={totalElementsPayer}
          handlePageChange={handlePageChange}
          handleRowsPerPageChange={handleRowsPerPageChange}
          handleDrillDown={handleDrillDown}
          isFetching={isFetching}
        />
      )}
    </TrendsWrapper>
  );
};

export default TrendsScreen;
