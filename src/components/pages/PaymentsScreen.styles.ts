import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const ScreenWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
}));

export const TransactionNumber = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'underline'
  }
}));

export const MonospaceBox = styled(Box)(({ theme }) => ({
  fontFamily: 'monospace',
}));
