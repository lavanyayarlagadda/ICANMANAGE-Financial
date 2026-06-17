import { styled } from '@mui/material/styles';
import {
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
} from '@mui/material';

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1.5),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

export const DialogTitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  fontSize: '20px',
  color: theme.palette.text.primary,
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const GridContainer = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const OuterContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'editable',
})<{ editable?: boolean }>(({ theme, editable }) => ({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '4px',
  overflow: 'hidden',
  backgroundColor: editable ? theme.palette.background.paper : theme.palette.grey[100],
}));

export const LabelBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'editable',
})<{ editable?: boolean }>(({ theme, editable }) => ({
  backgroundColor: editable ? theme.palette.grey[50] : theme.palette.grey[200],
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  borderRight: `1px solid ${theme.palette.divider}`,
  width: '90px',
  display: 'flex',
  alignItems: 'center',
}));

export const LabelText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.secondary,
  lineHeight: 1.2,
}));

export const ValueBox = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInput-root': {
    fontSize: '12px',
    fontWeight: 600,
    '&:before': { display: 'none' },
    '&:after': { display: 'none' },
    '&.Mui-disabled': {
      color: theme.palette.text.primary,
      WebkitTextFillColor: theme.palette.text.secondary,
      opacity: 0.8,
    },
  },
}));

export const MainSplitBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '4px',
  overflow: 'hidden',
}));

export const LeftSplit = styled(Box)(({ theme }) => ({
  flex: 1,
  borderRight: `1px solid ${theme.palette.divider}`,
}));

export const SplitHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const HeaderText = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const HistoryContent = styled(Box)(() => ({
  padding: '16px',
  height: '140px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const EmptyHistoryText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontStyle: 'italic',
}));

export const RightSplit = styled(Box)(() => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}));

export const CommentContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  flex: 1,
}));

export const CommentField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    fontSize: '13px',
  },
}));

export const ActionRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  padding: '6px 16px',
  textTransform: 'none',
  fontWeight: 800,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

import HistoryIcon from '@mui/icons-material/History';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

export const StyledHistoryIcon = styled(HistoryIcon)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.text.secondary,
}));

export const StyledChatIcon = styled(ChatBubbleOutlineIcon)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.text.secondary,
}));
