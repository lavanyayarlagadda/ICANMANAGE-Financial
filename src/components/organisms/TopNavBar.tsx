import React, { useState } from 'react';
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
  FormControl,
  Select,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import Button from '@/components/atoms/Button';
import MenuIcon from '@mui/icons-material/Menu';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LogoutIcon from '@mui/icons-material/Logout';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import { RootState, useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { toggleSidebarCollapse } from '@/store/slices/uiSlice';
import { setSelectedTenantId, setTenants, setTenantLoading } from '@/store/slices/tenantSlice';
import { useGetTenantsQuery } from '@/store/api/tenantApi';
import DemoSecurityModal from './DemoSecurityModal';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/atoms/Logo';

interface TopNavBarProps {
  onMenuToggle: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ onMenuToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state: RootState) => state.auth.user);
  const { selectedTenantId, tenants, isLoading: isTenantsGlobalLoading } = useAppSelector((state: RootState) => state.tenant);

  const isCognitiveUser = user?.company?.toLowerCase() === 'cognitivehealthit';

  const { data: tenantData, isLoading: isTenantsLoading } = useGetTenantsQuery(undefined, {
    skip: !isCognitiveUser,
  });

  React.useEffect(() => {
    dispatch(setTenantLoading(isTenantsLoading));
  }, [isTenantsLoading, dispatch]);

  React.useEffect(() => {
    if (tenantData && tenantData.length > 0) {
      dispatch(setTenants(tenantData));
      // ALWAYS select the first tenant if one isn't explicitly chosen from storage
      if (!selectedTenantId) {
        dispatch(setSelectedTenantId(tenantData[0].tenantId));
      }
    }
  }, [tenantData, dispatch, selectedTenantId]);

  const handleTenantChange = (event: SelectChangeEvent) => {
    dispatch(setSelectedTenantId(event.target.value));
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    dispatch(logout());
    navigate('/login');
  };

  const openProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const openDemoModal = () => {
    handleClose();
    setDemoModalOpen(true);
  };

  if (!user) return null;

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 56, md: 64 }, px: { xs: 1.5, md: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={isMobile ? onMenuToggle : () => dispatch(toggleSidebarCollapse())} size="small">
              <MenuIcon />
            </IconButton>
            <Logo collapsed={isMobile} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            {!isMobile && (
              <>
                {/* <Button
                  icon={<UploadFileIcon />}
                  iconPosition="start"
                  label="Upload Files"
                  size="small"
                  color="inherit"
                  sx={{ textTransform: 'none' }}
                /> */}
              </>
            )}
            {!isMobile && isCognitiveUser && (
              <FormControl size="small" sx={{ minWidth: 160, ml: 2 }}>
                <Select
                  value={selectedTenantId || ''}
                  onChange={handleTenantChange}
                  displayEmpty
                  startAdornment={
                    <ListItemIcon sx={{ minWidth: 28, color: 'primary.main' }}>
                      <CorporateFareIcon fontSize="small" />
                    </ListItemIcon>
                  }
                  sx={{
                    borderRadius: 2,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(25, 118, 210, 0.2)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(25, 118, 210, 0.4)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    }
                  }}
                >
                  {tenantData?.map((t) => (
                    <MenuItem key={t.tenantId} value={t.tenantId}>
                      {t.displayName}
                    </MenuItem>
                  ))}
                  {isTenantsLoading && <MenuItem disabled>Loading...</MenuItem>}
                </Select>
              </FormControl>
            )}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                ml: 2,
                cursor: 'pointer',
                p: 0.5,
                borderRadius: 1,
                '&:hover': { backgroundColor: `${theme.palette.action.hover}` }
              }}
              onClick={handleClick}
            >
              <Avatar src={`/avatar-placeholder.png`} sx={{ width: 36, height: 36, bgcolor: theme.palette.primary.main, fontSize: '0.9rem' }}>
                {user.firstName[0]}{user.lastName[0]}
              </Avatar>
              {!isMobile && (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{user.firstName} {user.lastName}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>{user.company}</Typography>
                </Box>
              )}
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{
                paper: {
                  elevation: 3,
                  sx: { minWidth: 260, mt: 1, borderRadius: 2 }
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{user.firstName} {user.lastName}</Typography>
                <Typography variant="body2" color="primary">{user.email}</Typography>
              </Box>
              <Divider />

              <MenuItem onClick={openProfile} sx={{ py: 1.5 }}>
                <ListItemIcon><LockOutlinedIcon fontSize="small" /></ListItemIcon>
                <Typography variant="body2">Profile & Password</Typography>
              </MenuItem>
              {user.role !== 'user' && (
                <>
                  <Divider />
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Application Settings</Typography>
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

      {/* Demo & Security Modal */}
      <DemoSecurityModal
        open={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        currentUser={user}
      />
    </>
  );
};

export default TopNavBar;
