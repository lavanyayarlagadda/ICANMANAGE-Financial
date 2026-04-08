import { useAppSelector } from '@/store';
import { COMPANIES } from '@/config/constants';
import { useMemo } from 'react';
import { MenuAccess } from '@/store/slices/authSlice';
import { DUMMY_USER } from '@/constants/auth';

/**
 * Hook to determine user permissions based on company and assigned menus.
 */
export const useUserPermissions = () => {
    // For demo purposes, we take strictly from DUMMY_USER as requested
    const user = DUMMY_USER;
    const menus = DUMMY_USER.menus;

    const company = user?.company?.toLowerCase();
    const { selectedTenantId } = useAppSelector((s) => s.tenant);

  const isMindPath = company === COMPANIES.MINDPATH ||  
      selectedTenantId?.toLowerCase() === 'mindpath';
  const isCognitiveUser = company === COMPANIES.COGNITIVE_HEALTH_IT;

  /**
   * Checks the status of a specific menu item.
   * Handles hierarchy: if a parent is Hidden/Disabled, children inherit that status
   * unless they are already more restrictive (Hidden > Disabled).
   */
  const getMenuStatus = useMemo(() => {
    const findInMenu = (menusArray: MenuAccess[], target: string): MenuAccess | null => {
      for (const m of menusArray) {
        if (m.menuName?.toLowerCase() === target.toLowerCase()) return m;
        
        // Search in subModules
        if (m.subModules) {
          const sub = findInMenu(m.subModules, target);
          if (sub) return sub;
        }

        // Search in modules (alias)
        if (m.modules) {
          const sub = findInMenu(m.modules, target);
          if (sub) return sub;
        }
      }
      return null;
    };

    return (label: string, parentLabel?: string): string => {
      if (!menus || menus.length === 0) return 'Active';

      // Special case: UI Containers that are not real security modules
      const uiContainers = ['Transactions', 'Bank Deposits', 'Statements', 'Financials'];
      const isContainer = uiContainers.includes(label);

      let status: string = 'Active';

      if (parentLabel) {
        const parentMenu = findInMenu(menus, parentLabel);
        const parentStatus = parentMenu ? parentMenu.status : 'Active';
        if (parentStatus === 'Hidden' || parentStatus === 'Disabled') {
          status = parentStatus;
        }
      }

      if (status !== 'Hidden') {
        const menu = findInMenu(menus, label);
        if (!menu) {
          // If it's a known UI container and not found, default to 'Active'
          // If it's a specific module and not found, default to 'Hidden'
          status = isContainer ? 'Active' : 'Hidden';
        } else {
          status = menu.status;
        }
      }

      console.log(`[useUserPermissions] getMenuStatus(label: ${label}, parent: ${parentLabel}) => ${status}`);
      return status;
    };
  }, [menus]);

  const canViewPip = getMenuStatus('PIP', 'Financials') !== 'Hidden';
  const canViewCollections = getMenuStatus('Collections') !== 'Hidden';
  const canViewFinancials = getMenuStatus('Financials') !== 'Hidden';

  return {
    isMindPath,
    isCognitiveUser,
    canViewPip,
    canViewCollections,
    canViewFinancials,
    getMenuStatus,
    company,
  };
};
