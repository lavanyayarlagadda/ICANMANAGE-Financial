import React from 'react';
import { Box, Typography, Dialog, DialogTitle, Divider, DialogContent, Button, TextField, IconButton, Tabs, Tab, alpha, useTheme, useMediaQuery } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import { LocationTabWrapper, LocationTab } from '../ReconciliationScreen.styles';
import { themeConfig } from '@/theme/themeConfig';

interface LocationTabsProps {
  view: string;
  locations: string[];
  activeLocation: string;
  setActiveLocation: (loc: string) => void;
  ageOpen: boolean;
  setAgeOpen: (open: boolean) => void;
  ageRanges: string[];
  activeAge: string | null;
  setActiveAge: (age: string | null) => void;
  transactionNo: string;
  setTransactionNo: (val: string) => void;
  handleSearch: (txNo: string) => void;
}

const LocationTabs: React.FC<LocationTabsProps> = ({
  view,
  locations,
  activeLocation,
  setActiveLocation,
  ageOpen,
  setAgeOpen,
  ageRanges,
  activeAge,
  setActiveAge,
  transactionNo,
  setTransactionNo,
  handleSearch
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

      {view !== 'reconciled' && (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', ml: isMobile ? 0 : 2, mt: isMobile ? 1 : 0 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', color: themeConfig.colors.primary }}
            onClick={() => setAgeOpen(true)}
          >
            <KeyboardArrowDownIcon sx={{ fontSize: 20, transform: ageOpen ? 'rotate(180deg)' : 'none' }} />
            <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>Age {activeAge ? `(${activeAge})` : ''}</Typography>
          </Box>

          <Dialog open={ageOpen} onClose={() => setAgeOpen(false)} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>Select Age Range</DialogTitle>
            <Divider />
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {ageRanges.map(range => (
                  <Button
                    key={range}
                    variant={activeAge === range ? "contained" : "outlined"}
                    onClick={() => { setActiveAge(range); setAgeOpen(false); }}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    {range} Days
                  </Button>
                ))}
                <Button
                  color="error"
                  onClick={() => { setActiveAge(null); setAgeOpen(false); }}
                  sx={{ mt: 1 }}
                >
                  Clear Selection
                </Button>
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
      )}

      <Box sx={{ flex: isMobile ? 'none' : 1 }} />

      {view !== 'my-queue' && (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          background: themeConfig.colors.slate[50],
          border: `1px solid ${themeConfig.colors.slate[200]}`,
          borderRadius: '4px',
          px: 1,
          width: isMobile ? '100%' : 'auto',
          mt: isMobile ? 1 : 0
        }}>
          <TextField
            placeholder="Transaction Number"
            variant="standard"
            size="small"
            value={transactionNo}
            onChange={(e) => setTransactionNo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(transactionNo)}
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: '12px', width: '150px' }
            }}
          />
          <IconButton
            size="small"
            onClick={() => handleSearch(transactionNo)}
          >
            <SearchIcon fontSize="small" sx={{ color: themeConfig.colors.accent }} />
          </IconButton>
        </Box>
      )}
    </LocationTabWrapper>
  );
};

export default LocationTabs;
