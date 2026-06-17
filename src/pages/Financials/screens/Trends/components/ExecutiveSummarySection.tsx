import React from 'react';
import { Box, CardContent, Grid, Typography, useTheme } from '@mui/material';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/utils/formatters';
import {
  RichCard,
  SectionHeader,
  TitleText,
  PieChartWrapper,
  MetricValueTypography,
  MarginGrid,
  SubtitleMarginTypography,
} from '../TrendsScreen.styles';

interface ExecutiveSummarySectionProps {
  execSummary: unknown;
  paymentMix: unknown;
  adjBreakdown: unknown;
  isMindpath: boolean;
}

export const ExecutiveSummarySection: React.FC<ExecutiveSummarySectionProps> = ({
  execSummary,
  paymentMix,
  adjBreakdown,
  isMindpath,
}) => {
  const theme = useTheme();
  const paymentMixColors = [theme.palette.primary.main, theme.palette.warning.main];
  const adjBreakdownColors = [
    theme.palette.primary.main,
    theme.palette.info.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  return (
    <Box>
      <SectionHeader>
        <TitleText variant="h6">Executive Summary</TitleText>
      </SectionHeader>
      <MarginGrid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <RichCard>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Total Collections
              </Typography>
              <MetricValueTypography variant="h4">
                {formatCurrency(execSummary?.data?.totalCollectionsMtd ?? 0)}
              </MetricValueTypography>
            </CardContent>
          </RichCard>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <RichCard>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Recon Rate
              </Typography>
              <MetricValueTypography variant="h4">
                {execSummary?.data?.reconciliationRate ?? 0}%
              </MetricValueTypography>
            </CardContent>
          </RichCard>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <RichCard>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Open Suspense
              </Typography>
              <MetricValueTypography variant="h4">
                {formatCurrency(execSummary?.data?.openSuspense ?? 0)}
              </MetricValueTypography>
            </CardContent>
          </RichCard>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <RichCard>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Avg Days to Recon
              </Typography>
              <MetricValueTypography variant="h4">
                {execSummary?.data?.avgDaysToReconcile ?? 0}
              </MetricValueTypography>
            </CardContent>
          </RichCard>
        </Grid>
      </MarginGrid>
      <MarginGrid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <RichCard>
            <CardContent>
              <SubtitleMarginTypography variant="subtitle2">Payment Mix</SubtitleMarginTypography>
              <PieChartWrapper>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'EFT', value: paymentMix?.data?.eftCount ?? 0 },
                        { name: 'Other', value: paymentMix?.data?.otherCount ?? 0 },
                      ]}
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      paddingAngle={5}
                    >
                      {paymentMixColors.map((color, i) => (
                        <Cell key={i} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </PieChartWrapper>
            </CardContent>
          </RichCard>
        </Grid>
        {!isMindpath && (
          <Grid size={{ xs: 12, md: 6 }}>
            <RichCard>
              <CardContent>
                <SubtitleMarginTypography variant="subtitle2">
                  Adjustment Breakdown
                </SubtitleMarginTypography>
                <PieChartWrapper>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'CO', value: adjBreakdown?.data?.contractualCount ?? 0 },
                          { name: 'PR', value: adjBreakdown?.data?.patientRespCount ?? 0 },
                          { name: 'Denial', value: adjBreakdown?.data?.denialCount ?? 0 },
                          { name: 'Other', value: adjBreakdown?.data?.otherAdjCount ?? 0 },
                        ]}
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        paddingAngle={5}
                      >
                        {adjBreakdownColors.map((color, i) => (
                          <Cell key={i} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </PieChartWrapper>
              </CardContent>
            </RichCard>
          </Grid>
        )}
      </MarginGrid>
    </Box>
  );
};
