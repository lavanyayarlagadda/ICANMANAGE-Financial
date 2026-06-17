import { styled } from '@mui/material/styles';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
} from '@mui/material';

export const TitleContainer = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const TitleFlexBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));

export const TitleText = styled(Typography)(() => ({
  fontWeight: 800,
}));

export const ContentContainer = styled(DialogContent)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}));

export const InstructionText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
  fontWeight: 600,
}));

export const HighlightTxNo = styled('span')(({ theme }) => ({
  display: 'inline',
  color: theme.palette.primary.main,
  fontWeight: 800,
}));

export const UserSelectField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const ActionsContainer = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0,
}));

export const CancelButton = styled(Button)(() => ({
  textTransform: 'none',
  fontWeight: 700,
}));

export const AssignButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 800,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));
