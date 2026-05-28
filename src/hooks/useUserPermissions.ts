import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { useGetMeDetailsQuery, MenuItem, MenuModule, SubMenuItem } from '@/store/api/userApi';
import { MenuAccess } from '@/store/slices/authSlice';

export const useUserPermissions = () => {
  const authUser = useAppSelector((state) => state.auth.user);

  // Skip only when no authenticated user is present.
  const shouldSkipDetails = !authUser;

  const {
    data: userDetails,
    isLoading: isLoadingDetails,
    isFetching,
    isError: isErrorDetails,
  } = useGetMeDetailsQuery(undefined, {
    skip: shouldSkipDetails,
  });

  const user = useMemo(() => {
    if (!userDetails) return authUser;
    return { ...authUser, ...userDetails };
  }, [userDetails, authUser]);

  const isCognitiveUser = useMemo(() => {
    const company = user?.company?.toLowerCase();
    return company?.includes('cognitive');
  }, [user]);

  const menus = useMemo(() => user?.menus || [], [user?.menus]);

  /**
   * Checks the status of a specific menu item.
   */
  const getMenuStatus = useMemo(
    () => (label: string) => {
      const findStatus = (
        menusArray: (MenuItem | MenuModule | SubMenuItem | MenuAccess)[],
      ): string | null => {
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
    },
    [menus],
  );

  // const canViewPip = !isMindPath && getMenuStatus('PIP') !== 'Hidden';
  const canViewCollections = getMenuStatus('Collections') !== 'Hidden';
  const canViewFinancials = getMenuStatus('Financials') !== 'Hidden';

  return {
    isCognitiveUser,
    canViewCollections,
    canViewFinancials,
    getMenuStatus,
    accessibleModules: user?.accessibleModules || [],
    user,
    userDetails,
    isLoadingDetails: (isLoadingDetails || isFetching) && !shouldSkipDetails,
    isErrorDetails,
  };
};
