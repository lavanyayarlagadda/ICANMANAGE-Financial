import React, { useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCredentials } from '@/store/slices/authSlice';
import { useLoginMutation } from '@/store/api/authApi';
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

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('ajohnson');
    const [password, setPassword] = useState('password123');
    const [errorMsg, setErrorMsg] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [login, { isLoading }] = useLoginMutation();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        
        if (!username || !password) {
            setErrorMsg('Please enter both username and password');
            return;
        }

        try {
            const result = await login({ username, password }).unwrap();
            dispatch(setCredentials({
                user: result.user,
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
            }));

            // Always land on the default landing page regardless of where we came from
            const landingPageRoute = result.user.role === 'Admin' ? '/financials/all-transactions' : '/collections';
            navigate(landingPageRoute, { replace: true });
        } catch (err: any) {
            console.error('Login failed:', err);
            setErrorMsg(err.data?.message || 'Invalid username or password');
        }
    };

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
                                            onClick={handleClickShowPassword}
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
