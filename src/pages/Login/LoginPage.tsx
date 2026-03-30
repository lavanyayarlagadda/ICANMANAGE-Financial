import React from 'react';
import {
    Box,
    Typography,
    Link,
    IconButton,
    InputAdornment,
    Container,
    Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import {
    LoginBackground,
    LoginCard,
    LogoImage,
    LoginTitle,
    LoginSubtitle,
    StyledTextField,
    SubmitButton,
    FooterText
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
            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
                <LoginCard elevation={0}>
                    <LogoImage src="/cognitiveLogo.svg" alt="CognitiveHealth Logo" />

                    <LoginTitle variant="h4" component="h1">
                        iCAN Manage
                    </LoginTitle>
                    
                    <LoginSubtitle variant="body1" sx={{ mb: errorMsg ? 2 : 4 }}>
                        Enter your credentials to access your account.
                    </LoginSubtitle>

                    {errorMsg && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {errorMsg}
                        </Alert>
                    )}

                    <Box component="form" sx={{ width: '100%' }} noValidate onSubmit={handleLogin}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Username
                        </Typography>
                        <StyledTextField
                            fullWidth
                            variant="outlined"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Password
                        </Typography>
                        <StyledTextField
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
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiInputBase-input': {
                                    letterSpacing: '0.25em',
                                },
                            }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1, mb: 2 }}>
                            <Link href="#" variant="body2" underline="hover" fontWeight={500}>
                                Forgot password?
                            </Link>
                        </Box>

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
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 1 }}>
                        <Link href="#" variant="caption" underline="hover">
                            Terms of Service
                        </Link>
                        <Typography variant="caption" color="text.secondary">•</Typography>
                        <Link href="#" variant="caption" underline="hover">
                            Privacy Policy
                        </Link>
                    </Box>
                    <FooterText variant="caption">
                        © 2026 CognitiveHealth LLC. | v16.9.6
                    </FooterText>
                </LoginCard>
            </Container>
        </LoginBackground>
    );
};

export default LoginPage;
