import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import pkg from '../../../package.json';
import { IconButton, InputAdornment, Link } from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import {
  LoginBackground,
  LoginCard,
  LogoImage,
  LoginTitle,
  LoginSubtitle,
  StyledTextField,
  SubmitButton,
  FooterText,
  LoginContainer,
  StyledAlert,
  LoginForm,
  InputLabel,
  PasswordTextField,
  ForgotPasswordWrapper,
  TermsWrapper,
  TermsLink,
} from './LoginPage.styles';
import { useLoginPage } from './LoginPage.hook';

const LoginPage = () => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    errorMsg,
    isLoading,
    togglePasswordVisibility,
    handleMouseDownPassword,
    handleLogin,
  } = useLoginPage();

  return (
    <LoginBackground>
      <LoginContainer maxWidth="sm">
        <LoginCard elevation={0}>
          <LogoImage src="/cognitiveLogo.svg" alt="CognitiveHealth Logo" />

          <LoginTitle variant="h4" component="h1">
            iCAN Manage
          </LoginTitle>

          <LoginSubtitle variant="body1" hasError={!!errorMsg}>
            Enter your credentials to access your account.
          </LoginSubtitle>

          {errorMsg && <StyledAlert severity="error">{errorMsg}</StyledAlert>}

          <LoginForm component="form" noValidate onSubmit={handleLogin}>
            <InputLabel variant="subtitle2">Username</InputLabel>
            <StyledTextField
              fullWidth
              variant="outlined"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <InputLabel variant="subtitle2">Password</InputLabel>
            <PasswordTextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="small"
                      color="primary"
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <ForgotPasswordWrapper>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                underline="hover"
                fontWeight={500}
              >
                Forgot password?
              </Link>
            </ForgotPasswordWrapper>

            <SubmitButton
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={!isLoading && <LockOutlined />}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </SubmitButton>
          </LoginForm>

          <TermsWrapper>
            <TermsLink
              component={isLoading ? 'span' : RouterLink}
              to={isLoading ? '' : '/terms'}
              variant="caption"
              underline={isLoading ? 'none' : 'hover'}
              isLoading={isLoading}
            >
              Terms of Service
            </TermsLink>
          </TermsWrapper>
          <FooterText variant="caption">
            © {new Date().getFullYear()} CognitiveHealth LLC. | v{pkg.version}
          </FooterText>
        </LoginCard>
      </LoginContainer>
    </LoginBackground>
  );
};

export default LoginPage;
