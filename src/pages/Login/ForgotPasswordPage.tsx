import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import pkg from '../../../package.json';

import { MailOutlined, ArrowBack } from '@mui/icons-material';
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
  BackToLoginWrapper,
  BackToLoginLink,
} from './LoginPage.styles';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ text: 'Please enter your email address.', type: 'error' });
      return;
    }
    // Mock submit
    setIsLoading(true);
    setMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ text: 'If an account exists, a reset link has been sent.', type: 'success' });
      setEmail('');
    }, 1500);
  };

  return (
    <LoginBackground>
      <LoginContainer maxWidth="sm">
        <LoginCard elevation={0}>
          <LogoImage src="/cognitiveLogo.svg" alt="CognitiveHealth Logo" />

          <LoginTitle variant="h4" component="h1">
            Forgot Password
          </LoginTitle>

          <LoginSubtitle variant="body1" hasError={!!message}>
            Enter your email to receive a password reset link.
          </LoginSubtitle>

          {message && <StyledAlert severity={message.type}>{message.text}</StyledAlert>}

          <LoginForm component="form" noValidate onSubmit={handleSubmit}>
            <InputLabel variant="subtitle2">Email Address</InputLabel>
            <StyledTextField
              fullWidth
              variant="outlined"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <SubmitButton
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={!isLoading && <MailOutlined />}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </SubmitButton>
          </LoginForm>

          <BackToLoginWrapper>
            <BackToLoginLink component={RouterLink} to="/login" variant="body2" underline="hover">
              <ArrowBack fontSize="small" /> Back to Login
            </BackToLoginLink>
          </BackToLoginWrapper>
          <FooterText variant="caption">
            © {new Date().getFullYear()} CognitiveHealth LLC. | v{pkg.version}
          </FooterText>
        </LoginCard>
      </LoginContainer>
    </LoginBackground>
  );
};

export default ForgotPasswordPage;
