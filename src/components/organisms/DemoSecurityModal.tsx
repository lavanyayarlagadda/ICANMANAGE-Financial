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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import { themeConfig } from '@/theme';
import { DUMMY_USERS } from '@/utils/dummyData';

interface DemoSecurityModalProps {
    open: boolean;
    onClose: () => void;
    currentUser: { id: string; username: string; firstName: string; lastName: string; role: string };
}

const DemoSecurityModal: React.FC<DemoSecurityModalProps> = ({ open, onClose, currentUser }) => {
    const [selectedUser, setSelectedUser] = useState(currentUser.id);
    const [inactivityTimeout, setInactivityTimeout] = useState('15');
    const [passwordPolicy, setPasswordPolicy] = useState('30 Days');

    // Module Visibility State
    const [moduleSelectionEnabled, setModuleSelectionEnabled] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [moduleStatuses, setModuleStatuses] = useState<Record<string, string>>({});

    useEffect(() => {
        const userBeingEdited = DUMMY_USERS.find(u => u.id === selectedUser);
        if (userBeingEdited && userBeingEdited.menus) {
            const statusMap: Record<string, string> = {};
            userBeingEdited.menus.forEach(m => {
                statusMap[m.menuName] = m.status;
            });
            setModuleStatuses(statusMap);
        } else {
            setModuleStatuses({});
        }
    }, [selectedUser]);

    const handleUserChange = (event: SelectChangeEvent<string>) => {
        setSelectedUser(event.target.value as string);
    };

    const handleModuleStatusChange = (moduleName: string, status: string) => {
        setModuleStatuses(prev => ({ ...prev, [moduleName]: status }));
    };

    const handleSave = () => {
        onClose();
    };

    // Derived username to display
    const selectedUsername = selectedUser === currentUser.id
        ? currentUser.username
        : (selectedUser === '2' ? 'jsmith' : 'demo');

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
                                <MenuItem value={currentUser.id}>
                                    {currentUser.username} ({currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}) (You)
                                </MenuItem>
                                <MenuItem value="2">jsmith (Manager)</MenuItem>
                                <MenuItem value="3">demo (User)</MenuItem>
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

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
                            sx={{ width: 250, backgroundColor: '#FAFBFC', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </Box>

                    {/* Accordion List */}
                    <Box sx={{ border: `1px solid ${themeConfig.colors.border}`, borderRadius: 2, overflow: 'hidden' }}>
                        <Accordion disableGutters defaultExpanded elevation={0} sx={{ borderTop: `1px solid ${themeConfig.colors.border}`, '&:before': { display: 'none' } }}>
                            <AccordionDetails sx={{ p: 0 }}>
                                {['Collections'].map((moduleName, index, arr) => (
                                    <Box
                                        key={moduleName}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            p: 2,
                                            pl: 5,
                                            borderBottom: index < arr.length - 1 ? `1px solid ${themeConfig.colors.border}` : 'none'
                                        }}
                                    >
                                        <Typography sx={{ color: themeConfig.colors.primary, fontSize: '0.85rem' }}>
                                            {moduleName}
                                        </Typography>
                                        <FormControl size="small" sx={{ width: 120 }}>
                                            <Select
                                                value={moduleStatuses[moduleName] || 'Hidden'}
                                                onChange={(e) => handleModuleStatusChange(moduleName, e.target.value as string)}
                                                disabled={!moduleSelectionEnabled}
                                                sx={{
                                                    height: 32,
                                                    fontSize: '0.8rem',
                                                    backgroundColor: themeConfig.colors.surface,
                                                    '& .MuiSelect-select': { display: 'flex', alignItems: 'center' }
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
                                                        {moduleStatuses[moduleName] === statusOption ? (
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
                            </AccordionDetails>
                        </Accordion>
                        <Accordion disableGutters defaultExpanded elevation={0} sx={{ borderTop: `1px solid ${themeConfig.colors.border}`, '&:before': { display: 'none' } }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: themeConfig.colors.primary }} />}
                                sx={{ backgroundColor: '#FAFBFC', flexDirection: 'row-reverse', gap: 1, minHeight: 48, '& .MuiAccordionSummary-content': { my: 1 } }}
                            >
                                <Typography sx={{ fontSize: '0.9rem', color: themeConfig.colors.text.secondary }}>
                                    Financials Sub-Modules
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}>
                                {['All Transactions', 'Payments', 'PIP', 'Forward Balances', 'Recoupments', 'Other Adjustments', 'Variance Analysis', 'Trends & Forecast'].map((moduleName, index, arr) => (
                                    <Box
                                        key={moduleName}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            p: 2,
                                            pl: 5,
                                            borderBottom: index < arr.length - 1 ? `1px solid ${themeConfig.colors.border}` : 'none'
                                        }}
                                    >
                                        <Typography sx={{ color: themeConfig.colors.primary, fontSize: '0.85rem' }}>
                                            {moduleName}
                                        </Typography>
                                        <FormControl size="small" sx={{ width: 120 }}>
                                            <Select
                                                value={moduleStatuses[moduleName] || 'Hidden'}
                                                onChange={(e) => handleModuleStatusChange(moduleName, e.target.value as string)}
                                                disabled={!moduleSelectionEnabled}
                                                sx={{
                                                    height: 32,
                                                    fontSize: '0.8rem',
                                                    backgroundColor: themeConfig.colors.surface,
                                                    '& .MuiSelect-select': { display: 'flex', alignItems: 'center' }
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
                                                        {moduleStatuses[moduleName] === statusOption ? (
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
                            </AccordionDetails>
                        </Accordion>
                    </Box>
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

            <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
                <Box
                    component="img"
                    src="/cognitiveLogo.svg"
                    alt="CognitiveHealth Logo"
                    sx={{ height: 28 }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
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
