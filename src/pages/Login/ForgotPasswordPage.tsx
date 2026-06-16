import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import pkg from '../../../package.json';
import { Box, Typography, Link, Container, Alert } from '@mui/material';
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
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
        <LoginCard elevation={0}>
          <LogoImage src="/cognitiveLogo.svg" alt="CognitiveHealth Logo" />

          <LoginTitle variant="h4" component="h1">
            Forgot Password
          </LoginTitle>

          <LoginSubtitle variant="body1" sx={{ mb: message ? 2 : 4, mt: 1 }}>
            Enter your email to receive a password reset link.
          </LoginSubtitle>

          {message && (
            <Alert severity={message.type} sx={{ width: '100%', mb: 2 }}>
              {message.text}
            </Alert>
          )}

          <Box component="form" sx={{ width: '100%' }} noValidate onSubmit={handleSubmit}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Email Address
            </Typography>
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
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 1, mt: 2 }}>
            <Link
              component={RouterLink}
              to="/login"
              variant="body2"
              underline="hover"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontWeight: 500,
                color: 'primary.main',
              }}
            >
              <ArrowBack fontSize="small" /> Back to Login
            </Link>
          </Box>
          <FooterText variant="caption">
            © {new Date().getFullYear()} CognitiveHealth LLC. | v{pkg.version}
          </FooterText>
        </LoginCard>
      </Container>
    </LoginBackground>
  );
};

export default ForgotPasswordPage;
