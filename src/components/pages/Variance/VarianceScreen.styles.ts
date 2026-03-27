import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const ScreenWrapper = styled(Box)(({ theme }) => ({
  // padding handled by parent
}));

export const HeaderSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const PatientNameText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
  textTransform: 'uppercase',
}));

export const BoldAmount = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
}));

export const VarianceText = styled(Typography)<{ amount: number }>(({ theme, amount }) => ({
  fontWeight: 700,
  color: amount > 0 ? theme.palette.error.main : theme.palette.text.primary,
}));
