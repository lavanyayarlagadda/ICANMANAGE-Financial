import { styled } from '@mui/material/styles';
import { Box, Typography, ToggleButton } from '@mui/material';

export const HeaderBox = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
});

export const ChartTitle = styled(Typography)({
  fontWeight: 700,
});

export const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
}));
