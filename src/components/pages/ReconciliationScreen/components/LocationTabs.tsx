import React from 'react';
import { Box, Tabs, Tab, alpha, useTheme, useMediaQuery } from '@mui/material';
import { LocationTabWrapper } from '../ReconciliationScreen.styles';
import { themeConfig } from '@/theme/themeConfig';

interface LocationTabsProps {
  view: string;
  locations: string[];
  activeLocation: string;
  setActiveLocation: (loc: string) => void;
}

const LocationTabs: React.FC<LocationTabsProps> = ({
  locations,
  activeLocation,
  setActiveLocation,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <LocationTabWrapper sx={{
      mb: 2,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'flex-start' : 'center',
      flexWrap: 'nowrap',
      gap: 2
    }}>
      <Box sx={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
        <Tabs
          value={activeLocation}
          onChange={(_, newValue) => setActiveLocation(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            width: '100%',
            minHeight: 'auto',
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTabs-flexContainer': { gap: '4px' },
            '& .MuiTabs-scrollButtons': {
              width: '32px',
              borderRadius: '4px',
              backgroundColor: alpha(themeConfig.colors.slate[100], 0.8),
              mx: 0.5,
              transition: 'all 0.2s',
              '&:hover': { backgroundColor: themeConfig.colors.slate[200] },
              '&.Mui-disabled': { display: 'none' }
            }
          }}
        >
          {locations.map((loc) => (
            <Tab
              key={loc}
              label={loc}
              value={loc}
              disableRipple
              sx={{
                minHeight: 'auto',
                minWidth: 'auto',
                padding: '6px 16px',
                backgroundColor: activeLocation === loc ? themeConfig.colors.primary : themeConfig.colors.slate[100],
                color: activeLocation === loc ? themeConfig.colors.surface + ' !important' : themeConfig.colors.slate[700],
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'none',
                transition: 'all 0.2s',
                opacity: 1,
                '&.Mui-selected': {
                  backgroundColor: themeConfig.colors.primary,
                  color: themeConfig.colors.surface,
                },
                '&:hover': {
                  backgroundColor: activeLocation === loc ? themeConfig.colors.primaryDark : themeConfig.colors.slate[200]
                }
              }}
            />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ flex: isMobile ? 'none' : 1 }} />
    </LocationTabWrapper>
  );
};

export default LocationTabs;
