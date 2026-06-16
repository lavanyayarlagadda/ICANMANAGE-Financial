import React from 'react';
import { Typography } from '@mui/material';
import { TeamPerformance } from '@/interfaces/financials';
import { formatPercent, formatCurrency } from '@/utils/formatters';
import {
  MetricRowContainer,
  MetricValue,
  StyledCard,
  StyledCardContent,
  TeamName,
  SectionHeader,
  MetricsBox,
  StyledDivider,
  EfficiencyBox,
} from './TeamPerformanceCard.styles';

interface TeamPerformanceCardProps {
  team: TeamPerformance;
}

const MetricRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({
  label,
  value,
  highlight,
}) => {
  return (
    <MetricRowContainer>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <MetricValue variant="body2" highlight={highlight}>
        {value}
      </MetricValue>
    </MetricRowContainer>
  );
};

const TeamPerformanceCard: React.FC<TeamPerformanceCardProps> = ({ team }) => {
  return (
    <StyledCard>
      <StyledCardContent>
        <TeamName variant="subtitle1">{team.teamName}</TeamName>

        <SectionHeader variant="caption">Volume Metrics</SectionHeader>
        <MetricsBox>
          <MetricRow
            label="Recon Check %"
            value={formatPercent(team.reconCheckPercent)}
            highlight
          />
          <MetricRow label="Unrecon Check %" value={formatPercent(team.unreconCheckPercent)} />
          <MetricRow label="Recon Check Count" value={String(team.reconCheckCount)} />
          <MetricRow label="Unrecon Check Count" value={String(team.unreconCheckCount)} />
        </MetricsBox>

        <StyledDivider />

        <SectionHeader variant="caption">Financial Metrics</SectionHeader>
        <MetricsBox>
          <MetricRow
            label="Recon Amount %"
            value={formatPercent(team.reconAmountPercent)}
            highlight
          />
          <MetricRow label="Unrecon Amount %" value={formatPercent(team.unreconAmountPercent)} />
          <MetricRow label="Total Posted" value={formatCurrency(team.totalAmountPosted)} />
          <MetricRow label="Not Posted" value={formatCurrency(team.totalAmountNotPosted)} />
        </MetricsBox>

        <StyledDivider />

        <SectionHeader variant="caption">Efficiency</SectionHeader>
        <EfficiencyBox>
          <MetricRow
            label="Avg. Days to Reconcile"
            value={`${team.avgDaysToReconcile} days`}
            highlight
          />
        </EfficiencyBox>
      </StyledCardContent>
    </StyledCard>
  );
};

export default TeamPerformanceCard;
