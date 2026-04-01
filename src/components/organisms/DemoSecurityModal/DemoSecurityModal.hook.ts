import { useState, useEffect, useCallback, useMemo } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { LOGIN_API_RESPONSE, USER_DETAILS_API_RESPONSE, MenuAccess, MenuStatus } from '@/utils/dummyData';

interface UseDemoSecurityModalProps {
  currentUser: { id: string; username: string; firstName: string; lastName: string; role: string };
  onClose: () => void;
}

export type PasswordPolicy = '15 Days' | '30 Days' | '60 Days' | '90 Days' | 'Never';
export const PASSWORD_POLICY_OPTIONS: PasswordPolicy[] = ['15 Days', '30 Days', '60 Days', '90 Days', 'Never'];
export const MODULE_STATUS_OPTIONS: MenuStatus[] = ['Active', 'Hidden', 'Disabled'];

const isMenuStatus = (value: string): value is MenuStatus =>
  MODULE_STATUS_OPTIONS.includes(value as MenuStatus);

const isPasswordPolicy = (value: string): value is PasswordPolicy =>
  PASSWORD_POLICY_OPTIONS.includes(value as PasswordPolicy);

export const useDemoSecurityModal = ({ currentUser, onClose }: UseDemoSecurityModalProps) => {
  const [selectedUser, setSelectedUser] = useState(currentUser.id);
  const [inactivityTimeout, setInactivityTimeout] = useState(() => localStorage.getItem('ican_inactivity_timeout') || '15');
  const [passwordPolicy, setPasswordPolicy] = useState<PasswordPolicy>('30 Days');

  // Module Visibility State
  const [moduleSelectionEnabled, setModuleSelectionEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, MenuStatus>>({});

  useEffect(() => {
    const loginUser = LOGIN_API_RESPONSE.find(u => u.id === selectedUser);
    const userDetails = USER_DETAILS_API_RESPONSE.find(u => u.userId === selectedUser);
    const userBeingEdited = loginUser && userDetails ? { ...loginUser, ...userDetails } : null;

    if (userBeingEdited && userBeingEdited.menus) {
      const statusMap: Record<string, MenuStatus> = {};
      const populateMap = (menusToMap: MenuAccess[]) => {
        menusToMap.forEach(m => {
          statusMap[m.menuName] = m.status;
          if (m.subModules) populateMap(m.subModules);
        });
      };
      populateMap(userBeingEdited.menus);
      setModuleStatuses(statusMap);
      setInactivityTimeout(userBeingEdited.inactivityTimeout || '15');
      setPasswordPolicy(
        userBeingEdited.passwordPolicy && isPasswordPolicy(userBeingEdited.passwordPolicy)
          ? userBeingEdited.passwordPolicy
          : '30 Days'
      );
    } else {
      setModuleStatuses({});
      setInactivityTimeout('15');
      setPasswordPolicy('30 Days');
    }
  }, [selectedUser]);

  const handleUserChange = useCallback((event: SelectChangeEvent<string>) => {
    setSelectedUser(event.target.value);
  }, []);

  const handleModuleStatusChange = useCallback((moduleName: string, status: MenuStatus) => {
    setModuleStatuses(prev => ({ ...prev, [moduleName]: status }));
  }, []);

  const handleModuleStatusSelectChange = useCallback((moduleName: string, event: SelectChangeEvent<string>) => {
    if (isMenuStatus(event.target.value)) {
      handleModuleStatusChange(moduleName, event.target.value);
    }
  }, [handleModuleStatusChange]);

  const handlePasswordPolicyChange = useCallback((event: SelectChangeEvent<string>) => {
    if (isPasswordPolicy(event.target.value)) {
      setPasswordPolicy(event.target.value);
    }
  }, []);

  const handleSave = useCallback(() => {
    localStorage.setItem('ican_inactivity_timeout', inactivityTimeout);
    window.dispatchEvent(new Event('ican_inactivity_timeout_changed'));
    onClose();
  }, [inactivityTimeout, onClose]);

  const userBeingEdited = useMemo(() => {
    const currentLoginUser = LOGIN_API_RESPONSE.find(u => u.id === selectedUser);
    const currentUserDetails = USER_DETAILS_API_RESPONSE.find(u => u.userId === selectedUser);
    return currentLoginUser && currentUserDetails ? { ...currentLoginUser, ...currentUserDetails } : null;
  }, [selectedUser]);

  const selectedUsername = useMemo(() => 
    userBeingEdited ? userBeingEdited.username : currentUser.username, 
    [userBeingEdited, currentUser.username]
  );

  return {
    selectedUser,
    inactivityTimeout,
    passwordPolicy,
    moduleSelectionEnabled,
    searchQuery,
    moduleStatuses,
    userBeingEdited,
    selectedUsername,
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
