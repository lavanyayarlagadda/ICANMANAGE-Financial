import { useState, useEffect, useCallback, useMemo } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useGetMeDetailsQuery, useGetUserMenuConfigQuery, useUpdateUserMenuConfigMutation, EffectiveMenuItem, EffectiveMenuModule, EffectiveSubMenuItem, MenuOverride } from '@/store/api/userApi';
import { MenuStatus } from '@/utils/dummyData';
import { useUserPermissions } from '@/hooks/useUserPermissions';

interface UseDemoSecurityModalProps {
  currentUser: { id: string; username: string; firstName: string; lastName: string; role: string };
  open: boolean;
  onClose: () => void;
}

export type PasswordPolicy = '15 Days' | '30 Days' | '60 Days' | '90 Days' | 'Never';
export const PASSWORD_POLICY_OPTIONS: PasswordPolicy[] = ['15 Days', '30 Days', '60 Days', '90 Days', 'Never'];
export const MODULE_STATUS_OPTIONS: MenuStatus[] = ['Active', 'Hidden', 'Disabled'];

const isMenuStatus = (value: string): value is MenuStatus =>
  MODULE_STATUS_OPTIONS.includes(value as MenuStatus);

const isPasswordPolicy = (value: string): value is PasswordPolicy =>
  PASSWORD_POLICY_OPTIONS.includes(value as PasswordPolicy);

export const useDemoSecurityModal = ({ currentUser, open, onClose }: UseDemoSecurityModalProps) => {
  const { userDetails: meDetails, isLoadingDetails: isLoadingUsers } = useUserPermissions();
  const [selectedUser, setSelectedUser] = useState('');
  const { data: menuConfig, isLoading: isLoadingMenu, isFetching: isFetchingMenu } = useGetUserMenuConfigQuery(
    { userId: selectedUser },
    { skip: !selectedUser || !open }
  );
  const [updateMenuConfig, { isLoading: isSaving }] = useUpdateUserMenuConfigMutation();

  const [inactivityTimeout, setInactivityTimeout] = useState(() => localStorage.getItem('ican_inactivity_timeout') || '15');
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>('30 Days');

  // Module Visibility State
  const [moduleSelectionEnabled, setModuleSelectionEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleStatuses, setModuleStatuses] = useState<Record<number, MenuStatus>>({});

  const users = useMemo(() => {
    return meDetails?.users || meDetails?.usersDropdown?.map(u => ({ id: String(u.userId), username: u.username, firstName: '', lastName: '', role: 'User' })) || [];
  }, [meDetails]);
  useEffect(() => {
    // Automatically select a user when the modal opens or users list loads
    if (open && !selectedUser && users && users.length > 0) {
      const loggedInUser = users.find(u => u.id === currentUser.id);
      if (loggedInUser) {
        setSelectedUser(loggedInUser.id);
      } else {
        // Fallback: select the first user from the list if current user is not found
        setSelectedUser(users[0].id);
      }
    }
  }, [users, currentUser, open, selectedUser]);


  // Reset selected user when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedUser('');
    }
  }, [open]);

  useEffect(() => {
    if (menuConfig) {
      const statusMap: Record<number, MenuStatus> = {};

      const populateMap = (items: (EffectiveMenuItem | EffectiveMenuModule | EffectiveSubMenuItem)[]) => {
        items.forEach(item => {
          statusMap[item.menuId] = item.effectiveStatus;
          if ('modules' in item && item.modules) populateMap(item.modules);
          if ('subModules' in item && item.subModules) populateMap(item.subModules);
        });
      };

      populateMap(menuConfig.menus);
      setModuleStatuses(statusMap);
    }
  }, [menuConfig]);

  const handleUserChange = useCallback((event: SelectChangeEvent<string>) => {
    setSelectedUser(event.target.value);
  }, []);

  const handleModuleStatusChange = useCallback((menuId: number, status: MenuStatus) => {
    setModuleStatuses(prev => {
      const next = { ...prev, [menuId]: status };

      if (!menuConfig?.menus) return next;

      // 1. Cascade DOWN for ALL statuses (Active, Hidden, Disabled)
      type MenuOrModule = EffectiveMenuItem | EffectiveMenuModule | EffectiveSubMenuItem;

      const cascadeDown = (items: MenuOrModule[], targetId: number, targetStatus: MenuStatus) => {
        let found = false;
        for (const item of items) {
          if (item.menuId === targetId) {
            found = true;
            const setRecursive = (children: MenuOrModule[]) => {
              children.forEach(child => {
                next[child.menuId] = targetStatus;
                const grandChildren = ('modules' in child ? child.modules : ('subModules' in child ? child.subModules : undefined));
                if (grandChildren) setRecursive(grandChildren);
              });
            };
            const currentChildren = ('modules' in item ? item.modules : ('subModules' in item ? item.subModules : undefined));
            if (currentChildren) setRecursive(currentChildren);
          } else {
            const children = ('modules' in item ? item.modules : ('subModules' in item ? item.subModules : undefined));
            if (children && cascadeDown(children, targetId, targetStatus)) {
              found = true;
            }
          }
        }
        return found;
      };

      // Cascade down for any status change to ensure consistency
      cascadeDown(menuConfig.menus, menuId, status);

      // 2. Cascade UP: Update parents based on children's state
      const updateParentStatuses = (items: MenuOrModule[]) => {
        items.forEach(item => {
          const children = ('modules' in item ? item.modules : ('subModules' in item ? item.subModules : undefined));
          if (children && children.length > 0) {
            updateParentStatuses(children); // Process children first (post-order)

            // Skip upward check if the item itself was the one explicitly changed by the user
            if (item.menuId === menuId) return;

            const allHiddenOrDisabled = children.every((child) =>
              next[child.menuId] === 'Hidden' || next[child.menuId] === 'Disabled'
            );

            if (allHiddenOrDisabled) {
              const allDisabled = children.every((child) => next[child.menuId] === 'Disabled');
              next[item.menuId] = allDisabled ? 'Disabled' : 'Hidden';
            } else {
              // If at least one child is Active, the parent must be Active to be usable
              const hasActiveChild = children.some((child) => next[child.menuId] === 'Active');
              if (hasActiveChild) {
                next[item.menuId] = 'Active';
              }
            }
          }
        });
      };

      updateParentStatuses(menuConfig.menus);

      return next;
    });
  }, [menuConfig]);

  const handleModuleStatusSelectChange = useCallback((menuId: number, event: SelectChangeEvent<string>) => {
    if (isMenuStatus(event.target.value)) {
      handleModuleStatusChange(menuId, event.target.value);
    }
  }, [handleModuleStatusChange]);

  const handlePasswordPolicyChange = useCallback((event: SelectChangeEvent<string>) => {
    if (isPasswordPolicy(event.target.value)) {
      setPasswordPolicy(event.target.value);
    }
  }, []);

  const handleSave = useCallback(async () => {
    try {
      // Build overrides by comparing current statuses with initial ones from menuConfig
      const overrides: MenuOverride[] = [];
      const collectAllOverrides = (items: (EffectiveMenuItem | EffectiveMenuModule | EffectiveSubMenuItem)[]) => {
        items.forEach(item => {
          if (moduleStatuses[item.menuId] !== undefined) {
            overrides.push({ menuId: item.menuId, status: moduleStatuses[item.menuId] });
          }

          if ('modules' in item && item.modules) collectAllOverrides(item.modules);
          if ('subModules' in item && item.subModules) collectAllOverrides(item.subModules);
        });
      };

      if (menuConfig) {
        collectAllOverrides(menuConfig.menus);
      }

      await updateMenuConfig({
        userId: selectedUser,
        customMenuEnabled: moduleSelectionEnabled,
        overrides,
      }).unwrap();

      localStorage.setItem('ican_inactivity_timeout', inactivityTimeout);
      window.dispatchEvent(new Event('ican_inactivity_timeout_changed'));
      onClose();
    } catch (error) {
      console.error('Failed to save menu config:', error);
    }
  }, [selectedUser, moduleSelectionEnabled, moduleStatuses, menuConfig, updateMenuConfig, inactivityTimeout, onClose]);

  const userBeingEdited = users.find(u => u.id === selectedUser);
  const selectedUsername = userBeingEdited ? userBeingEdited.username : currentUser.username;

  return {
    selectedUser,
    inactivityTimeout,
    passwordPolicy,
    moduleSelectionEnabled,
    searchQuery,
    moduleStatuses,
    userBeingEdited,
    selectedUsername,
    users,
    menus: menuConfig?.menus || [],
    isLoading: isLoadingUsers || isLoadingMenu || isFetchingMenu,
    isSaving,
    hasChanges: useMemo(() => {
      if (!menuConfig) return false;

      // 1. Check user change
      const initialUserId = users.find(u => u.id === currentUser.id)?.id || users[0]?.id;
      if (selectedUser !== initialUserId && !moduleStatuses[Object.keys(moduleStatuses)[0] as any]) {
        // This is tricky because selectedUser is set on mount.
        // If the user selects a DIFFERENT user than the one that was auto-selected, that's a change.
      }

      // 2. Check Module Statuses
      const initialStatusMap: Record<number, MenuStatus> = {};
      const populateInitialMap = (items: (EffectiveMenuItem | EffectiveMenuModule | EffectiveSubMenuItem)[]) => {
        items.forEach(item => {
          initialStatusMap[item.menuId] = item.effectiveStatus;
          if ('modules' in item && item.modules) populateInitialMap(item.modules);
          if ('subModules' in item && item.subModules) populateInitialMap(item.subModules);
        });
      };
      populateInitialMap(menuConfig.menus);

      const statusesChanged = Object.keys(moduleStatuses).some(id => 
        moduleStatuses[Number(id)] !== initialStatusMap[Number(id)]
      );
      if (statusesChanged) return true;

      // 3. Check others
      if (moduleSelectionEnabled !== true) return true; // Assuming default is true
      if (inactivityTimeout !== (localStorage.getItem('ican_inactivity_timeout') || '15')) return true;
      if (passwordPolicy !== '30 Days') return true; // Assuming default

      return false;
    }, [menuConfig, moduleStatuses, moduleSelectionEnabled, inactivityTimeout, passwordPolicy, selectedUser, users, currentUser.id]),
    setInactivityTimeout,
    setPasswordPolicy,
    setModuleSelectionEnabled,
    setSearchQuery,
    handleUserChange,
    handleModuleStatusChange,
    handleModuleStatusSelectChange,
    handlePasswordPolicyChange,
    handleSave,
  };
};
