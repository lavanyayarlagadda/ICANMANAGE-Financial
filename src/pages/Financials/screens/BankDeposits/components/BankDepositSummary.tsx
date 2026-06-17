import React from 'react';
import { Grid, useTheme } from '@mui/material';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import { formatCurrency } from '@/utils/formatters';
import { SummaryGrid } from '../BankDepositsScreen.styles';

interface BankDepositSummaryProps {
  totalBankAmt: number;
  reconRate: string;
  exceptions: number;
}

const BankDepositSummary: React.FC<BankDepositSummaryProps> = ({
  totalBankAmt,
  reconRate,
  exceptions,
}) => {
  const theme = useTheme();

  return (
    <SummaryGrid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <SummaryCard
          title="TOTAL COLLECTIONS"
          value={formatCurrency(totalBankAmt)}
          variant="highlight"
          backgroundColor={theme.palette.background.paper}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <SummaryCard
          title="RECONCILIATION RATE"
          value={`${reconRate}%`}
          variant={exceptions > 0 ? 'negative' : 'positive'}
          backgroundColor={theme.palette.background.paper}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <SummaryCard
          title="ACTION REQUIRED"
          value={String(exceptions)}
          backgroundColor={theme.palette.background.paper}
        />
      </Grid>
    </SummaryGrid>
  );
};

export default BankDepositSummary;
