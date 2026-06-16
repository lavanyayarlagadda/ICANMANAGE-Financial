import { styled } from '@mui/material/styles';
import { DialogTitle, DialogContent, DialogActions, Box, Typography } from '@mui/material';

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: theme.spacing(1),
}));

export const TitleText = styled(Typography)({
  fontWeight: 700,
});

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  paddingTop: theme.spacing(2),
}));

export const RowBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const LabelTypography = styled(Typography)({
  fontWeight: 600,
  textTransform: 'capitalize',
});

export const ValueTypography = styled(Typography)({
  fontWeight: 500,
  textAlign: 'right',
  maxWidth: '60%',
});

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingBottom: theme.spacing(2),
}));
