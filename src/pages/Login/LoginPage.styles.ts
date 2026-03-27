import { styled } from '@mui/material/styles';
import { Box, Card, Typography, TextField, Button, TypographyProps, ButtonProps } from '@mui/material';

export const LoginBackground = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
}));

export const LoginCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 420,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(6),
  },
}));

export const LogoImage = styled('img')({
  height: 48,
  marginBottom: '24px',
});

export const LoginTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
  fontFamily: theme.typography.h4.fontFamily,
}));

export const LoginSubtitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.inputBackground,
    borderRadius: theme.shape.borderRadius,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 14px',
  },
}));

export const SubmitButton = styled(Button)<ButtonProps>(({ theme }) => ({
  margin: theme.spacing(4, 0),
  padding: theme.spacing(1.5, 0),
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
}));

export const FooterText = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.8125rem',
  textAlign: 'center',
  marginTop: theme.spacing(2),
}));
