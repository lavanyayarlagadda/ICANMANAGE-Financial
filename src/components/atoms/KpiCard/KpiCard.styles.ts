import { styled } from '@mui/material/styles';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const StyledCard = styled(Card)(() => ({
  height: '100%',
  transition: 'box-shadow 0.2s ease',
  '&:hover': {
    boxShadow: themeConfig.shadows.cardHover,
  },
}));

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
  },
  '&:last-child': {
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      paddingBottom: theme.spacing(3),
    },
  },
}));

export const HeaderContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '8px', // mb: 1 (8px)
}));

export const LabelTypography = styled(Typography)(() => ({
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontWeight: 600,
  fontSize: '0.75rem', // variant="caption"
}));

export const IconContainer = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  opacity: 0.7,
  display: 'flex',
}));

export const ValueTypography = styled(Typography)(() => ({
  fontWeight: 700,
  marginBottom: '4px', // mb: 0.5 (4px)
}));

export const ChangeTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'changeType',
})<{ changeType: 'positive' | 'negative' | 'neutral' }>(({ theme, changeType }) => ({
  fontWeight: 500,
  fontSize: '0.75rem', // variant="caption"
  color:
    changeType === 'positive'
      ? theme.palette.success.main
      : changeType === 'negative'
        ? theme.palette.error.main
        : theme.palette.text.secondary,
}));
