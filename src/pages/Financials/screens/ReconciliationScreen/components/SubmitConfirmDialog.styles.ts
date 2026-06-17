import { styled } from '@mui/material/styles';
import { DialogTitle, DialogActions, Button } from '@mui/material';

export const StyledDialogTitle = styled(DialogTitle)(() => ({
  fontWeight: 800,
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const LowercaseButton = styled(Button)(() => ({
  textTransform: 'lowercase',
}));
