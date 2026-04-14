import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { COMPANIES } from '@/config/constants';
import { useGetMeDetailsQuery, MenuItem, MenuModule, SubMenuItem } from '@/store/api/userApi';
import { MenuAccess } from '@/store/slices/authSlice';


export const useUserPermissions = () => {
  const { data: userDetails } = useGetMeDetailsQuery();
  const authUser = useAppSelector((state) => state.auth.user);
  const { selectedTenantId } = useAppSelector((s) => s.tenant);

  const user = userDetails || authUser;
  const menus = user?.menus || [];

  const company = user?.company?.toLowerCase();
  const isMindPath = company === COMPANIES.MINDPATH ||
    selectedTenantId?.toLowerCase() === 'mindpath';
  const isCognitiveUser = company === COMPANIES.COGNITIVE_HEALTH_IT;

  /**
   * Checks the status of a specific menu item.
   */
  const getMenuStatus = useMemo(() => (label: string) => {
    const findStatus = (menusArray: (MenuItem | MenuModule | SubMenuItem | MenuAccess)[]): string | null => {
      for (const item of menusArray) {
        if (item.menuName?.toLowerCase() === label.toLowerCase()) return item.status;

        // Use type assertions or check for property existence for recursion
        if ('modules' in item && item.modules) {
          const status = findStatus(item.modules);
          if (status) return status;
        }
        if ('subModules' in item && item.subModules) {
          const status = findStatus(item.subModules);
          if (status) return status;
        }
      }
      return null;
    };

    if (!menus || menus.length === 0) return 'Active';
    return findStatus(menus) || 'Hidden';
  }, [menus]);

  const canViewPip = !isMindPath && getMenuStatus('PIP') !== 'Hidden';
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
    accessibleModules: user?.accessibleModules || [],
    user,
  };
};
