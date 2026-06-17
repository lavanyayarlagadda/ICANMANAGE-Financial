import { styled } from '@mui/material/styles';
import { DialogTitle, DialogContent, Box, Typography, IconButton } from '@mui/material';

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: theme.palette.grey[800],
  color: theme.palette.common.white,
}));

export const HeaderLeftContainer = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}));

export const HeaderTitle = styled(Typography)(() => ({
  fontWeight: 900,
}));

export const CloseIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  minHeight: '600px',
  backgroundColor: theme.palette.grey[900],
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const ReceiptPaper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  flex: 1,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(5),
  boxShadow: theme.shadows[10],
}));

export const ReceiptHeader = styled(Box)(({ theme }) => ({
  borderBottom: `2px solid ${theme.palette.divider}`,
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

export const ReceiptTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 900,
}));

export const ReceiptSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const ReceiptBody = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const FlexRow = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

export const LabelText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.disabled,
}));

export const ValueText = styled(Typography)(() => ({
  fontWeight: 700,
}));

export const PlaceholderDoc = styled(Box)(({ theme }) => ({
  height: '300px',
  width: '100%',
  background: `linear-gradient(45deg, ${theme.palette.grey[50]} 25%, transparent 25%, transparent 75%, ${theme.palette.grey[50]} 75%, ${theme.palette.grey[50]}), linear-gradient(45deg, ${theme.palette.grey[50]} 25%, transparent 25%, transparent 75%, ${theme.palette.grey[50]} 75%, ${theme.palette.grey[50]})`,
  backgroundSize: '40px 40px',
  backgroundPosition: '0 0, 20px 20px',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
}));

export const FooterText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.text.disabled,
}));
