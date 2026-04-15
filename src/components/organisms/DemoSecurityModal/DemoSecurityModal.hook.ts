import { useState, useEffect, useCallback, useMemo } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useGetMeDetailsQuery, useGetUserMenuConfigQuery, useUpdateUserMenuConfigMutation, EffectiveMenuItem, EffectiveMenuModule, EffectiveSubMenuItem, MenuOverride } from '@/store/api/userApi';
import { MenuStatus } from '@/utils/dummyData';

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
  const { data: meDetails, isLoading: isLoadingUsers } = useGetMeDetailsQuery();
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
      
      // Cascade Hidden/Disabled status to all sub-modules
      if (status === 'Hidden' || status === 'Disabled') {
        const cascade = (items: any[]) => {
          for (const item of items) {
            if (item.menuId === menuId) {
              const applyRecursive = (children: any[]) => {
                children.forEach(child => {
                  next[child.menuId] = status;
                  if (child.modules) applyRecursive(child.modules);
                  if (child.subModules) applyRecursive(child.subModules);
                });
              };
              if (item.modules) applyRecursive(item.modules);
              if (item.subModules) applyRecursive(item.subModules);
              return true;
            }
            if (item.modules && cascade(item.modules)) return true;
            if (item.subModules && cascade(item.subModules)) return true;
          }
          return false;
        };

        if (menuConfig?.menus) {
          cascade(menuConfig.menus);
        }
      }
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
      const compareAndCollect = (items: (EffectiveMenuItem | EffectiveMenuModule | EffectiveSubMenuItem)[]) => {
        items.forEach(item => {
          if (moduleStatuses[item.menuId] !== item.effectiveStatus) {
            overrides.push({ menuId: item.menuId, status: moduleStatuses[item.menuId] });
          }
          if ('modules' in item && item.modules) compareAndCollect(item.modules);
          if ('subModules' in item && item.subModules) compareAndCollect(item.subModules);
        });
      };

      if (menuConfig) {
        compareAndCollect(menuConfig.menus);
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
