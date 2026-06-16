import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';

export const MetricRowContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '4px',
  paddingBottom: '4px',
});

export const MetricValue = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'highlight',
})<{ highlight?: boolean }>(({ theme, highlight }) => ({
  fontWeight: 600,
  color: highlight ? theme.palette.primary.main : theme.palette.text.primary,
  fontFamily: 'monospace',
}));

export const StyledCard = styled(Card)({
  height: '100%',
});

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
  },
}));

export const TeamName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
}));

export const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: theme.palette.text.secondary,
}));

export const MetricsBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
}));

export const EfficiencyBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));
