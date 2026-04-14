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
import { themeConfig } from '@/theme/themeConfig';
import { useDemoSecurityModal, MODULE_STATUS_OPTIONS, PASSWORD_POLICY_OPTIONS } from './DemoSecurityModal.hook';
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
        users,
        menus,
        isLoading,
        isSaving,
        setInactivityTimeout,
        setModuleSelectionEnabled,
        setSearchQuery,
        handleUserChange,
        handleModuleStatusSelectChange,
        handlePasswordPolicyChange,
        handleSave,
    } = useDemoSecurityModal({ currentUser, open, onClose });

    const renderTree = (items: any[], level = 0): React.ReactNode => {
        const filteredItems = items.filter(item => 
            item.menuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ('modules' in item && item.modules?.some((m: any) => m.menuName.toLowerCase().includes(searchQuery.toLowerCase()))) ||
            ('subModules' in item && item.subModules?.some((s: any) => s.menuName.toLowerCase().includes(searchQuery.toLowerCase())))
        );

        if (filteredItems.length === 0 && searchQuery) return null;

        return filteredItems.map((item, index) => {
            const hasChildren = ('modules' in item && item.modules && item.modules.length > 0) || 
                               ('subModules' in item && item.subModules && item.subModules.length > 0);
            
            const currentStatus = moduleStatuses[item.menuId] || 'Hidden';
            
            // Level-specific styles
            const isLevel0 = level === 0;
            const isLevel1 = level === 1;
            const isLevel2 = level === 2;

            return (
                <React.Fragment key={item.menuId}>
                    <Box sx={styles.treeItemStyles(level, isLevel0, isLevel1)}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, pr: 1 }}>
                            {isLevel2 && (
                                <Box sx={styles.treeBulletStyles} />
                            )}
                            <Typography sx={styles.treeTextStyles(isLevel0, isLevel1)}>
                                {item.menuName}
                            </Typography>
                        </Box>
                        <FormControl size="small" sx={{ width: { xs: 100, sm: 110 }, flexShrink: 0 }}>
                            <Select
                                value={currentStatus}
                                onChange={(e) => handleModuleStatusSelectChange(item.menuId, e)}
                                disabled={!moduleSelectionEnabled}
                                sx={{
                                    ...styles.statusSelectStyles,
                                    fontSize: isLevel0 ? '0.85rem' : '0.8rem',
                                    height: isLevel0 ? '32px' : '28px'
                                }}
                            >
                                {MODULE_STATUS_OPTIONS.map(statusOption => (
                                    <MenuItem key={statusOption} value={statusOption} sx={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {currentStatus === statusOption ? <CheckIcon sx={{ fontSize: 14 }} /> : <Box sx={{ width: 14 }} />}
                                        {statusOption}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    {hasChildren && currentStatus !== 'Hidden' && (
                        renderTree(item.modules || item.subModules, level + 1)
                    )}
                </React.Fragment>
            );
        });
    };

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
                                {users.map(u => (
                                    <MenuItem key={u.id} value={u.id}>
                                        {u.username} {u.role ? `(${u.role.charAt(0).toUpperCase() + u.role.slice(1)})` : ''} {u.id === currentUser.id ? '(You)' : ''}
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

                    {moduleSelectionEnabled && (
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
                    )}

                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <Typography>Loading user configuration...</Typography>
                        </Box>
                    ) : moduleSelectionEnabled && menus && (
                        <Box sx={styles.accordionListStyles}>
                            {renderTree(menus)}
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
                            <Select value={passwordPolicy} onChange={handlePasswordPolicyChange}>
                                {PASSWORD_POLICY_OPTIONS.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: 2, justifyContent: 'space-between' }}>
                <Box component="img" src="/cognitiveLogo.svg" alt="Logo" sx={{ height: 28, display: { xs: 'none', sm: 'block' } }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                        onClick={onClose} 
                        variant="outlined" 
                        disabled={isSaving}
                        sx={{ borderColor: themeConfig.colors.border, color: themeConfig.colors.text.primary }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        variant="contained" 
                        disabled={isSaving}
                        sx={{ backgroundColor: themeConfig.colors.primary }}
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default DemoSecurityModal;

