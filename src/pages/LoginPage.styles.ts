import { styled } from '@mui/material/styles';
import { 
  Box, 
  Card, 
  Typography, 
  TypographyProps,
  TextField, 
  TextFieldProps,
  Button, 
  ButtonProps,
  Container 
} from '@mui/material';

export const LoginWrapper = styled(Box)(({ theme }) => ({
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
  padding: theme.spacing(5),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: theme.spacing(1.5),
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  },
}));

export const LogoImage = styled(Box)(({ theme }) => ({
  height: 48,
  marginBottom: theme.spacing(3),
})) as typeof Box;

export const LoginTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

export const LoginSubtitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

export const FormLabel = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
}));

export const StyledTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.inputBackground,
    borderRadius: theme.spacing(1),
    '& fieldset': {
      borderColor: theme.palette.cardBorder,
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

export const PasswordTextField = styled(StyledTextField)<TextFieldProps>({
  marginBottom: '8px',
  '& .MuiInputBase-input': {
    padding: '12px 14px',
    letterSpacing: '0.2em',
  },
});

export const SignInButton = styled(Button)<ButtonProps>(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#ffffff',
  padding: '10px 0',
  borderRadius: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  marginBottom: theme.spacing(4),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const FooterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
}));

export const CopyrightText = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.8125rem',
  textAlign: 'center',
}));
