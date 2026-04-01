import { useAppSelector } from '@/store';
import { COMPANIES } from '@/config/constants';
import { useMemo } from 'react';
import { MenuAccess } from '@/store/slices/authSlice';

/**
 * Hook to determine user permissions based on company and assigned menus.
 */
export const useUserPermissions = () => {
  const user = useAppSelector((state) => state.auth.user);
  const menus = user?.menus || [];

  const company = user?.company?.toLowerCase();
    const { selectedTenantId } = useAppSelector((s) => s.tenant);

  const isMindPath = company === COMPANIES.MINDPATH ||  
      selectedTenantId?.toLowerCase() === 'mindpath';
  const isCognitiveUser = company === COMPANIES.COGNITIVE_HEALTH_IT;

  /**
   * Checks the status of a specific menu item.
   */
  const getMenuStatus = useMemo(() => (label: string) => {
    const findStatus = (menusArray: MenuAccess[]): string | null => {
      for (const m of menusArray) {
        if (m.menuName?.toLowerCase() === label.toLowerCase()) return m.status;
        if (m.subModules) {
          const sub = findStatus(m.subModules);
          if (sub) return sub;
        }
      }
      return null;
    };
    
    if (!menus || menus.length === 0) return 'Visible';
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
  };
};
