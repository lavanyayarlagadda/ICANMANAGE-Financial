import React from 'react';
import { Box, Tabs, Tab, Typography, useTheme } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

interface Entity {
    id: string;
    name: string;
}

interface BankDepositTabsProps {
    entities: Entity[];
    selectedEntityId: string;
    onEntityChange: (id: string) => void;
}

const BankDepositTabs: React.FC<BankDepositTabsProps> = ({ entities, selectedEntityId, onEntityChange }) => {
    const theme = useTheme();

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', mb: 1.5, display: 'block', letterSpacing: '0.05em' }}>View Entity</Typography>
            <Tabs
                value={selectedEntityId}
                onChange={(_, val) => onEntityChange(val)}
                variant="scrollable"
                scrollButtons={true}
                allowScrollButtonsMobile
                sx={{
                    minHeight: 'auto',
                    '& .MuiTabs-indicator': { display: 'none' },
                    '& .MuiTabs-flexContainer': { gap: 1 },
                    '& .MuiTabs-scrollButtons': {
                        width: 28,
                        borderRadius: '4px',
                        backgroundColor: theme.palette.action.hover,
                        '&.Mui-disabled': { opacity: 0 }
                    }
                }}
            >
                {entities.map((e) => {
                    const isActive = selectedEntityId === e.id;
                    return (
                        <Tab
                            key={e.id}
                            value={e.id}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: '13px',
                                minHeight: 'auto',
                                p: 0,
                                opacity: 1,
                                '& .MuiBox-root': {
                                    px: 2,
                                    py: 0.6,
                                    borderRadius: '16px',
                                    transition: 'all 0.2s',
                                    backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
                                    color: isActive ? themeConfig.colors.tabs.textActive : themeConfig.colors.tabs.textInactive,
                                    '&:hover': {
                                        backgroundColor: isActive ? theme.palette.primary.dark : theme.palette.action.hover,
                                    }
                                }
                            }}
                            label={<Box>{e.name}</Box>}
                            disableRipple
                        />
                    );
                })}
            </Tabs>
        </Box>
    );
};

export default BankDepositTabs;
