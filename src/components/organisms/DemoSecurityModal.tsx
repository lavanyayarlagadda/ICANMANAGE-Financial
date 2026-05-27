import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box,
    SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import { themeConfig } from '@/theme';
import { LOGIN_API_RESPONSE, USER_DETAILS_API_RESPONSE, MenuAccess } from '@/utils/dummyData';

import { UserSelectionPanel } from './DemoSecurityModal/UserSelectionPanel';
import { ModuleVisibilityPanel } from './DemoSecurityModal/ModuleVisibilityPanel';
import { SecuritySettingsPanel } from './DemoSecurityModal/SecuritySettingsPanel';

interface DemoSecurityModalProps {
    open: boolean;
    onClose: () => void;
    currentUser: { id: string; username: string; firstName: string; lastName: string; role: string };
}

const DemoSecurityModal: React.FC<DemoSecurityModalProps> = ({ open, onClose, currentUser }) => {
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

    const handleUserChange = (event: SelectChangeEvent<string>) => {
        setSelectedUser(event.target.value as string);
    };

    const handleModuleStatusChange = (moduleName: string, status: string) => {
        setModuleStatuses(prev => ({ ...prev, [moduleName]: status }));
    };

    const handleSave = () => {
        localStorage.setItem('ican_inactivity_timeout', inactivityTimeout);
        window.dispatchEvent(new Event('ican_inactivity_timeout_changed'));
        onClose();
    };

    // Derived username to display
    const currentLoginUser = LOGIN_API_RESPONSE.find(u => u.id === selectedUser);
    const currentUserDetails = USER_DETAILS_API_RESPONSE.find(u => u.userId === selectedUser);
    const userBeingEdited = currentLoginUser && currentUserDetails ? { ...currentLoginUser, ...currentUserDetails } : null;
    const selectedUsername = userBeingEdited ? userBeingEdited.username : currentUser.username;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1 }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <SettingsIcon sx={{ color: themeConfig.colors.text.primary }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Demo & Security Configuration</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                        Customize which application modules are visible and set security policies.
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ mt: -1, mr: -1 }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ py: 2 }}>
                <UserSelectionPanel
                    selectedUser={selectedUser}
                    onUserChange={handleUserChange}
                    currentUserId={currentUser.id}
                />

                <ModuleVisibilityPanel
                    moduleSelectionEnabled={moduleSelectionEnabled}
                    setModuleSelectionEnabled={setModuleSelectionEnabled}
                    selectedUsername={selectedUsername}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    userBeingEdited={userBeingEdited}
                    moduleStatuses={moduleStatuses}
                    handleModuleStatusChange={handleModuleStatusChange}
                />

                <SecuritySettingsPanel
                    inactivityTimeout={inactivityTimeout}
                    setInactivityTimeout={setInactivityTimeout}
                    passwordPolicy={passwordPolicy}
                    setPasswordPolicy={setPasswordPolicy}
                />
            </DialogContent>

            <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: 2, justifyContent: 'space-between', flexWrap: { xs: 'wrap', sm: 'nowrap' }, gap: { xs: 2, sm: 0 } }}>
                <Box
                    component="img"
                    src="/cognitiveLogo.svg"
                    alt="CognitiveHealth Logo"
                    sx={{ height: 28, display: { xs: 'none', sm: 'block' } }}
                />
                <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, justifyContent: 'flex-end' }}>
                    <Button onClick={onClose} variant="outlined" sx={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.text.primary }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: themeConfig.colors.primary }}>
                        Save Changes
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default DemoSecurityModal;
