import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material';
import { RootState, useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { toggleSidebarCollapse } from '@/store/slices/uiSlice';
import { setSelectedTenantId, setTenants, setTenantLoading } from '@/store/slices/tenantSlice';
import { useGetTenantsQuery } from '@/store/api/tenantApi';

interface UseTopNavBarProps {
  onMenuToggle: () => void;
}

export const useTopNavBar = ({ onMenuToggle }: UseTopNavBarProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state: RootState) => state.auth.user);
  const { selectedTenantId } = useAppSelector((state: RootState) => state.tenant);

  const isCognitiveUser = user?.company?.toLowerCase() === 'cognitivehealthit';

  const { data: tenantData, isLoading: isTenantsLoading } = useGetTenantsQuery(undefined, {
    skip: !isCognitiveUser,
  });

  useEffect(() => {
    dispatch(setTenantLoading(isTenantsLoading));
  }, [isTenantsLoading, dispatch]);

  useEffect(() => {
    if (tenantData && tenantData.length > 0) {
      dispatch(setTenants(tenantData));
      if (!selectedTenantId) {
        dispatch(setSelectedTenantId(tenantData[0].tenantId));
      }
    }
  }, [tenantData, dispatch, selectedTenantId]);

  const handleTenantChange = useCallback((event: SelectChangeEvent) => {
    dispatch(setSelectedTenantId(event.target.value));
  }, [dispatch]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    handleClose();
    dispatch(logout());
    navigate('/login');
  }, [handleClose, dispatch, navigate]);

  const openProfile = useCallback(() => {
    handleClose();
    navigate('/profile');
  }, [handleClose, navigate]);

  const openDemoModal = useCallback(() => {
    handleClose();
    setDemoModalOpen(true);
  }, [handleClose]);

  const handleSidebarToggle = useCallback(() => {
    onMenuToggle();
  }, [onMenuToggle]);

  const handleSidebarCollapse = useCallback(() => {
    dispatch(toggleSidebarCollapse());
  }, [dispatch]);

  return {
    user,
    selectedTenantId,
    tenantData,
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
  };
};
