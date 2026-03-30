import React, { useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  IconButton,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AddNewDialogProps {
  open: boolean;
  onClose: () => void;
  activeTab: number;
}

const tabTypeMap: Record<number, { title: string; fields: { name: string; label: string; type?: string; options?: string[] }[] }> = {
  0: {
    title: 'Transaction',
    fields: [
      { name: 'type', label: 'Transaction Type', type: 'select', options: ['PAYMENT', 'RECOUPMENT', 'FORWARD_BALANCE', 'ADJUSTMENT'] },
      { name: 'effectiveDate', label: 'Effective Date', type: 'date' },
      { name: 'description', label: 'Description' },
      { name: 'sourceProvider', label: 'Source / Provider' },
      { name: 'amount', label: 'Amount', type: 'number' },
    ],
  },
  1: {
    title: 'Payment',
    fields: [
      { name: 'effectiveDate', label: 'Effective Date', type: 'date' },
      { name: 'description', label: 'Description' },
      { name: 'sourceProvider', label: 'Source / Provider' },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'status', label: 'Status', type: 'select', options: ['Posted', 'Completed', 'Reconciled', 'Needs Review'] },
    ],
  },
  2: {
    title: 'PIP Record',
    fields: [
      { name: 'ptan', label: 'PTAN' },
      { name: 'paymentDate', label: 'Payment Date', type: 'date' },
      { name: 'checkEftNumber', label: 'Check/EFT Number' },
      { name: 'paymentAmount', label: 'Payment Amount', type: 'number' },
    ],
  },
  3: {
    title: 'Forward Balance',
    fields: [
      { name: 'payer', label: 'Payer' },
      { name: 'patientName', label: 'Patient Name' },
      { name: 'claimId', label: 'Claim ID' },
      { name: 'forwardedAmount', label: 'Forwarded Amount', type: 'number' },
      { name: 'forwardedDate', label: 'Forwarded Date', type: 'date' },
    ],
  },
  4: {
    title: 'Recoupment',
    fields: [
      { name: 'payer', label: 'Payer' },
      { name: 'claimId', label: 'Claim ID' },
      { name: 'patientName', label: 'Patient Name' },
      { name: 'recoupmentAmount', label: 'Recoupment Amount', type: 'number' },
      { name: 'reason', label: 'Reason' },
      { name: 'recoupmentDate', label: 'Recoupment Date', type: 'date' },
    ],
  },
  5: {
    title: 'Adjustment',
    fields: [
      { name: 'effectiveDate', label: 'Effective Date', type: 'date' },
      { name: 'type', label: 'Adjustment Type', type: 'select', options: ['WRITE-OFF', 'CREDIT', 'INTEREST', 'CONTRACTUAL', 'REFUND', 'TRANSFER', 'RECLASSIFICATION', 'CHARITY'] },
      { name: 'description', label: 'Description' },
      { name: 'sourceProvider', label: 'Source / Provider' },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'referenceId', label: 'Reference ID' },
    ],
  },
};

const AddNewDialog: React.FC<AddNewDialogProps> = ({ open, onClose, activeTab }) => {
  const config = useMemo(() => tabTypeMap[activeTab] || tabTypeMap[0], [activeTab]);

  const handleSave = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Add New {config.title}</Typography>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {config.fields.map((field) =>
            field.type === 'select' ? (
              <TextField
                key={field.name}
                label={field.label}
                select
                size="small"
                fullWidth
                defaultValue=""
              >
                {field.options?.map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                key={field.name}
                label={field.label}
                type={field.type || 'text'}
                size="small"
                fullWidth
                InputLabelProps={field.type === 'date' ? { shrink: true } : undefined}
              />
            )
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" size="small">Cancel</Button>
        <Button onClick={handleSave} variant="contained" size="small">Add {config.title}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddNewDialog;
