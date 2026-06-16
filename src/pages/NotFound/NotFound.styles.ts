import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const NotFoundWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  textAlign: 'center',
}));

export const ContentBox = styled(Box)(() => ({
  // Center content
}));

export const TitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

export const Subtext = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));
