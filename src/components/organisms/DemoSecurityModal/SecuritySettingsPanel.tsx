import React from 'react';
import { MenuItem, Select } from '@mui/material';
import {
  PanelContainer,
  IconHeaderBox,
  StyledSecurityIcon,
  PanelTitle,
  FormFieldWrapper,
  FormFieldLabel,
  StyledTextField,
  StyledFullWidthFormControl,
  CaptionSecondaryText,
} from './DemoSecurityModal.styles';

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
    <PanelContainer>
      <IconHeaderBox>
        <StyledSecurityIcon fontSize="small" />
        <PanelTitle variant="subtitle2">Security Settings</PanelTitle>
      </IconHeaderBox>

      <FormFieldWrapper>
        <FormFieldLabel variant="body2">Inactivity Timeout (minutes)</FormFieldLabel>
        <StyledTextField
          fullWidth
          size="small"
          value={inactivityTimeout}
          onChange={(e) => setInactivityTimeout(e.target.value)}
        />
        <CaptionSecondaryText variant="caption" color="text.secondary">
          Set to 0 to disable. User will be logged out after this many minutes of inactivity.
        </CaptionSecondaryText>
      </FormFieldWrapper>

      <FormFieldWrapper>
        <FormFieldLabel variant="body2">Password Expiration Policy</FormFieldLabel>
        <StyledFullWidthFormControl fullWidth size="small">
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
        </StyledFullWidthFormControl>
        <CaptionSecondaryText variant="caption" color="text.secondary">
          Applies to Manager accounts only.
        </CaptionSecondaryText>
      </FormFieldWrapper>
    </PanelContainer>
  );
};
