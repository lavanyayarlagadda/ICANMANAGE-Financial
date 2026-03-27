import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const NotFoundWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  textAlign: 'center',
}));

export const ContentBox = styled(Box)(({ theme }) => ({
  // Center content
}));
