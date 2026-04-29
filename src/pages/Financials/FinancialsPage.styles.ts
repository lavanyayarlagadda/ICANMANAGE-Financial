import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const PageWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const BackButtonWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

export const BackText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
}));

export const RestrictedContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
  background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
  backdropFilter: 'blur(8px)',
  borderRadius: '24px',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.05)',
  margin: theme.spacing(4),
  animation: 'fadeIn 0.5s ease-out',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
}));

export const RestrictedTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1.5),
  fontSize: '1.75rem',
  letterSpacing: '-0.02em',
}));

export const RestrictedBody = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
  maxWidth: 450,
  fontSize: '1rem',
  lineHeight: 1.6,
  fontWeight: 500,
}));
