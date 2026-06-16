import { styled } from '@mui/material/styles';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
} from '@mui/material';

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

export const FormBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  marginTop: 1,
});

export const StyledTextField = styled(TextField)({
  '& .MuiInputLabel-root': {
    textTransform: 'capitalize',
  },
});

export const StyledDialogActions = styled(DialogActions)({
  paddingLeft: 3,
  paddingRight: 3,
  paddingBottom: 2,
});
