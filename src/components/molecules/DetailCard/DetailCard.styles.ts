import { styled } from '@mui/material/styles';
import { Card, CardContent, Box, Typography, Divider } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export const StyledCard = styled(Card)({
  marginBottom: '24px',
  boxShadow: themeConfig.shadows.card,
  borderRadius: '8px',
});

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(3),
  },
}));

export const LabelContainer = styled(Box)({
  marginBottom: '12px',
});

export const StyledLabel = styled(Typography)({
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
});

export const StyledValue = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  fontWeight: 500,
}));

export const SectionTitle = styled(Typography)({
  fontWeight: 600,
  marginBottom: '16px',
});

export const FooterContainer = styled(Box)({
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: `1px solid ${themeConfig.colors.border}`,
});

export const CardMainTitle = styled(Typography)({
  fontWeight: 600,
  marginBottom: '24px',
});

export const StyledDivider = styled(Divider)({
  marginTop: '16px',
  marginBottom: '16px',
  borderColor: 'divider',
});
