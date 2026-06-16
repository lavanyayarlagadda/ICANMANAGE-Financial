import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  TypographyProps,
  ButtonProps,
  Container,
  Alert,
  Link,
  LinkProps,
  AlertProps,
  ContainerProps,
} from '@mui/material';

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

export const LoginSubtitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'hasError',
})<TypographyProps & { hasError?: boolean }>(({ theme, hasError }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
  marginBottom: theme.spacing(hasError ? 2 : 4),
  marginTop: theme.spacing(1),
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

export const LoginContainer = styled(Container)<ContainerProps>({
  display: 'flex',
  justifyContent: 'center',
});

export const StyledAlert = styled(Alert)<AlertProps>(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
}));

export const LoginForm = styled(Box)<{
  component?: React.ElementType;
  noValidate?: boolean;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}>({
  width: '100%',
});

export const InputLabel = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(0.5),
}));

export const ForgotPasswordWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(-1),
  marginBottom: theme.spacing(2),
}));

export const TermsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
}));

export const TermsLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'isLoading',
})<LinkProps & { isLoading?: boolean; to?: string; component?: React.ElementType }>(
  ({ theme, isLoading }) => ({
    color: theme.palette.text.secondary,
    cursor: isLoading ? 'default' : 'pointer',
    pointerEvents: isLoading ? 'none' : 'auto',
    opacity: isLoading ? 0.6 : 1,
  }),
);

export const PasswordTextField = styled(StyledTextField)({
  '& .MuiInputBase-input': {
    letterSpacing: '0.25em',
  },
});

export const BackToLoginWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

export const BackToLoginLink = styled(Link)<
  LinkProps & { component?: React.ElementType; to?: string }
>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontWeight: 500,
  color: theme.palette.primary.main,
}));
