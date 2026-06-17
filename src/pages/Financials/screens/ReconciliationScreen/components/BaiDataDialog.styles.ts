import { styled } from '@mui/material/styles';
import { DialogTitle, DialogContent, Box, Typography } from '@mui/material';

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(2.5),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: theme.palette.grey[50],
}));

export const HeaderLeftBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}));

export const IconContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: '10px',
  backgroundColor: theme.palette.info.main,
  color: theme.palette.common.white,
  display: 'flex',
}));

export const HeaderTitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 900,
  color: theme.palette.text.primary,
}));

export const HeaderSubText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 800,
}));

export const StyledDialogContent = styled(DialogContent)(() => ({
  padding: 0,
}));

export const FooterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  backgroundColor: theme.palette.grey[50],
}));

export const FooterText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontStyle: 'italic',
}));
