import React from 'react';
import { Box, Tabs, Tab, useTheme, useMediaQuery } from '@mui/material';
import { LocationTabWrapper } from '../ReconciliationScreen.styles';

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
              bgcolor: 'grey.100',
              mx: 0.5,
              transition: 'all 0.2s',
              '&:hover': { bgcolor: 'grey.200' },
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
                bgcolor: activeLocation === loc ? 'primary.main' : 'grey.100',
                color: activeLocation === loc ? 'common.white' : 'text.primary',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'none',
                transition: 'all 0.2s',
                opacity: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'common.white',
                },
                '&:hover': {
                  bgcolor: activeLocation === loc ? 'primary.dark' : 'grey.200'
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
