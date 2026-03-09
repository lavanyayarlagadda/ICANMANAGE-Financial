import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
  useTheme,
} from '@mui/material';
import { TeamPerformance } from '@/types/financials';
import { formatPercent, formatCurrency } from '@/utils/formatters';

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
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: highlight ? theme.palette.primary.main : theme.palette.text.primary,
          fontFamily: 'monospace',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

const TeamPerformanceCard: React.FC<TeamPerformanceCardProps> = ({ team }) => {
  const theme = useTheme();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
          {team.teamName}
        </Typography>

        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.palette.text.secondary }}>
          Volume Metrics
        </Typography>
        <Box sx={{ mt: 1, mb: 2 }}>
          <MetricRow label="Recon Check %" value={formatPercent(team.reconCheckPercent)} highlight />
          <MetricRow label="Unrecon Check %" value={formatPercent(team.unreconCheckPercent)} />
          <MetricRow label="Recon Check Count" value={String(team.reconCheckCount)} />
          <MetricRow label="Unrecon Check Count" value={String(team.unreconCheckCount)} />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.palette.text.secondary }}>
          Financial Metrics
        </Typography>
        <Box sx={{ mt: 1, mb: 2 }}>
          <MetricRow label="Recon Amount %" value={formatPercent(team.reconAmountPercent)} highlight />
          <MetricRow label="Unrecon Amount %" value={formatPercent(team.unreconAmountPercent)} />
          <MetricRow label="Total Posted" value={formatCurrency(team.totalAmountPosted)} />
          <MetricRow label="Not Posted" value={formatCurrency(team.totalAmountNotPosted)} />
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.palette.text.secondary }}>
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
