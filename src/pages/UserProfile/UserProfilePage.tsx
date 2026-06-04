import React from 'react';
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
  useMediaQuery,
  Alert,
  IconButton,
  CircularProgress,
  Checkbox,
  ListItemText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardLayout from '@/components/templates/DashboardLayout/DashboardLayout';
import { themeConfig } from '@/theme';
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
      {value === index && <Box sx={{ p: 0, mt: 2 }}>{children}</Box>}
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
    selectedColumns,
    setSelectedColumns,
    handleSavePreferences,
    currentPageConfig,
    getColumnsForGrid,
  } = useUserProfilePage();

  if (!user) return null;

  return (
    <DashboardLayout>
      <Box sx={styles.pageContainerStyles}>
        <Box sx={styles.headerBoxStyles}>
          <IconButton onClick={handleBack} sx={{ mr: 1, color: themeConfig.colors.text.primary }}>
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

        <Box sx={styles.tabsContainerStyles}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons="auto"
            allowScrollButtonsMobile
            TabIndicatorProps={{ style: { display: 'none' } }}
            sx={styles.tabsStyles}
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
          </Tabs>
        </Box>

        <TabPanel value={tabIndex} index={0}>
          <Card sx={styles.cardStyles}>
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
              disabled
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ ...styles.textFieldStyles, mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
              Display Name (Optional)
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <TextField
                fullWidth
                size="small"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={styles.textFieldStyles}
              />
              <TextField
                fullWidth
                size="small"
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                sx={styles.textFieldStyles}
              />
            </Box>
            <Box sx={styles.actionsBoxStyles}>
              <Button
                variant="contained"
                startIcon={<EditIcon fontSize="small" />}
                onClick={handleUpdateUsername}
                sx={{ backgroundColor: themeConfig.colors.primary }}
              >
                Update Profile
              </Button>
            </Box>
          </Card>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <Card sx={styles.cardStyles}>
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
              sx={styles.textFieldStyles}
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
              sx={{ ...styles.textFieldStyles, mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Use 8+ characters with uppercase, lowercase, numbers, and special characters.
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
              sx={{ ...styles.textFieldStyles, mb: 3 }}
            />
            <Box sx={styles.actionsBoxStyles}>
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

        <TabPanel value={tabIndex} index={2}>
          <Card sx={styles.cardStyles}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              User Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Customize your application experience.
            </Typography>
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
              disabled={user?.role === 'user' || user?.username === 'demo' || isLoadingDetails}
              value={landingPage}
              onChange={(e) => handleLandingPageChange(e.target.value)}
              sx={{ ...styles.textFieldStyles, mb: 1 }}
            >
              {getAccessiblePages().map((pageLabel) => (
                <MenuItem key={pageLabel} value={pageLabel}>
                  {pageLabel}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
              Your browser will navigate to {NAV_CONFIG[landingPage]?.path || '/'} automatically
              after selection.
            </Typography>
            {currentPageConfig.hasGrids ? (
              <>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
                  Select which columns to display by default when visiting this page.
                </Typography>
                
                {currentPageConfig.grids.map((grid) => {
                  const gridColumns = getColumnsForGrid(grid);
                  const selectedForGrid = selectedColumns[grid.name] || [];

                  return (
                    <Box key={grid.name} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Default Columns for {grid.name}
                      </Typography>
                      <Select
                        fullWidth
                        multiple
                        size="small"
                        value={selectedForGrid}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedColumns((prev) => ({
                            ...prev,
                            [grid.name]: typeof value === 'string' ? value.split(',') : value as string[],
                          }));
                        }}
                        displayEmpty
                        disabled={user?.role === 'user' || user?.username === 'demo' || isLoadingDetails}
                        sx={{ ...styles.textFieldStyles, mb: 1 }}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <em>Select columns to display</em>;
                          }
                          return selected.join(', ');
                        }}
                      >
                        {gridColumns.length > 0 ? (
                          gridColumns.map((col: string) => (
                            <MenuItem key={col} value={col}>
                              <Checkbox checked={selectedForGrid.indexOf(col) > -1} />
                              <ListItemText primary={col} />
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled value="">
                            <em>{grid.isDynamic && isLoadingDetails ? 'Loading columns...' : 'No columns available for this grid'}</em>
                          </MenuItem>
                        )}
                      </Select>
                    </Box>
                  );
                })}
              </>
            ) : (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
                The selected page does not have configurable grids.
              </Typography>
            )}
            {/* Note: Save button is now mostly redundant due to auto-save on select, but kept for UX clarity */}
            <Box sx={styles.actionsBoxStyles}>
              <Button
                variant="contained"
                disabled={isLoadingDetails}
                startIcon={
                  isLoadingDetails ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <SaveIcon fontSize="small" />
                  )
                }
                onClick={handleSavePreferences}
                sx={{
                  backgroundColor: themeConfig.colors.primary,
                  '&:disabled': { opacity: 0.5, backgroundColor: themeConfig.colors.primary },
                }}
              >
                {isLoadingDetails ? 'Saving...' : 'Confirm Preference'}
              </Button>
            </Box>
          </Card>
        </TabPanel>
      </Box>
    </DashboardLayout>
  );
};

export default UserProfilePage;
