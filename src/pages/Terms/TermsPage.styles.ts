import { styled, alpha } from '@mui/material/styles';
import { Box, Card, Typography, Button, TypographyProps, ButtonProps } from '@mui/material';

export const TermsBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  backgroundImage: `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.light, 0.05)} 0, transparent 50%), 
                    radial-gradient(at 100% 100%, ${alpha(theme.palette.secondary.light, 0.05)} 0, transparent 50%)`,
  paddingBottom: theme.spacing(8),
}));

export const TermsCard = styled(Card)(({ theme }) => ({
  padding: 0,
  overflow: 'hidden',
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
  backgroundColor: theme.palette.background.paper,
}));

export const TermsHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.primary.main, 0.01)} 100%)`,
}));

export const TermsContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 8),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(4, 3),
  },
}));

export const SectionTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(2),
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -6,
    left: 0,
    width: 32,
    height: 3,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  }
}));

export const SectionText = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.text.secondary,
  lineHeight: 1.8,
  marginBottom: theme.spacing(2.5),
  fontSize: '0.95rem',
}));

export const BackButton = styled(Button)<ButtonProps>(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.text.secondary,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    color: theme.palette.primary.main,
  },
}));
