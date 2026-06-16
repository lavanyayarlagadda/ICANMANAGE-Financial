import React from 'react';
import { FormControl, MenuItem, SelectChangeEvent } from '@mui/material';
import { LOGIN_API_RESPONSE } from '@/utils/dummyData';
import {
  ConfigureUserBox,
  IconHeaderBox,
  SectionTitle,
  FormRow,
  LabelTypography,
  UserSelect,
  StyledPersonIcon,
  CaptionHelperText,
} from './DemoSecurityModal.styles';

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
    <ConfigureUserBox>
      <IconHeaderBox>
        <StyledPersonIcon fontSize="small" />
        <SectionTitle variant="subtitle2">Configure for User</SectionTitle>
      </IconHeaderBox>

      <FormRow>
        <LabelTypography variant="body2">Select User:</LabelTypography>
        <FormControl fullWidth size="small">
          <UserSelect value={selectedUser} onChange={onUserChange} displayEmpty>
            {LOGIN_API_RESPONSE.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.username} ({u.role.charAt(0).toUpperCase() + u.role.slice(1)}){' '}
                {u.id === currentUserId ? '(You)' : ''}
              </MenuItem>
            ))}
          </UserSelect>
        </FormControl>
      </FormRow>
      <CaptionHelperText variant="caption">
        You are editing the menu visibility and settings for the selected user.
      </CaptionHelperText>
    </ConfigureUserBox>
  );
};
