import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@/components/atoms/Button/Button';
import { ReconciliationRow } from '@/interfaces/financials';

interface CommentsDialogProps {
  open: boolean;
  onClose: () => void;
  row: ReconciliationRow | null;
}

const CommentsDialog: React.FC<CommentsDialogProps> = ({ open, onClose }) => {
  // Mock comments history
  const history = [
    { text: 'Gl Amount updated to 123.0', user: 'Naga Kiran', date: '04/06/2026' },
    { text: 'ada', user: 'Naga Kiran', date: '04/06/2026' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Comments</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {history.map((item, index) => (
            <Box 
              key={index} 
              sx={{ 
                p: 2, 
                borderRadius: '8px', 
                bgcolor: 'grey.50',
                border: (t) => `1px solid ${t.palette.divider}`
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.primary', mb: 0.5 }}>
                {item.text}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                ,updated By {item.user} ,created on {item.date}
              </Typography>
            </Box>
          ))}
          {!history.length && (
            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary', textAlign: 'center', py: 4 }}>
              No comments available for this transaction.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" sx={{ bgcolor: 'grey.100', color: 'text.primary', border: 'none', '&:hover': { bgcolor: 'grey.200' } }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentsDialog;
