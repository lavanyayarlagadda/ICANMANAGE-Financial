import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  useTheme,
} from '@mui/material';
import { TeamPerformance } from '@/interfaces/financials';
import { formatPercent, formatCurrency } from '@/utils/formatters';
import * as styles from './TeamPerformanceCard.styles';

interface TeamPerformanceCardProps {
  team: TeamPerformance;
}

const MetricRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({
  label,
  value,
  highlight,
}) => {
  const theme = useTheme();
  return (
    <Box sx={styles.metricRowStyles}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={styles.metricValueStyles(!!highlight, theme)}
      >
        {value}
      </Typography>
    </Box>
  );
};

const TeamPerformanceCard: React.FC<TeamPerformanceCardProps> = ({ team }) => {
  const theme = useTheme();

  return (
    <Card sx={styles.cardStyles}>
      <CardContent sx={styles.cardContentStyles}>
        <Typography variant="subtitle1" sx={styles.teamNameStyles(theme)}>
          {team.teamName}
        </Typography>

        <Typography variant="caption" sx={styles.sectionHeaderStyles(theme)}>
          Volume Metrics
        </Typography>
        <Box sx={styles.metricsBoxStyles}>
          <MetricRow label="Recon Check %" value={formatPercent(team.reconCheckPercent)} highlight />
          <MetricRow label="Unrecon Check %" value={formatPercent(team.unreconCheckPercent)} />
          <MetricRow label="Recon Check Count" value={String(team.reconCheckCount)} />
          <MetricRow label="Unrecon Check Count" value={String(team.unreconCheckCount)} />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="caption" sx={styles.sectionHeaderStyles(theme)}>
          Financial Metrics
        </Typography>
        <Box sx={styles.metricsBoxStyles}>
          <MetricRow label="Recon Amount %" value={formatPercent(team.reconAmountPercent)} highlight />
          <MetricRow label="Unrecon Amount %" value={formatPercent(team.unreconAmountPercent)} />
          <MetricRow label="Total Posted" value={formatCurrency(team.totalAmountPosted)} />
          <MetricRow label="Not Posted" value={formatCurrency(team.totalAmountNotPosted)} />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="caption" sx={styles.sectionHeaderStyles(theme)}>
          Efficiency
        </Typography>
        <Box sx={{ mt: 1 }}>
          <MetricRow label="Avg. Days to Reconcile" value={`${team.avgDaysToReconcile} days`} highlight />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TeamPerformanceCard;

