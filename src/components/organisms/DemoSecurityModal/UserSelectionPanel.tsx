import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { themeConfig } from '@/theme';
import { LOGIN_API_RESPONSE } from '@/utils/dummyData';

interface UserSelectionPanelProps {
  selectedUser: string;
  onUserChange: (event: SelectChangeEvent<string>) => void;
  currentUserId: string;
}

export const UserSelectionPanel: React.FC<UserSelectionPanelProps> = ({
  selectedUser,
  onUserChange,
  currentUserId,
}) => {
  return (
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
            onChange={onUserChange}
            displayEmpty
            sx={{ backgroundColor: themeConfig.colors.surface, borderRadius: 1 }}
          >
            {LOGIN_API_RESPONSE.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.username} ({u.role.charAt(0).toUpperCase() + u.role.slice(1)}) {u.id === currentUserId ? '(You)' : ''}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Typography variant="caption" sx={{ color: themeConfig.colors.primary, display: 'block' }}>
        You are editing the menu visibility and settings for the selected user.
      </Typography>
    </Box>
  );
};
