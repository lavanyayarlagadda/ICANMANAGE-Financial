import React from 'react';
import {
  Typography,
  Tab,
  MenuItem,
  useTheme,
  useMediaQuery,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardLayout from '@/components/templates/DashboardLayout/DashboardLayout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import KeyIcon from '@mui/icons-material/VpnKeyOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import { useUserProfilePage } from './UserProfilePage.hook';
import { NAV_CONFIG } from '@/config/navigation';
import * as styles from './UserProfilePage.styles';

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
      {value === index && <styles.StyledTabPanel>{children}</styles.StyledTabPanel>}
    </div>
  );
};

const UserProfilePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    user,
    tabIndex,
    username,
    setUsername,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    landingPage,
    successMessage,
    handleTabChange,
    handleUpdateUsername,
    handleChangePassword,
    handleLandingPageChange,
    getAccessiblePages,
    handleBack,
    isLoadingDetails,
    landingPageChanged,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    handleSavePreferences,
    profileChanged,
    passwordChanged,
  } = useUserProfilePage();

  if (!user) return null;

  return (
    <DashboardLayout>
      <styles.PageContainer>
        <styles.HeaderBox>
          <styles.BackButton onClick={handleBack}>
            <ArrowBackIcon />
          </styles.BackButton>
          <styles.PageTitle variant="h5">User Profile</styles.PageTitle>
        </styles.HeaderBox>
        <styles.Subtitle variant="body2" color="text.secondary">
          Manage your account settings and preferences.
        </styles.Subtitle>

        {successMessage && (
          <styles.StyledAlert severity="success">{successMessage}</styles.StyledAlert>
        )}

        <styles.TabsContainer>
          <styles.StyledTabs
            value={tabIndex}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab
              icon={<PersonOutlineIcon fontSize="small" />}
              iconPosition="start"
              label="Profile"
            />
            <Tab
              icon={<LockOutlinedIcon fontSize="small" />}
              iconPosition="start"
              label="Password"
            />
            <Tab
              icon={<SettingsOutlinedIcon fontSize="small" />}
              iconPosition="start"
              label="Preferences"
            />
          </styles.StyledTabs>
        </styles.TabsContainer>

        <TabPanel value={tabIndex} index={0}>
          <styles.StyledCard>
            <styles.CardTitle variant="subtitle1">Account Information</styles.CardTitle>
            <styles.CardSubtitle variant="body2" color="text.secondary">
              Update your username.
            </styles.CardSubtitle>
            <styles.InputLabel variant="subtitle2">Username</styles.InputLabel>
            <styles.StyledTextField
              fullWidth
              size="small"
              disabled
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <styles.InputLabel variant="subtitle2">Display Name</styles.InputLabel>
            <styles.FieldsRow>
              <styles.FieldCol>
                <styles.InputLabel variant="subtitle2">First Name</styles.InputLabel>
                <styles.StyledTextField
                  fullWidth
                  size="small"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </styles.FieldCol>
              <styles.FieldCol>
                <styles.InputLabel variant="subtitle2">Last Name</styles.InputLabel>
                <styles.StyledTextField
                  fullWidth
                  size="small"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </styles.FieldCol>
            </styles.FieldsRow>
            <styles.WarningAlert severity="warning">
              If you update your profile details, you will need to log out and log back in for the
              changes to take effect.
            </styles.WarningAlert>
            <styles.ActionsBox>
              <styles.PrimaryButton
                variant="contained"
                disabled={!profileChanged}
                startIcon={<EditIcon fontSize="small" />}
                onClick={handleUpdateUsername}
              >
                Update Profile
              </styles.PrimaryButton>
            </styles.ActionsBox>
          </styles.StyledCard>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <styles.StyledCard>
            <styles.CardTitle variant="subtitle1">Change Password</styles.CardTitle>
            <styles.CardSubtitle variant="body2" color="text.secondary">
              Update your login password.
            </styles.CardSubtitle>
            <styles.InputLabel variant="subtitle2">Current Password</styles.InputLabel>
            <styles.StyledTextField
              fullWidth
              type="password"
              size="small"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <styles.InputLabel variant="subtitle2">New Password</styles.InputLabel>
            <styles.NewPasswordField
              fullWidth
              type="password"
              size="small"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <styles.CaptionBlock variant="caption" color="text.secondary">
              Use 8+ characters with uppercase, lowercase, numbers, and special characters.
            </styles.CaptionBlock>
            <styles.InputLabel variant="subtitle2">Confirm New Password</styles.InputLabel>
            <styles.ConfirmPasswordField
              fullWidth
              type="password"
              size="small"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <styles.ActionsBox>
              <styles.PrimaryButton
                variant="contained"
                disabled={!passwordChanged}
                startIcon={<KeyIcon fontSize="small" />}
                onClick={handleChangePassword}
              >
                Change Password
              </styles.PrimaryButton>
            </styles.ActionsBox>
          </styles.StyledCard>
        </TabPanel>

        <TabPanel value={tabIndex} index={2}>
          <styles.StyledCard>
            <styles.CardTitle variant="subtitle1">User Preferences</styles.CardTitle>
            <styles.CardSubtitle variant="body2" color="text.secondary">
              Customize your application experience.
            </styles.CardSubtitle>
            <styles.PreferenceHeader>
              <styles.PreferenceLabel variant="subtitle2">
                Default Landing Page
              </styles.PreferenceLabel>
              <Typography variant="caption" color="primary">
                Current: {landingPage}
              </Typography>
            </styles.PreferenceHeader>
            <styles.StyledSelect
              fullWidth
              size="small"
              disabled={user?.role === 'user' || user?.username === 'demo' || isLoadingDetails}
              value={landingPage}
              onChange={(e: SelectChangeEvent<string>) => handleLandingPageChange(e.target.value)}
            >
              {getAccessiblePages().map((pageLabel) => (
                <MenuItem key={pageLabel} value={pageLabel}>
                  {pageLabel}
                </MenuItem>
              ))}
            </styles.StyledSelect>
            <styles.CaptionBlockBottom variant="caption" color="text.secondary">
              Your browser will navigate to {NAV_CONFIG[landingPage]?.path || '/'} after you click
              confirm.
            </styles.CaptionBlockBottom>
            <styles.ActionsBox>
              <styles.PrimaryButton
                variant="contained"
                disabled={isLoadingDetails || !landingPageChanged}
                startIcon={
                  isLoadingDetails ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <SaveIcon fontSize="small" />
                  )
                }
                onClick={handleSavePreferences}
              >
                {isLoadingDetails ? 'Saving...' : 'Confirm Preference'}
              </styles.PrimaryButton>
            </styles.ActionsBox>
          </styles.StyledCard>
        </TabPanel>
      </styles.PageContainer>
    </DashboardLayout>
  );
};

export default UserProfilePage;
