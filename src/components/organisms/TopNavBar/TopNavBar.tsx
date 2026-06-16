import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Logo from '@/components/atoms/Logo/Logo';
import DemoSecurityModal from '../DemoSecurityModal/DemoSecurityModal';
import { useTopNavBar } from './TopNavBar.hook';
import {
  StyledAppBar,
  StyledToolbar,
  LeftSectionBox,
  RightSectionBox,
  TenantSelectBox,
  StyledTenantSelect,
  UserProfileBox,
  StyledAvatar,
  UserNameTypography,
  UserCompanyTypography,
  StyledMenu,
  MenuHeaderBox,
  MenuHeaderNameTypography,
  StyledMenuItem,
  MenuSectionHeaderBox,
  MenuSectionTitleTypography,
} from './TopNavBar.styles';

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
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <LeftSectionBox>
            <IconButton
              onClick={isMobile ? handleSidebarToggle : handleSidebarCollapse}
              size="small"
            >
              <MenuIcon />
            </IconButton>
            <Logo collapsed={isMobile} />
          </LeftSectionBox>

          <RightSectionBox>
            {isCognitiveUser && (
              <TenantSelectBox>
                <StyledTenantSelect
                  select
                  fullWidth
                  size="small"
                  value={
                    tenants?.some((t) => t.tenantId === selectedTenantId) ? selectedTenantId : ''
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTenantChange(e)}
                  disabled={isTenantsLoading}
                >
                  {tenants?.map((t) => (
                    <MenuItem key={t.tenantId} value={t.tenantId}>
                      {t.displayName}
                    </MenuItem>
                  ))}
                  {isTenantsLoading && <MenuItem disabled>Loading...</MenuItem>}
                </StyledTenantSelect>
              </TenantSelectBox>
            )}
            <UserProfileBox onClick={handleClick}>
              <StyledAvatar src="/avatar-placeholder.png">
                {(user.firstName?.[0] || user.username?.[0] || 'U').toUpperCase()}
                {(user.lastName?.[0] || '').toUpperCase()}
              </StyledAvatar>
              {!isMobile && (
                <Box>
                  <UserNameTypography variant="body2">
                    {user.firstName || user.username || 'User'} {user.lastName || ''}
                  </UserNameTypography>
                  <UserCompanyTypography variant="caption" color="text.secondary">
                    {user.company}
                  </UserCompanyTypography>
                </Box>
              )}
            </UserProfileBox>
            <StyledMenu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuHeaderBox>
                <MenuHeaderNameTypography variant="subtitle2">
                  {user.firstName || user.username || 'User'} {user.lastName || ''}
                </MenuHeaderNameTypography>
                <Typography variant="body2" color="primary">
                  {user.email}
                </Typography>
              </MenuHeaderBox>
              <Divider />

              <StyledMenuItem onClick={openProfile}>
                <ListItemIcon>
                  <LockOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">Profile & Password</Typography>
              </StyledMenuItem>
              {user.role === 'Admin' && (
                <>
                  <Divider />
                  <MenuSectionHeaderBox>
                    <MenuSectionTitleTypography variant="caption" color="text.secondary">
                      Application Settings
                    </MenuSectionTitleTypography>
                  </MenuSectionHeaderBox>
                  <StyledMenuItem onClick={openDemoModal}>
                    <ListItemIcon>
                      <SettingsOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography variant="body2">Demo & Security</Typography>
                  </StyledMenuItem>
                </>
              )}

              <Divider />

              <StyledMenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography variant="body2">Log out</Typography>
              </StyledMenuItem>
            </StyledMenu>
          </RightSectionBox>
        </StyledToolbar>
      </StyledAppBar>

      <DemoSecurityModal
        open={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        currentUser={user}
      />
    </>
  );
};

export default TopNavBar;
