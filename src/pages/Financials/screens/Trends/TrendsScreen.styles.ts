import { styled } from '@mui/material/styles';
import { Box, Typography, Card, Grid } from '@mui/material';

export const TrendsWrapper = styled(Box)(() => ({
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  minHeight: 0,
  minWidth: 0,
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const TitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

export const ChartContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(3),
  border: `1px solid ${theme.palette.divider}`,
}));

export const LegendWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

export const PieChartWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  height: 260,
}));

export const RichCard = styled(Card)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
}));

export const RiskCardStyled = styled(Card)<{ severity: 'error' | 'warning' }>(
  ({ theme, severity }) => ({
    height: '100%',
    backgroundColor: theme.palette.background.default,
    borderLeft: `4px solid ${severity === 'error' ? theme.palette.error.main : theme.palette.warning.main}`,
    boxShadow: 'none',
  }),
);

export const MetricValueTypography = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

export const MarginGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const SubtitleMarginTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const BoldTypography = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const BoldMonospaceTypography = styled(Typography)(() => ({
  fontFamily: 'monospace',
  fontWeight: 600,
}));

export const SemiBoldTypography = styled(Typography)(() => ({
  fontWeight: 600,
}));

export const StatusBadgeBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<{ status: string }>(({ status, theme }) => {
  const isCritical = status === 'CRITICAL';
  const isImproving = status === 'IMPROVING';
  return {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    display: 'inline-block',
    backgroundColor: isCritical
      ? theme.palette.error.light
      : isImproving
        ? theme.palette.success.light
        : theme.palette.info.light,
    color: isCritical
      ? theme.palette.error.contrastText
      : isImproving
        ? theme.palette.success.contrastText
        : theme.palette.info.contrastText,
  };
});

export const StyledCellText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isOverall',
})<{ isOverall?: boolean }>(({ isOverall }) => ({
  fontWeight: isOverall ? 700 : 500,
}));
