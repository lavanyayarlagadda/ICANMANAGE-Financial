import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Divider,
  TextField,
  MenuItem,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { GlassDialog } from '../ReconciliationScreen.styles';
import { themeConfig } from '@/theme/themeConfig';

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperComponent={GlassDialog}
    >
      <DialogTitle sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon sx={{ color: themeConfig.colors.primary }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Assign Transaction</Typography>
        </Box>
        <IconButton size="small" onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 3 }}>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontWeight: 600 }}>
          Assign Transaction <Box component="span" sx={{ color: themeConfig.colors.primary, fontWeight: 800 }}>{txNo}</Box> to a staff member.
        </Typography>
        <TextField
          select
          fullWidth
          size="small"
          label="Select User"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="All">Select User...</MenuItem>
          <MenuItem value="Naga Kiran">Naga Kiran</MenuItem>
          <MenuItem value="Lavanya S">Lavanya S</MenuItem>
          <MenuItem value="Admin System">Admin System</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', fontWeight: 700 }}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleAssign}
          sx={{ textTransform: 'none', fontWeight: 800, px: 3 }}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignUserDialog;
