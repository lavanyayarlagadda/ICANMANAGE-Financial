import { useState, useEffect, useCallback, useMemo } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { LOGIN_API_RESPONSE, USER_DETAILS_API_RESPONSE, MenuAccess } from '@/utils/dummyData';

interface UseDemoSecurityModalProps {
  currentUser: { id: string; username: string; firstName: string; lastName: string; role: string };
  onClose: () => void;
}

export const useDemoSecurityModal = ({ currentUser, onClose }: UseDemoSecurityModalProps) => {
  const [selectedUser, setSelectedUser] = useState(currentUser.id);
  const [inactivityTimeout, setInactivityTimeout] = useState(() => localStorage.getItem('ican_inactivity_timeout') || '15');
  const [passwordPolicy, setPasswordPolicy] = useState('30 Days');

  // Module Visibility State
  const [moduleSelectionEnabled, setModuleSelectionEnabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    const loginUser = LOGIN_API_RESPONSE.find(u => u.id === selectedUser);
    const userDetails = USER_DETAILS_API_RESPONSE.find(u => u.userId === selectedUser);
    const userBeingEdited = loginUser && userDetails ? { ...loginUser, ...userDetails } : null;

    if (userBeingEdited && userBeingEdited.menus) {
      const statusMap: Record<string, string> = {};
      const populateMap = (menusToMap: MenuAccess[]) => {
        menusToMap.forEach(m => {
          statusMap[m.menuName] = m.status;
          if (m.subModules) populateMap(m.subModules);
        });
      };
      populateMap(userBeingEdited.menus);
      setModuleStatuses(statusMap);
      setInactivityTimeout(userBeingEdited.inactivityTimeout || '15');
      setPasswordPolicy(userBeingEdited.passwordPolicy || '30 Days');
    } else {
      setModuleStatuses({});
      setInactivityTimeout('15');
      setPasswordPolicy('30 Days');
    }
  }, [selectedUser]);

  const handleUserChange = useCallback((event: SelectChangeEvent<string>) => {
    setSelectedUser(event.target.value as string);
  }, []);

  const handleModuleStatusChange = useCallback((moduleName: string, status: string) => {
    setModuleStatuses(prev => ({ ...prev, [moduleName]: status }));
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
    handleSave,
  };
};
