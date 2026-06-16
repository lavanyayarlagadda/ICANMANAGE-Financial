import { styled } from '@mui/material/styles';
import { DialogTitle, DialogActions } from '@mui/material';

export const StyledDialogTitle = styled(DialogTitle)(() => ({
  fontWeight: 700,
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingBottom: theme.spacing(2),
}));
