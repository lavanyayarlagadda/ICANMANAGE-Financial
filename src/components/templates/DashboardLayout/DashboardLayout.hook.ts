import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { financialsApi } from '@/store/api/financialsApi';
import { 
  toggleMobileMenu, 
  closeMobileMenu, 
  closeSnackbar 
} from '@/store/slices/uiSlice';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { MENU_STATUS } from '@/config/constants';

export const useDashboardLayout = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const ui = useAppSelector((s) => s.ui);
    const financials = useAppSelector((s) => s.financials);
    const tenant = useAppSelector((s) => s.tenant);
    
    const permissions = useUserPermissions();
    
    const isWaitingForTenants = permissions.isCognitiveUser && !tenant.selectedTenantId && tenant.tenants.length === 0;
    const isOverlayActive = ui.activeExportType || ui.isReloading || ui.isDrillingDown || ui.isGlobalFetching || financials.loading || tenant.isLoading || isWaitingForTenants;

    useEffect(() => {
        if (tenant.selectedTenantId) {
            dispatch(financialsApi.util.invalidateTags(['Financials']));
        }
    }, [tenant.selectedTenantId, dispatch]);

    const handleNavClick = useCallback((page: 'financials' | 'collections', path?: string) => {
        dispatch(closeMobileMenu());
        if (page === 'collections') {
            navigate('/collections');
        } else if (path) {
            navigate(path);
        }
    }, [dispatch, navigate]);

    const handleMenuToggle = useCallback(() => {
        dispatch(toggleMobileMenu());
    }, [dispatch]);

    const handleSnackbarClose = useCallback(() => {
        dispatch(closeSnackbar());
    }, [dispatch]);

    const handleMobileMenuClose = useCallback(() => {
        dispatch(closeMobileMenu());
    }, [dispatch]);

    return {
        ui,
        financials,
        tenant,
        isOverlayActive,
        isWaitingForTenants,
        ...permissions,
        handleNavClick,
        handleMenuToggle,
        handleSnackbarClose,
        handleMobileMenuClose,
        dispatch
    };
};
