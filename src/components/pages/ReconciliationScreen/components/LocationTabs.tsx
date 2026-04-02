import React from 'react';
import { Box, Typography, Dialog, DialogTitle, Divider, DialogContent, Button, TextField, IconButton } from '@mui/material';
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
  return (
    <LocationTabWrapper sx={{ mb: 2 }}>
      {locations.map(loc => (
        <LocationTab
          key={loc}
          active={activeLocation === loc}
          onClick={() => setActiveLocation(loc)}
        >
          {loc}
        </LocationTab>
      ))}

      {view !== 'reconciled' && (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', ml: 2 }}>
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

      <Box sx={{ flex: 1 }} />

      {view !== 'my-queue' && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: themeConfig.colors.slate[50], 
          border: `1px solid ${themeConfig.colors.slate[200]}`, 
          borderRadius: '4px', 
          px: 1 
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
