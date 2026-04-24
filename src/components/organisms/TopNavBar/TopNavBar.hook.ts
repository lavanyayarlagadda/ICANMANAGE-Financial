import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectChangeEvent } from '@mui/material';
import { RootState, useAppSelector, useAppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { toggleSidebarCollapse, setActiveTab, setActiveSubTab, resetUiState } from '@/store/slices/uiSlice';
import { resetGlobalFilters, resetRemittanceViewState } from '@/store/slices/financialsSlice';
import { setSelectedTenantId, setTenants, setTenantLoading } from '@/store/slices/tenantSlice';
import { useGetTenantsQuery } from '@/store/api/tenantApi';
import { useGetMeDetailsQuery, userApi } from '@/store/api/userApi';
import { baseApi } from '@/store/api/baseApi';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { NAV_CONFIG } from '@/config/navigation';


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

  const { refetch: refetchMeDetails } = useGetMeDetailsQuery(undefined, {
    skip: !user || (!!isCognitiveUser && (!selectedTenantId || !tenantData || tenantData.length === 0))
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

  const handleTenantChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const newTenantId = event.target.value;
    
    // 1. Update the tenant in the store
    dispatch(setSelectedTenantId(newTenantId));
    
    // 2. Clear previous state to avoid data cross-contamination
    dispatch(resetGlobalFilters());
    dispatch(resetRemittanceViewState());
    dispatch(setActiveTab(0));
    dispatch(setActiveSubTab(0));
    dispatch(baseApi.util.resetApiState()); 
    
    try {
      // 3. Manually trigger the details fetch for the NEW tenant
      // We use initiate directly to avoid any hook/cache lifecycle delays
      const result = await dispatch(userApi.endpoints.getMeDetails.initiate(undefined, { 
        subscribe: false, 
        forceRefetch: true 
      })).unwrap();

      const newLandingPage = result?.defaultLandingPage;

      if (newLandingPage) {
        const configKey = Object.keys(NAV_CONFIG).find(
          key => key.toLowerCase() === newLandingPage.toLowerCase()
        );

        if (configKey) {
          navigate(NAV_CONFIG[configKey].path, { replace: true });
        }
      }
      
      // Also trigger a refetch of the hook-based query to keep the UI in sync
      refetchMeDetails();
      
    } catch (error) {
      console.error('Failed to resolve tenant landing page:', error);
      // Fallback if the specific tenant fetch fails
      navigate('/financials', { replace: true });
    }
  }, [dispatch, refetchMeDetails, navigate]);

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
    dispatch(resetUiState());
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
