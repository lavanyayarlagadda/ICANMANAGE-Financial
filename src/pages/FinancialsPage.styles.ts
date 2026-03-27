import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const BackButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

export const PageHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(3),
}));

export const ScreenContainer = styled(Box)({
  width: '100%',
});
