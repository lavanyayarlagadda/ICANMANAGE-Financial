import React from 'react';
import { Grid } from '@mui/material';
import { formatCurrency } from '@/utils/formatters';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import { themeConfig } from '@/theme/themeConfig';

interface SummaryStatsProps {
  stats: {
    bankDeposit: number;
    remittance: number;
    cashPosting: number;
    payVariance: number;
    postVariance: number;
  };
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ stats }) => {
  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
        <SummaryCard
          title="Bank Deposit"
          value={formatCurrency(stats.bankDeposit)}
          backgroundColor={`${themeConfig.colors.suspense.remittance.bg}66`} // 66 is ~40% opacity
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
        <SummaryCard
          title="Remittance"
          value={formatCurrency(stats.remittance)}
          backgroundColor={`${themeConfig.colors.suspense.medicare.bg}66`} // 66 is ~40% opacity
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
        <SummaryCard
          title="Cash Posting"
          value={formatCurrency(stats.cashPosting)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
        <SummaryCard
          title="Pay Variance"
          value={formatCurrency(stats.payVariance)}
          variant="highlight"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
        <SummaryCard
          title="Post Variance"
          value={formatCurrency(stats.postVariance)}
          variant="negative"
        />
      </Grid>
    </Grid>
  );
};

export default SummaryStats;
