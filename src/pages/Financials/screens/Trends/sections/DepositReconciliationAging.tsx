import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import {
  agingRiskColor,
  toText,
  type AgingSummary,
  type AgingRow
} from '../helpers/depositReconciliationHelpers';

interface DepositReconciliationAgingProps {
  agingData: {
    title?: unknown;
    description?: unknown;
  };
  agingSummary: AgingSummary | null;
  agingRows: AgingRow[];
}

export const DepositReconciliationAging: React.FC<DepositReconciliationAgingProps> = ({
  agingData,
  agingSummary,
  agingRows
}) => {
  const theme = useTheme();

  return (
    <Card sx={{ mb: 2, border: `1px solid ${theme.palette.divider}` }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {String(agingData.title || '')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.6 }}>
          {String(agingData.description || '')}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {agingSummary?.headlineValue || '—'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {agingSummary?.headlineMeta || ''}
        </Typography>

        <Box sx={{ mt: 2, overflowX: 'auto' }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <Box component="thead">
              <Box component="tr">
                {['Age Bucket', 'Deposits', 'Amount', '% of $', 'Distribution'].map((label) => (
                  <Box
                    component="th"
                    key={label}
                    sx={{
                      py: 1,
                      px: 1,
                      textAlign: label === 'Age Bucket' || label === 'Distribution' ? 'left' : 'right',
                      color: theme.palette.text.secondary,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      fontSize: 12
                    }}
                  >
                    {label}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {agingRows.map((row) => {
                const percent = Number(toText(row.share, '0').replace('%', '').replace(/[^\d.-]/g, '')) || 0;
                const barColor = row.riskLevel
                  ? agingRiskColor(row.riskLevel, theme)
                  : percent < 20
                    ? theme.palette.success.main
                    : percent < 30
                      ? theme.palette.warning.main
                      : theme.palette.error.main;

                return (
                  <Box component="tr" key={row.bucket}>
                    <Box component="td" sx={{ py: 1, px: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                      {row.bucket}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1, textAlign: 'right', borderBottom: `1px solid ${theme.palette.divider}` }}>
                      {row.deposits}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1, textAlign: 'right', borderBottom: `1px solid ${theme.palette.divider}` }}>
                      {row.amount}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1, textAlign: 'right', borderBottom: `1px solid ${theme.palette.divider}` }}>
                      {toText(row.share)}
                    </Box>
                    <Box component="td" sx={{ py: 1, px: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
                      <Box sx={{ backgroundColor: theme.palette.action.hover, borderRadius: 2, height: 10 }}>
                        <Box sx={{ width: `${Math.max(8, percent)}%`, height: '100%', borderRadius: 2, backgroundColor: barColor }} />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
