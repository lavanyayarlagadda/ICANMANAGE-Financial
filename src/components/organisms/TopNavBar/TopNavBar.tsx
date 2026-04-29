import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  TextField,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Logo from '@/components/atoms/Logo/Logo';
import DemoSecurityModal from '../DemoSecurityModal/DemoSecurityModal';
import { useTopNavBar } from './TopNavBar.hook';
import * as styles from './TopNavBar.styles';

interface TopNavBarProps {
  onMenuToggle: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const {
    user,
    selectedTenantId,
    tenants,
    isTenantsLoading,
    isCognitiveUser,
    anchorEl,
    demoModalOpen,
    open,
    setDemoModalOpen,
    handleClick,
    handleClose,
    handleLogout,
    openProfile,
    openDemoModal,
    handleTenantChange,
    handleSidebarToggle,
    handleSidebarCollapse,
  } = useTopNavBar(props);

  if (!user) return null;

  return (
    <>
      <AppBar position="fixed" sx={styles.appBarStyles(theme)}>
        <Toolbar sx={styles.toolbarStyles}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pointerEvents: 'auto' }}>
            <IconButton onClick={isMobile ? handleSidebarToggle : handleSidebarCollapse} size="small">
              <MenuIcon />
            </IconButton>
            <Logo collapsed={isMobile} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            {isCognitiveUser && (
              <Box sx={{ minWidth: { xs: 60, sm: 160 }, maxWidth: { xs: 100, sm: 'none' }, ml: { xs: 0.5, sm: 2 }, pointerEvents: 'auto' }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={selectedTenantId || ''}
                  onChange={handleTenantChange}
                  disabled={isTenantsLoading}
                  sx={styles.tenantSelectStyles(theme)}
                >
                  {tenants?.map((t) => (
                    <MenuItem key={t.tenantId} value={t.tenantId}>
                      {t.displayName}
                    </MenuItem>
                  ))}
                  {isTenantsLoading && <MenuItem disabled>Loading...</MenuItem>}
                </TextField>
              </Box>
            )}
            <Box sx={styles.userProfileBoxStyles(theme)} onClick={handleClick}>
              <Avatar
                src="/avatar-placeholder.png"
                sx={{ width: 36, height: 36, bgcolor: theme.palette.primary.main, fontSize: '0.9rem' }}
              >
                {(user.firstName?.[0] || user.username?.[0] || 'U').toUpperCase()}
                {(user.lastName?.[0] || '').toUpperCase()}
              </Avatar>
              {!isMobile && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {user.firstName || user.username || 'User'} {user.lastName || ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                    {user.company}
                  </Typography>
                </Box>
              )}
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{ paper: { sx: styles.menuPaperStyles } }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user.firstName || user.username || 'User'} {user.lastName || ''}
                </Typography>
                <Typography variant="body2" color="primary">{user.email}</Typography>
              </Box>
              <Divider />

              <MenuItem onClick={openProfile} sx={{ py: 1.5 }}>
                <ListItemIcon><LockOutlinedIcon fontSize="small" /></ListItemIcon>
                <Typography variant="body2">Profile & Password</Typography>
              </MenuItem>
              {user.role === 'Admin' && (
                <>
                  <Divider />
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Application Settings
                    </Typography>
                  </Box>
                  <MenuItem onClick={openDemoModal} sx={{ py: 1.5 }}>
                    <ListItemIcon><SettingsOutlinedIcon fontSize="small" /></ListItemIcon>
                    <Typography variant="body2">Demo & Security</Typography>
                  </MenuItem>
                </>
              )}

              <Divider />

              <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                <Typography variant="body2">Log out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <DemoSecurityModal
        open={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        currentUser={user}
      />
    </>
  );
};

export default TopNavBar;

