import React from 'react';
import { Box, Typography, TextField, FormControl, Select, MenuItem } from '@mui/material';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import { themeConfig } from '@/theme';

interface SecuritySettingsPanelProps {
  inactivityTimeout: string;
  setInactivityTimeout: (val: string) => void;
  passwordPolicy: string;
  setPasswordPolicy: (val: string) => void;
}

export const SecuritySettingsPanel: React.FC<SecuritySettingsPanelProps> = ({
  inactivityTimeout,
  setInactivityTimeout,
  passwordPolicy,
  setPasswordPolicy,
}) => {
  return (
    <Box sx={{ border: `1px solid ${themeConfig.colors.border}`, borderRadius: 2, p: 2 }}>
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
  );
};
