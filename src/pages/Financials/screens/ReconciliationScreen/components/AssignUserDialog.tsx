import React, { useState } from 'react';
import { Dialog, Divider, MenuItem, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { GlassDialog } from '../ReconciliationScreen.styles';
import * as styles from './AssignUserDialog.styles';

interface AssignUserDialogProps {
  open: boolean;
  onClose: () => void;
  txNo: string;
  onAssign: (user: string) => void;
}

const AssignUserDialog: React.FC<AssignUserDialogProps> = ({ open, onClose, txNo, onAssign }) => {
  const [selectedUser, setSelectedUser] = useState('All');

  const handleAssign = () => {
    if (selectedUser === 'All') {
      alert('Please select a user first.');
      return;
    }
    onAssign(selectedUser);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperComponent={GlassDialog}>
      <styles.TitleContainer>
        <styles.TitleFlexBox>
          <PersonAddIcon color="primary" />
          <styles.TitleText variant="subtitle1">Assign Transaction</styles.TitleText>
        </styles.TitleFlexBox>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </styles.TitleContainer>
      <Divider />
      <styles.ContentContainer>
        <styles.InstructionText variant="body2">
          Assign Transaction <styles.HighlightTxNo>{txNo}</styles.HighlightTxNo> to a staff member.
        </styles.InstructionText>
        <styles.UserSelectField
          select
          fullWidth
          size="small"
          label="Select User"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <MenuItem value="All">Select User...</MenuItem>
          <MenuItem value="Naga Kiran">Naga Kiran</MenuItem>
          <MenuItem value="Lavanya S">Lavanya S</MenuItem>
          <MenuItem value="Admin System">Admin System</MenuItem>
        </styles.UserSelectField>
      </styles.ContentContainer>
      <styles.ActionsContainer>
        <styles.CancelButton onClick={onClose}>Cancel</styles.CancelButton>
        <styles.AssignButton variant="contained" onClick={handleAssign}>
          Assign
        </styles.AssignButton>
      </styles.ActionsContainer>
    </Dialog>
  );
};

export default AssignUserDialog;
