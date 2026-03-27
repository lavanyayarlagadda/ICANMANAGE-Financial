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
import { loginSuccess } from '@/store/slices/authSlice';
import { MOCK_CREDENTIALS, LOGIN_API_RESPONSE, USER_DETAILS_API_RESPONSE } from '@/utils/dummyData';
import {
    LoginWrapper,
    LoginCard,
    LogoImage,
    LoginTitle,
    LoginSubtitle,
    FormLabel,
    StyledTextField,
    PasswordTextField,
    SignInButton,
    FooterContainer,
    CopyrightText,
} from './LoginPage.styles';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('ajohnson');
    const [password, setPassword] = useState('password123');
    const [errorMsg, setErrorMsg] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine target redirect after login
    const targetPath = location.state?.from?.pathname;

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleLogin = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setErrorMsg('');
        
        const validCredential = MOCK_CREDENTIALS.find(
            (c) => c.username === username && c.password === password
        );

        if (validCredential) {
            const loginUser = LOGIN_API_RESPONSE.find(u => u.id === validCredential.userId);
            const userDetails = loginUser ? USER_DETAILS_API_RESPONSE.find(d => d.userId === loginUser.id) : null;

            if (loginUser && userDetails) {
                const fullUser = { ...loginUser, ...userDetails };
                dispatch(loginSuccess(fullUser));

                const landingPageRoute = fullUser.defaultLandingPage?.toLowerCase() === 'collections' ? '/collections' : '/financials';
                const redirectTo = targetPath || landingPageRoute;

                navigate(redirectTo, { replace: true });
            } else {
                setErrorMsg('User profile or details not found');
            }
        } else {
            setErrorMsg('Invalid username or password');
        }
    };

    return (
        <LoginWrapper>
            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
                <LoginCard elevation={0}>
                    <LogoImage
                        component="img"
                        src="/cognitiveLogo.svg"
                        alt="CognitiveHealth Logo"
                    />

                    <LoginTitle variant="h4" component="h1">
                        iCAN Manage
                    </LoginTitle>
                    <LoginSubtitle variant="body1">
                        Enter your credentials to access your account.
                    </LoginSubtitle>

                    {errorMsg && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {errorMsg}
                        </Alert>
                    )}

                    <Box component="form" sx={{ width: '100%' }} noValidate onSubmit={handleLogin}>
                        <FormLabel variant="subtitle2">Username</FormLabel>
                        <StyledTextField
                            fullWidth
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <FormLabel variant="subtitle2">Password</FormLabel>
                        <PasswordTextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 3 }}>
                            <Link href="#" underline="hover" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                Forgot password?
                            </Link>
                        </Box>

                        <SignInButton
                            fullWidth
                            variant="contained"
                            size="large"
                            type="submit"
                            startIcon={<LockOutlined />}
                        >
                            Sign In
                        </SignInButton>
                    </Box>

                    <FooterContainer>
                        <Link href="#" underline="hover" sx={{ fontSize: '0.8125rem' }}>Terms of Service</Link>
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.8125rem' }}>•</Typography>
                        <Link href="#" underline="hover" sx={{ fontSize: '0.8125rem' }}>Privacy Policy</Link>
                    </FooterContainer>
                    <CopyrightText>
                        © 2026 CognitiveHealth LLC. | v16.9.6
                    </CopyrightText>
                </LoginCard>
            </Container>
        </LoginWrapper>
    );
};

export default LoginPage;
