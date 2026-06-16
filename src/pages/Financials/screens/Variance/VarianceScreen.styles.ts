import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, SxProps, Theme } from '@mui/material';

export const ScreenWrapper = styled(Box)(() => ({
  // padding handled by parent
}));

export const HeaderSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const HeaderTitle = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const PatientNameText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
  textTransform: 'uppercase',
}));

export const BoldAmount = styled(Typography)(() => ({
  fontWeight: 600,
}));

export const MonospaceText = styled(Typography)(() => ({
  fontFamily: 'monospace',
  fontWeight: 600,
}));

export const VarianceText = styled(Typography)<{ amount: number }>(({ theme, amount }) => ({
  fontWeight: 700,
  color: amount > 0 ? theme.palette.error.main : theme.palette.text.primary,
}));

export const ToolbarWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5),
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export const SearchField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  flex: '1 1 auto',
  [theme.breakpoints.up('md')]: {
    flex: '0 0 320px',
  },
  '& .MuiOutlinedInput-root': {
    height: 36,
    fontSize: '13px',
  },
}));

export const summaryGridStyles: SxProps<Theme> = {
  mb: 4,
};

export const searchWrapperStyles: SxProps<Theme> = {
  display: 'flex',
  gap: 1,
  alignItems: 'center',
};

export const searchIconStyles: SxProps<Theme> = {
  fontSize: 18,
  color: 'primary.main',
};

export const searchButtonStyles: SxProps<Theme> = {
  height: '36px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  px: 2,
};
