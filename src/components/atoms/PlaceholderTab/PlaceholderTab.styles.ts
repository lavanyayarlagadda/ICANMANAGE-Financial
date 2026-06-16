import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

export const Container = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  textAlign: 'center',
}));

export const Title = styled(Typography)(() => ({
  fontWeight: 600,
}));

export const Description = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));
