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
  paddingTop: theme.spacing(10),
  paddingBottom: theme.spacing(10),
  backgroundColor: 'rgba(241, 245, 249, 0.5)', // slate[50] alpha 0.5
  borderRadius: '12px',
  border: `1px dashed ${theme.palette.divider}`,
  margin: theme.spacing(2),
}));

export const RestrictedTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#475569', // slate[600]
  marginBottom: theme.spacing(1),
}));

export const RestrictedBody = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
  maxWidth: 400,
}));
