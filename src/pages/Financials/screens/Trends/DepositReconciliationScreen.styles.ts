import { styled } from '@mui/material/styles';
import { Box, Card, Typography, Divider } from '@mui/material';

export const ScreenWrapper = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  paddingTop: theme.spacing(1),
  minWidth: 0,
  width: '100%',
  maxWidth: '100%',
}));

export const GuideCard = styled(Card)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.error.main}`,
}));

export const GuideTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.error.main,
}));

export const GuideDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

export const GuideList = styled('ul')(({ theme }) => ({
  margin: 0,
  paddingLeft: theme.spacing(2),
}));

export const GuideListItem = styled('li')(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
  fontFamily: theme.typography.body2.fontFamily,
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.body2.fontWeight,
  lineHeight: theme.typography.body2.lineHeight,
  color: theme.palette.text.primary,
}));

export const _InsightsCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderLeft: `4px solid ${theme.palette.error.main}`,
}));

export const _InsightsTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.error.main,
  marginBottom: theme.spacing(1),
}));

export const _InsightsText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}));
