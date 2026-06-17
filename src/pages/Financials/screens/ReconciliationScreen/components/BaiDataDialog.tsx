import React from 'react';
import { Dialog, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { GlassDialog, DynamicTableContainer } from '../ReconciliationScreen.styles';
import * as styles from './BaiDataDialog.styles';

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
          {headers.map((h, i) => (
            <th key={i}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{cell}</td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length} style={{ textAlign: 'center', opacity: 0.5 }}>
              No Data Available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </DynamicTableContainer>
);

const BaiDataDialog: React.FC<BaiDataDialogProps> = ({ open, onClose, txNo }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperComponent={GlassDialog}>
      <styles.StyledDialogTitle>
        <styles.HeaderLeftBox>
          <styles.IconContainer>
            <SearchIcon fontSize="small" />
          </styles.IconContainer>
          <div>
            <styles.HeaderTitleText variant="subtitle1">
              Granular BAI Information
            </styles.HeaderTitleText>
            <styles.HeaderSubText variant="caption">Audit Level Trace: {txNo}</styles.HeaderSubText>
          </div>
        </styles.HeaderLeftBox>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </styles.StyledDialogTitle>
      <Divider />
      <styles.StyledDialogContent>
        <PopupTable
          headers={[
            'AS OF DATE',
            'BANK ID',
            'BANK NAME',
            'ACCOUNT NUMBER',
            'ACCOUNT NAME',
            'CURRENCY',
            'BAI CODE',
            'AMOUNT',
            'TRANSACTION ID',
          ]}
          rows={[
            [
              '06/05/2025',
              '124001545',
              'JPMorgan Chase Bank, N.A.',
              '785738797',
              'Vertava Deposits',
              'USD',
              '840',
              '$292.88',
              txNo,
            ],
          ]}
        />
        <styles.FooterContainer>
          <styles.FooterText variant="body2">
            End of granular data trace. All records verified against bank feed.
          </styles.FooterText>
        </styles.FooterContainer>
      </styles.StyledDialogContent>
    </Dialog>
  );
};

export default BaiDataDialog;
