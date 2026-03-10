import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    Tabs,
    Tab,
    TextField,
    Button,
    Select,
    MenuItem,
    useTheme,
    Alert,
    IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardLayout from '@/components/templates/DashboardLayout';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { themeConfig } from '@/theme';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import KeyIcon from '@mui/icons-material/VpnKeyOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';

const TabPanel = (props: { children?: React.ReactNode; index: number; value: number }) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 0, mt: 2 }}>{children}</Box>
            )}
        </div>
    );
};

const UserProfilePage: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const [tabIndex, setTabIndex] = useState(0);

    // Profile
    const [username, setUsername] = useState(user?.username || '');

    // Passwords
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Preferences
    const [landingPage, setLandingPage] = useState(user?.defaultLandingPage || 'Financials');

    // Success messages state
    const [successMessage, setSuccessMessage] = useState('');

    if (!user) return null;

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
        setSuccessMessage('');
    };

    const handleUpdateUsername = () => {
        setSuccessMessage('Username updated successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleChangePassword = () => {
        setSuccessMessage('Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleSavePreferences = () => {
        setSuccessMessage('Preferences saved successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    return (
        <DashboardLayout>
            <Box sx={{ maxWidth: 800, margin: '0 auto', py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ mr: 1, color: themeConfig.colors.text.primary }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        User Profile
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
                    Manage your account settings and preferences.
                </Typography>

                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}

                {/* Tabs navigation */}
                <Box sx={{ backgroundColor: themeConfig.colors.surfaceAlt, borderRadius: 2, p: 0.5, mb: 3 }}>
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        TabIndicatorProps={{ style: { display: 'none' } }}
                        sx={{
                            minHeight: 'unset',
                            '& .MuiTab-root': {
                                py: 1,
                                minHeight: 'unset',
                                textTransform: 'none',
                                fontWeight: 600,
                                color: themeConfig.colors.text.secondary,
                                borderRadius: 1.5,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 1,
                                '&.Mui-selected': {
                                    color: themeConfig.colors.text.primary,
                                    backgroundColor: themeConfig.colors.surface,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                }
                            }
                        }}
                    >
                        <Tab icon={<PersonOutlineIcon fontSize="small" />} iconPosition="start" label="Profile" />
                        <Tab icon={<LockOutlinedIcon fontSize="small" />} iconPosition="start" label="Password" />
                        <Tab icon={<SettingsOutlinedIcon fontSize="small" />} iconPosition="start" label="Preferences" />
                    </Tabs>
                </Box>

                {/* PROFILE TAB */}
                <TabPanel value={tabIndex} index={0}>
                    <Card sx={{ p: 3, border: `1px solid ${themeConfig.colors.border}`, boxShadow: 'none' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Account Information
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Update your username.
                        </Typography>

                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Username
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ mb: 2, backgroundColor: '#FAFBFC' }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                startIcon={<EditIcon fontSize="small" />}
                                onClick={handleUpdateUsername}
                                sx={{ backgroundColor: themeConfig.colors.primary }}
                            >
                                Update Username
                            </Button>
                        </Box>
                    </Card>
                </TabPanel>

                {/* PASSWORD TAB */}
                <TabPanel value={tabIndex} index={1}>
                    <Card sx={{ p: 3, border: `1px solid ${themeConfig.colors.border}`, boxShadow: 'none' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Change Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Update your login password.
                        </Typography>

                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Current Password
                        </Typography>
                        <TextField
                            fullWidth
                            type="password"
                            size="small"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            sx={{ mb: 2, backgroundColor: '#FAFBFC' }}
                        />

                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            New Password
                        </Typography>
                        <TextField
                            fullWidth
                            type="password"
                            size="small"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            sx={{ mb: 1, backgroundColor: '#FAFBFC' }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                            Use 8+ characters with uppercase, lowercase, numbers, and special characters. Avoid sequences or repeated characters.
                        </Typography>

                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Confirm New Password
                        </Typography>
                        <TextField
                            fullWidth
                            type="password"
                            size="small"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ mb: 3, backgroundColor: '#FAFBFC' }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                startIcon={<KeyIcon fontSize="small" />}
                                onClick={handleChangePassword}
                                sx={{ backgroundColor: themeConfig.colors.primary }}
                            >
                                Change Password
                            </Button>
                        </Box>
                    </Card>
                </TabPanel>

                {/* PREFERENCES TAB */}
                <TabPanel value={tabIndex} index={2}>
                    <Card sx={{ p: 3, border: `1px solid ${themeConfig.colors.border}`, boxShadow: 'none' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            User Preferences
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Customize your application experience.
                        </Typography>

                        {user?.role !== 'user' && (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        Default Landing Page
                                    </Typography>
                                    <Typography variant="caption" color="primary">
                                        Current: {landingPage}
                                    </Typography>
                                </Box>

                                <Select
                                    fullWidth
                                    size="small"
                                    value={landingPage}
                                    onChange={(e) => setLandingPage(e.target.value)}
                                    sx={{ mb: 3, backgroundColor: '#FAFBFC' }}
                                >
                                    {user?.accessibleModules.map(module => (
                                        <MenuItem key={module} value={module}>{module}</MenuItem>
                                    ))}
                                </Select>
                            </>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                startIcon={<SaveIcon fontSize="small" />}
                                onClick={handleSavePreferences}
                                sx={{ backgroundColor: themeConfig.colors.primary }}
                            >
                                Save Preferences
                            </Button>
                        </Box>
                    </Card>
                </TabPanel>

            </Box>
        </DashboardLayout>
    );
};

export default UserProfilePage;
