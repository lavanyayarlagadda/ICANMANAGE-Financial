import { styled } from '@mui/material/styles';
import { Snackbar, Alert, Box } from '@mui/material';

export const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  top: 16,
  [theme.breakpoints.up('sm')]: {
    top: 24,
  },
}));

export const StyledAlert = styled(Alert)(({ theme }) => ({
  width: '100%',
  minWidth: '90vw',
  borderRadius: '8px', // themeConfig or theme.shape.borderRadius * 2
  fontWeight: 500,
  '& .MuiAlert-icon': {
    fontSize: 24,
  },
  [theme.breakpoints.up('sm')]: {
    minWidth: '400px',
  },
}));

export const ActionBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));
