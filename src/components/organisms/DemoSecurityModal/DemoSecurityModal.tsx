import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box,
    Select,
    MenuItem,
    TextField,
    FormControl,
    Switch,
    InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import Accordion from '@/components/atoms/Accordion/Accordion';
import { themeConfig } from '@/theme';
import { LOGIN_API_RESPONSE } from '@/utils/dummyData';
import { useDemoSecurityModal } from './DemoSecurityModal.hook';
import * as styles from './DemoSecurityModal.styles';

interface DemoSecurityModalProps {
    open: boolean;
    onClose: () => void;
    currentUser: { id: string; username: string; firstName: string; lastName: string; role: string };
}

const DemoSecurityModal: React.FC<DemoSecurityModalProps> = ({ open, onClose, currentUser }) => {
    const {
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
    } = useDemoSecurityModal({ currentUser, onClose });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{ sx: styles.dialogStyles }}
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
                <Box sx={styles.configureUserBoxStyles}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <PersonOutlineIcon fontSize="small" sx={{ color: themeConfig.colors.primary }} />
                        <Typography variant="subtitle2" sx={{ color: themeConfig.colors.primary, fontWeight: 600 }}>
                            Configure for User
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="body2" sx={{ minWidth: 80, fontWeight: 500 }}>Select User:</Typography>
                        <FormControl fullWidth size="small">
                            <Select
                                value={selectedUser}
                                onChange={handleUserChange}
                                displayEmpty
                                sx={{ backgroundColor: themeConfig.colors.surface, borderRadius: 1 }}
                            >
                                {LOGIN_API_RESPONSE.map(u => (
                                    <MenuItem key={u.id} value={u.id}>
                                        {u.username} ({u.role.charAt(0).toUpperCase() + u.role.slice(1)}) {u.id === currentUser.id ? '(You)' : ''}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Typography variant="caption" sx={{ color: themeConfig.colors.primary, display: 'block' }}>
                        You are editing the menu visibility and settings for the selected user.
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Module Visibility</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Switch
                            checked={moduleSelectionEnabled}
                            onChange={(e) => setModuleSelectionEnabled(e.target.checked)}
                            color="primary"
                            sx={{ mr: 1 }}
                        />
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Enable Module Selection</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Customize visibility for <Typography component="span" variant="caption" color="primary" sx={{ fontWeight: 600 }}>{selectedUsername}</Typography>.
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: { xs: 1, sm: 2 }, mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Visible Navigation Items</Typography>
                        <TextField
                            placeholder="Search modules..."
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" sx={{ color: themeConfig.colors.text.secondary }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={styles.searchFieldStyles}
                        />
                    </Box>

                    {moduleSelectionEnabled && userBeingEdited?.menus && (
                        <Box sx={styles.accordionListStyles}>
                            {userBeingEdited.menus.map((menuItem, index) => (
                                <React.Fragment key={menuItem.menuName}>
                                    <Accordion hideBorderTop={index === 0}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 1.5, sm: 2 }, pl: { xs: 2, sm: 5 } }}>
                                            <Typography sx={{ color: themeConfig.colors.primary, fontSize: '0.85rem', flex: 1, pr: 1, wordBreak: 'break-word' }}>
                                                {menuItem.menuName}
                                            </Typography>
                                            <FormControl size="small" sx={{ width: { xs: 110, sm: 120 }, flexShrink: 0 }}>
                                                <Select
                                                    value={moduleStatuses[menuItem.menuName] || 'Hidden'}
                                                    onChange={(e) => handleModuleStatusChange(menuItem.menuName, e.target.value as string)}
                                                    disabled={!moduleSelectionEnabled}
                                                    sx={styles.statusSelectStyles}
                                                >
                                                    {['Active', 'Hidden', 'Disabled'].map(statusOption => (
                                                        <MenuItem key={statusOption} value={statusOption} sx={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {moduleStatuses[menuItem.menuName] === statusOption ? <CheckIcon fontSize="small" /> : <Box sx={{ width: 20 }} />}
                                                            {statusOption}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Accordion>
                                    {menuItem.subModules && moduleStatuses[menuItem.menuName] !== 'Hidden' && (
                                        <Accordion summary={`${menuItem.menuName} Sub-Modules`}>
                                            {menuItem.subModules.map((subItem, sIdx, sArr) => (
                                                <Box key={subItem.menuName} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: { xs: 1.5, sm: 2 }, pl: { xs: 3, sm: 5 }, borderBottom: sIdx < sArr.length - 1 ? `1px solid ${themeConfig.colors.border}` : 'none' }}>
                                                    <Typography sx={{ color: themeConfig.colors.primary, fontSize: '0.85rem', flex: 1, pr: 1, wordBreak: 'break-word' }}>
                                                        {subItem.menuName}
                                                    </Typography>
                                                    <FormControl size="small" sx={{ width: { xs: 110, sm: 120 }, flexShrink: 0 }}>
                                                        <Select
                                                            value={moduleStatuses[subItem.menuName] || 'Hidden'}
                                                            onChange={(e) => handleModuleStatusChange(subItem.menuName, e.target.value as string)}
                                                            disabled={moduleStatuses[menuItem.menuName] === 'Disabled' || !moduleSelectionEnabled}
                                                            sx={styles.statusSelectStyles}
                                                        >
                                                            {['Active', 'Hidden', 'Disabled'].map(statusOption => (
                                                                <MenuItem key={statusOption} value={statusOption} sx={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    {moduleStatuses[subItem.menuName] === statusOption ? <CheckIcon fontSize="small" /> : <Box sx={{ width: 20 }} />}
                                                                    {statusOption}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            ))}
                                        </Accordion>
                                    )}
                                </React.Fragment>
                            ))}
                        </Box>
                    )}
                </Box>

                <Box sx={styles.securitySettingsBoxStyles}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <SecurityOutlinedIcon fontSize="small" sx={{ color: themeConfig.colors.text.primary }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Security Settings</Typography>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Inactivity Timeout (minutes)</Typography>
                        <TextField fullWidth size="small" value={inactivityTimeout} onChange={(e) => setInactivityTimeout(e.target.value)} sx={{ mb: 1 }} />
                    </Box>
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Password Expiration Policy</Typography>
                        <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                            <Select value={passwordPolicy} onChange={(e) => setPasswordPolicy(e.target.value as string)}>
                                {['15 Days', '30 Days', '60 Days', '90 Days', 'Never'].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: 2, justifyContent: 'space-between' }}>
                <Box component="img" src="/cognitiveLogo.svg" alt="Logo" sx={{ height: 28, display: { xs: 'none', sm: 'block' } }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={onClose} variant="outlined" sx={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.text.primary }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: themeConfig.colors.primary }}>Save Changes</Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default DemoSecurityModal;

