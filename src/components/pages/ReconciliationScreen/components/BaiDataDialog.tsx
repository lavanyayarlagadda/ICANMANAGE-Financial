import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { GlassDialog, DynamicTableContainer } from '../ReconciliationScreen.styles';
import { themeConfig } from '@/theme/themeConfig';

interface BaiDataDialogProps {
  open: boolean;
  onClose: () => void;
  txNo: string;
}

const PopupTable: React.FC<{
  headers: string[];
  rows: (string | number)[][];
}> = ({ headers, rows }) => (
  <DynamicTableContainer>
    <table>
      <thead>
        <tr>
          {headers.map((h, i) => <th key={i}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? rows.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
          </tr>
        )) : (
          <tr>
            <td colSpan={headers.length} style={{ textAlign: 'center', opacity: 0.5 }}>No Data Available</td>
          </tr>
        )}
      </tbody>
    </table>
  </DynamicTableContainer>
);

const BaiDataDialog: React.FC<BaiDataDialogProps> = ({ open, onClose, txNo }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperComponent={GlassDialog}
    >
      <DialogTitle sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `linear-gradient(to right, ${themeConfig.colors.sky[50]}, #fff)` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: '10px', background: `linear-gradient(135deg, ${themeConfig.colors.sky[600]}, ${themeConfig.colors.sky[800]})`, color: '#fff', display: 'flex' }}>
            <SearchIcon fontSize="small" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: themeConfig.colors.sky[950] }}>Granular BAI Information</Typography>
            <Typography variant="caption" sx={{ color: themeConfig.colors.sky[500], fontWeight: 800 }}>Audit Level Trace: {txNo}</Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <PopupTable
          headers={['AS OF DATE', 'BANK ID', 'BANK NAME', 'ACCOUNT NUMBER', 'ACCOUNT NAME', 'CURRENCY', 'BAI CODE', 'AMOUNT', 'TRANSACTION ID']}
          rows={[['06/05/2025', '124001545', 'JPMorgan Chase Bank, N.A.', '785738797', 'Vertava Deposits', 'USD', '840', '$292.88', txNo]]}
        />
        <Box sx={{ p: 6, textAlign: 'center', backgroundColor: themeConfig.colors.slate[50] }}>
          <Typography variant="body2" sx={{ color: themeConfig.colors.slate[500], fontStyle: 'italic' }}>
            End of granular data trace. All records verified against bank feed.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BaiDataDialog;
