import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material';
import { RootState, useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { toggleSidebarCollapse } from '@/store/slices/uiSlice';
import { setSelectedTenantId, setTenants, setTenantLoading } from '@/store/slices/tenantSlice';
import { useGetTenantsQuery } from '@/store/api/tenantApi';
import { useGetMeDetailsQuery } from '@/store/api/userApi';
import { baseApi } from '@/store/api/baseApi';
import { useUserPermissions } from '@/hooks/useUserPermissions';

interface UseTopNavBarProps {
  onMenuToggle: () => void;
}

export const useTopNavBar = ({ onMenuToggle }: UseTopNavBarProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isCognitiveUser, user } = useUserPermissions();
  const { selectedTenantId, tenants } = useAppSelector((state: RootState) => state.tenant);

  const { data: tenantData, isLoading: isTenantsLoading } = useGetTenantsQuery(undefined, {
    skip: !isCognitiveUser,
  });

  const { data: userDetails, refetch: refetchMeDetails } = useGetMeDetailsQuery(undefined, {
    skip: !!isCognitiveUser && !selectedTenantId
  });

  useEffect(() => {
    dispatch(setTenantLoading(isTenantsLoading));
  }, [isTenantsLoading, dispatch]);

  useEffect(() => {
    if (tenantData && tenantData.length > 0) {
      dispatch(setTenants(tenantData));

      const isSelectedValid = selectedTenantId && tenantData.some(t => String(t.tenantId) === String(selectedTenantId));
      if (!isSelectedValid) {
        dispatch(setSelectedTenantId(String(tenantData[0].tenantId)));
      }
    }
  }, [tenantData, dispatch, selectedTenantId]);

  const handleTenantChange = useCallback((event: SelectChangeEvent) => {
    const newTenantId = event.target.value;
    dispatch(setSelectedTenantId(newTenantId));
    refetchMeDetails();
  }, [dispatch, refetchMeDetails]);

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
    localStorage.removeItem('ican_selected_tenant');
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
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
  };
};
