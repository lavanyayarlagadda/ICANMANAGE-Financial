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
    Select,
    MenuItem,
    TextField,
    FormControl,
    SelectChangeEvent,
    Switch,
    InputAdornment,
    Tabs,
    Tab,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import Accordion from '@/components/atoms/Accordion';
import { themeConfig } from '@/theme';
import { LOGIN_API_RESPONSE, USER_DETAILS_API_RESPONSE, MenuAccess } from '@/utils/dummyData';

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
                {/* Configure for User Box */}
                <Box sx={{
                    border: `1px solid ${themeConfig.colors.primaryLight}40`,
                    borderRadius: 2,
                    p: 2,
                    mb: 3,
                    backgroundColor: `${themeConfig.colors.primaryLight}10`
                }}>
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

                {/* Module Visibility Box */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Module Visibility
                    </Typography>

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
                                Customize which navigation items are visible for <Typography component="span" variant="caption" color="primary" sx={{ fontWeight: 600 }}>{selectedUsername}</Typography>.
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
                            sx={{ width: { xs: '100%', sm: 250 }, backgroundColor: '#FAFBFC', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Box>

                    {/* Accordion List */}
                    {moduleSelectionEnabled && userBeingEdited?.menus && (
                        <Box sx={{ border: `1px solid ${themeConfig.colors.border}`, borderRadius: 2, overflow: 'hidden' }}>
                            {userBeingEdited.menus.map((menuItem, index) => (
                                <React.Fragment key={menuItem.menuName}>
                                    <Accordion hideBorderTop={index === 0}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: { xs: 1.5, sm: 2 },
                                                pl: { xs: 2, sm: 5 },
                                            }}
                                        >
                                            <Typography sx={{ color: themeConfig.colors.primary, fontSize: '0.85rem', flex: 1, pr: 1, wordBreak: 'break-word' }}>
                                                {menuItem.menuName}
                                            </Typography>
                                            <FormControl size="small" sx={{ width: { xs: 110, sm: 120 }, flexShrink: 0 }}>
                                                <Select
                                                    value={moduleStatuses[menuItem.menuName] || 'Hidden'}
                                                    onChange={(e) => handleModuleStatusChange(menuItem.menuName, e.target.value as string)}
                                                    disabled={!moduleSelectionEnabled}
                                                    sx={{
                                                        height: 32,
                                                        fontSize: '0.8rem',
                                                        backgroundColor: themeConfig.colors.surface,
                                                        '& .MuiSelect-select': { display: 'flex', alignItems: 'center', pr: '28px !important' }
                                                    }}
                                                    MenuProps={{
                                                        PaperProps: {
                                                            sx: {
                                                                '& .MuiMenuItem-root.Mui-selected': {
                                                                    backgroundColor: themeConfig.colors.warning,
                                                                    color: '#000',
                                                                    '&:hover': {
                                                                        backgroundColor: themeConfig.colors.warning,
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {['Active', 'Hidden', 'Disabled'].map(statusOption => (
                                                        <MenuItem
                                                            key={statusOption}
                                                            value={statusOption}
                                                            sx={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 1 }}
                                                        >
                                                            {moduleStatuses[menuItem.menuName] === statusOption ? (
                                                                <CheckIcon fontSize="small" />
                                                            ) : (
                                                                <Box sx={{ width: 20 }} /> // Placeholder for alignment
                                                            )}
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
                                                <Box
                                                    key={subItem.menuName}
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        p: { xs: 1.5, sm: 2 },
                                                        pl: { xs: 3, sm: 5 },
                                                        borderBottom: sIdx < sArr.length - 1 ? `1px solid ${themeConfig.colors.border}` : 'none'
                                                    }}
                                                >
                                                    <Typography sx={{ color: themeConfig.colors.primary, fontSize: '0.85rem', flex: 1, pr: 1, wordBreak: 'break-word' }}>
                                                        {subItem.menuName}
                                                    </Typography>
                                                    <FormControl size="small" sx={{ width: { xs: 110, sm: 120 }, flexShrink: 0 }}>
                                                        <Select
                                                            value={moduleStatuses[subItem.menuName] || 'Hidden'}
                                                            onChange={(e) => handleModuleStatusChange(subItem.menuName, e.target.value as string)}
                                                            disabled={moduleStatuses[menuItem.menuName] === 'Disabled' || !moduleSelectionEnabled}
                                                            sx={{
                                                                height: 32,
                                                                fontSize: '0.8rem',
                                                                backgroundColor: themeConfig.colors.surface,
                                                                '& .MuiSelect-select': { display: 'flex', alignItems: 'center', pr: '28px !important' }
                                                            }}
                                                            MenuProps={{
                                                                PaperProps: {
                                                                    sx: {
                                                                        '& .MuiMenuItem-root.Mui-selected': {
                                                                            backgroundColor: themeConfig.colors.warning,
                                                                            color: '#000',
                                                                            '&:hover': {
                                                                                backgroundColor: themeConfig.colors.warning,
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            {['Active', 'Hidden', 'Disabled'].map(statusOption => (
                                                                <MenuItem
                                                                    key={statusOption}
                                                                    value={statusOption}
                                                                    sx={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 1 }}
                                                                >
                                                                    {moduleStatuses[subItem.menuName] === statusOption ? (
                                                                        <CheckIcon fontSize="small" />
                                                                    ) : (
                                                                        <Box sx={{ width: 20 }} /> // Placeholder for alignment
                                                                    )}
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

                {/* Security Settings Box */}
                <Box sx={{
                    border: `1px solid ${themeConfig.colors.border}`,
                    borderRadius: 2,
                    p: 2
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <SecurityOutlinedIcon fontSize="small" sx={{ color: themeConfig.colors.text.primary }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Security Settings
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Inactivity Timeout (minutes)</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={inactivityTimeout}
                            onChange={(e) => setInactivityTimeout(e.target.value)}
                            sx={{ mb: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                            Set to 0 to disable. User will be logged out after this many minutes of inactivity.
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Password Expiration Policy</Typography>
                        <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                            <Select
                                value={passwordPolicy}
                                onChange={(e) => setPasswordPolicy(e.target.value as string)}
                            >
                                <MenuItem value="15 Days">15 Days</MenuItem>
                                <MenuItem value="30 Days">30 Days</MenuItem>
                                <MenuItem value="60 Days">60 Days</MenuItem>
                                <MenuItem value="90 Days">90 Days</MenuItem>
                                <MenuItem value="Never">Never</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography variant="caption" color="text.secondary">
                            Applies to Manager accounts only.
                        </Typography>
                    </Box>
                </Box>

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
