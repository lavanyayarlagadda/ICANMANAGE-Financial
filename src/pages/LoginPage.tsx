import React, { useState } from 'react';
import {
    Box,
    Card,
    Typography,
    TextField,
    Button,
    Link,
    IconButton,
    InputAdornment,
    Container,
    Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { themeConfig } from '@/theme';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSuccess } from '@/store/slices/authSlice';
import { MOCK_CREDENTIALS, LOGIN_API_RESPONSE, USER_DETAILS_API_RESPONSE } from '@/utils/dummyData';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('ajohnson');
    const [password, setPassword] = useState('password123');
    const [errorMsg, setErrorMsg] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Get the redirect location if we came from a protected route
    const from = location.state?.from?.pathname || '/financials';

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleLogin = () => {
        setErrorMsg('');
        const validCredential = MOCK_CREDENTIALS.find(
            (c) => c.username === username && c.password === password
        );

        if (validCredential) {
            const loginUser = LOGIN_API_RESPONSE.find(u => u.id === validCredential.userId);

            if (loginUser) {
                const userDetails = USER_DETAILS_API_RESPONSE.find(d => d.userId === loginUser.id);

                if (userDetails) {
                    const fullUser = {
                        ...loginUser,
                        ...userDetails
                    };

                    dispatch(loginSuccess(fullUser));

                    // Map the default landing page string to a route
                    const landingPageRoute = fullUser.defaultLandingPage.toLowerCase() === 'collections' ? '/collections' : '/financials';
                    const redirectTo = location.state?.from?.pathname || landingPageRoute;

                    navigate(redirectTo, { replace: true });
                } else {
                    setErrorMsg('User details not found');
                }
            } else {
                setErrorMsg('User profile not found');
            }
        } else {
            setErrorMsg('Invalid username or password');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: themeConfig.colors.background,
                padding: 2,
            }}
        >
            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card
                    sx={{
                        width: '100%',
                        maxWidth: 420,
                        padding: { xs: 3, md: 5 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 3,
                        boxShadow: themeConfig.shadows.card,
                        backgroundColor: themeConfig.colors.surface,
                    }}
                >
                    {/* Logo Section */}
                    <Box
                        component="img"
                        src="/cognitiveLogo.svg"
                        alt="CognitiveHealth Logo"
                        sx={{
                            height: 48,
                            marginBottom: 3,
                        }}
                    />

                    {/* Title and Subtitle */}
                    <Typography
                        variant="h4"
                        component="h1"
                        sx={{
                            fontWeight: 700,
                            color: '#000000',
                            marginBottom: 1,
                            fontFamily: themeConfig.typography.fontFamily.primary,
                        }}
                    >
                        iCAN Manage
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: themeConfig.colors.text.secondary,
                            marginBottom: errorMsg ? 2 : 4,
                            textAlign: 'center',
                        }}
                    >
                        Enter your credentials to access your account.
                    </Typography>

                    {errorMsg && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {errorMsg}
                        </Alert>
                    )}

                    {/* Form */}
                    <Box component="form" sx={{ width: '100%' }} noValidate>
                        {/* Username Field */}
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                color: '#000000',
                                marginBottom: 0.5,
                            }}
                        >
                            Username
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{
                                marginBottom: 2,
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#F0F4F8',
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: '#E2E8F0',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: themeConfig.colors.primaryLight,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: themeConfig.colors.primary,
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    padding: '12px 14px',
                                },
                            }}
                        />

                        {/* Password Field */}
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                color: '#000000',
                                marginBottom: 0.5,
                            }}
                        >
                            Password
                        </Typography>
                        <TextField
                            fullWidth
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
                                            sx={{ color: themeConfig.colors.primary }}
                                        >
                                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                marginBottom: 1,
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#F0F4F8',
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: '#E2E8F0',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: themeConfig.colors.primaryLight,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: themeConfig.colors.primary,
                                    },
                                },
                                '& .MuiInputBase-input': {
                                    padding: '12px 14px',
                                    letterSpacing: '0.2em',
                                },
                            }}
                        />

                        {/* Forgot Password Link */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 3 }}>
                            <Link
                                href="#"
                                underline="hover"
                                sx={{
                                    color: themeConfig.colors.primary,
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                }}
                            >
                                Forgot password?
                            </Link>
                        </Box>

                        {/* Sign In Button */}
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleLogin}
                            startIcon={<LockOutlined />}
                            sx={{
                                backgroundColor: themeConfig.colors.primary,
                                color: '#ffffff',
                                padding: '10px 0',
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                marginBottom: 4,
                                '&:hover': {
                                    backgroundColor: themeConfig.colors.primaryDark,
                                },
                            }}
                        >
                            Sign In
                        </Button>
                    </Box>

                    {/* Footer Links */}
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', marginBottom: 1 }}>
                        <Link href="#" underline="hover" sx={{ color: themeConfig.colors.primary, fontSize: '0.8125rem' }}>
                            Terms of Service
                        </Link>
                        <Typography sx={{ color: themeConfig.colors.text.secondary, fontSize: '0.8125rem' }}>
                            •
                        </Typography>
                        <Link href="#" underline="hover" sx={{ color: themeConfig.colors.primary, fontSize: '0.8125rem' }}>
                            Privacy Policy
                        </Link>
                    </Box>
                    <Typography
                        sx={{
                            color: themeConfig.colors.text.secondary,
                            fontSize: '0.8125rem',
                            textAlign: 'center',
                        }}
                    >
                        © 2026 CognitiveHealth LLC. | v16.9.6
                    </Typography>
                </Card>
            </Container>
        </Box>
    );
};

export default LoginPage;
