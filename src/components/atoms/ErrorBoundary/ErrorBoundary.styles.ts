import { styled } from '@mui/material/styles';
import { Box, Paper, Typography, TypographyProps, PaperProps } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const ErrorContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  textAlign: 'center',
});

export const ErrorPaper = styled(Paper)<PaperProps>(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: (theme.shape.borderRadius as number) * 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
}));

export const ErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: 80,
  color: theme.palette.error.main,
  marginBottom: theme.spacing(2),
}));

export const ErrorDescription = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(4),
  maxWidth: 500,
}));

export const DetailsBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  textAlign: 'left',
  width: '100%',
  overflowX: 'auto',
}));

export const PreText = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.error.dark,
}));

export const ActionsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));
