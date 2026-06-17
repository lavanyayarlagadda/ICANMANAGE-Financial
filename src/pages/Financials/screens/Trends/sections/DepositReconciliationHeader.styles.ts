import { styled } from '@mui/material/styles';
import { Box, Typography, Stack, Button } from '@mui/material';

export const HeaderWrapper = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
}));

export const TitleText = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const StackWrapper = styled(Stack)(() => ({
  flexWrap: 'wrap',
  rowGap: '8px', // rowGap: 1
  justifyContent: 'flex-start',
}));

export const ControlBox = styled(Box)(() => ({
  textAlign: 'left',
}));

export const LabelText = styled(Typography)(({ theme }) => ({
  display: 'block',
  marginBottom: theme.spacing(0.5),
}));

export const Button40 = styled(Button)(() => ({
  minWidth: 40,
}));

export const Button48 = styled(Button)(() => ({
  minWidth: 48,
}));
