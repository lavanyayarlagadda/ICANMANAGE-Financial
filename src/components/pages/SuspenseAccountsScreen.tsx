import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SummaryCard from '@/components/atoms/SummaryCard';
import Button from '@/components/atoms/Button';
import { formatCurrency } from '@/utils/formatters';

// Mock Data
const SUSPENSE_ACCOUNTS = [
  { key: 'medicare_part_a', label: 'Medicare Part A Suspense', color: '#e0f2fe', textColor: '#0369a1' },
  { key: 'patient_responsibility', label: 'Patient Responsibility Suspense', color: '#f3e8ff', textColor: '#7e22ce' },
  { key: 'tax_holding', label: 'Tax Holding Suspense', color: '#f1f5f9', textColor: '#475569' },
  { key: 'cross_entity', label: 'Cross-Entity Suspense', color: '#fee2e2', textColor: '#b91c1c' },
  { key: 'remittance_clearing', label: 'Remittance Clearing Suspense', color: '#ffedd5', textColor: '#9a3412' },
];

const BY_ACCOUNT_DATA = [
  { account: 'Medicare Part A Suspense', items: 7, '2026-04': null, '2026-03': 178469.34, '2026-02': null, '2026-01': 191903.55, '2025-12': 70161.13, '2025-11': 23739.78, total: 464273.80 },
  { account: 'Patient Responsibility Suspense', items: 6, '2026-04': 124834.66, '2026-03': 94869.43, '2026-02': 29223.96, '2026-01': 79962.45, '2025-12': 45285.37, '2025-11': 7747.28, total: 381923.15 },
  { account: 'Tax Holding Suspense', items: 5, '2026-04': null, '2026-03': 16849.10, '2026-02': 64081.36, '2026-01': 119121.28, '2025-12': 48858.83, '2025-11': 93680.60, total: 342591.17 },
  { account: 'Cross-Entity Suspense', items: 6, '2026-04': 35361.24, '2026-03': 13625.66, '2026-02': 45246.04, '2026-01': 75091.07, '2025-12': 47693.76, '2025-11': 118516.21, total: 335533.98 },
  { account: 'Remittance Clearing Suspense', items: 6, '2026-04': 25190.15, '2026-03': 38705.01, '2026-02': 94753.75, '2026-01': 34182.42, '2025-12': 33268.27, '2025-11': null, total: 226099.60 },
];

const BY_PAYER_DATA = [
  { payer: 'North Star Health', items: 2, medicare: null, remittance: null, patient: 124834.66, cross: 118516.21, tax: null, total: 243350.87 },
  { payer: 'Summit Health Systems', items: 2, medicare: 138648.96, remittance: null, patient: null, cross: 13625.66, tax: null, total: 152274.62 },
  { payer: 'Unity Health Group', items: 2, medicare: 89983.46, remittance: 51806.50, patient: null, cross: null, tax: null, total: 141789.96 },
  { payer: 'Valley View Medical Center', items: 2, medicare: null, remittance: null, patient: null, cross: 35361.24, tax: 93680.60, total: 129041.84 },
  { payer: 'Pinecrest Medical Group', items: 1, medicare: null, remittance: null, patient: null, cross: null, tax: 119121.28, total: 119121.28 },
];

const BY_MONTH_DATA = [
  { month: '2026-04', medicare: null, remittance: 25190.15, patient: 124834.66, cross: 35361.24, tax: null, total: 185386.05 },
  { month: '2026-03', medicare: 178469.34, remittance: 38705.01, patient: 94869.43, cross: 13625.66, tax: 16849.10, total: 342518.54 },
  { month: '2026-02', medicare: null, remittance: 94753.75, patient: 29223.96, cross: 45246.04, tax: 64081.36, total: 233305.11 },
  { month: '2026-01', medicare: 191903.55, remittance: 34182.42, patient: 79962.45, cross: 75091.07, tax: 119121.28, total: 500260.77 },
  { month: '2025-12', medicare: 70161.13, remittance: 33268.27, patient: 45285.37, cross: 47693.76, tax: 48858.83, total: 245267.36 },
];

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

const ManageAccountsModal = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, px: 3, pt: 3 }}>Manage Suspense Accounts</DialogTitle>
      <DialogContent sx={{ px: 3 }}>
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 0.8fr 0.5fr', mb: 2, pb: 1, borderBottom: '1px solid #eee' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>KEY</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>LABEL</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'center' }}>COLOR</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'right' }}>ACTIONS</Typography>
          </Box>
          
          {/* Existing Accounts List */}
          <Box sx={{ mb: 4 }}>
            {SUSPENSE_ACCOUNTS.map((acc) => (
              <Box key={acc.key} sx={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 0.8fr 0.5fr', py: 1.5, borderBottom: '1px solid #f8fafc', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569', fontSize: '12px' }}>{acc.key.toUpperCase()}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'rgb(10, 22, 40)' }}>{acc.label}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Chip 
                    label={acc.key.split('_')[0].toUpperCase()} 
                    size="small" 
                    sx={{ 
                      height: 20, 
                      fontSize: '10px', 
                      fontWeight: 700, 
                      bgcolor: acc.color, 
                      color: acc.textColor,
                      border: `1px solid ${acc.textColor}20`
                    }} 
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                  <IconButton size="small" sx={{ color: '#64748b' }}><EditIcon sx={{ fontSize: 16 }} /></IconButton>
                  <IconButton size="small" sx={{ color: '#94a3b8' }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                </Box>
              </Box>
            ))}
          </Box>

          <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, mt: 3 }}>Add New Account</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="ACCOUNT KEY" placeholder="e.g. MEDICARE_PIP" size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="DISPLAY LABEL" placeholder="e.g. Medicare Part A" size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel shrink>BADGE COLOR CLASS</InputLabel>
                <Select label="BADGE COLOR CLASS" defaultValue="blue">
                  <MenuItem value="blue">Blue (PIP)</MenuItem>
                  <MenuItem value="purple">Purple (Patient)</MenuItem>
                  <MenuItem value="gray">Gray (Tax)</MenuItem>
                  <MenuItem value="red">Red (Cross-Entity)</MenuItem>
                  <MenuItem value="orange">Orange (Remittance)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth label="DESCRIPTION" placeholder="Optional notes..." size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, mt: 2 }}>
        <Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button>
        <Button variant="contained" onClick={onClose} sx={{ bgcolor: '#334155', '&:hover': { bgcolor: '#1e293b' } }}>Save Account</Button>
      </DialogActions>
    </Dialog>
  );
};

const SuspenseAccountsScreen: React.FC = () => {
  const theme = useTheme();
  const [viewType, setViewType] = useState<'account' | 'payer' | 'month'>('account');
  const [manageDialogOpen, setManageDialogOpen] = useState(false);

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, nextView: 'account' | 'payer' | 'month') => {
    if (nextView !== null) setViewType(nextView);
  };

  const renderByAccountTable = () => (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr', bgcolor: '#f1f5f9', p: 1.5, borderBottom: '1px solid #e2e8f0' }}>
        {['ACCOUNT TYPE', 'ITEMS', '2026-04', '2026-03', '2026-02', '2026-01', '2025-12', '2025-11', 'TOTAL BALANCE'].map((h, i) => (
          <Typography key={h} sx={{ fontWeight: 700, fontSize: '11px', color: '#64748b', textAlign: i >= 2 ? 'right' : 'left' }}>{h}</Typography>
        ))}
      </Box>
      {BY_ACCOUNT_DATA.map((row, idx) => {
        const config = SUSPENSE_ACCOUNTS.find(s => s.label === row.account);
        return (
          <Box key={idx} sx={{ display: 'grid', gridTemplateColumns: '2fr 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr', p: 1.5, borderBottom: idx < BY_ACCOUNT_DATA.length - 1 ? '1px solid #f1f5f9' : 'none', alignItems: 'center' }}>
            <Chip
              label={row.account}
              size="small"
              sx={{
                bgcolor: config?.color || '#f1f5f9',
                color: config?.textColor || '#64748b',
                fontWeight: 600,
                fontSize: '11px',
                width: 'fit-content',
                height: 24
              }}
            />
            <Typography sx={{ fontSize: '12px', color: '#3b82f6', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>{row.items}</Typography>
            <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row['2026-04'] ? formatCurrency(row['2026-04']) : '—'}</Typography>
            <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row['2026-03'] ? formatCurrency(row['2026-03']) : '—'}</Typography>
            <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row['2026-02'] ? formatCurrency(row['2026-02']) : '—'}</Typography>
            <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row['2026-01'] ? formatCurrency(row['2026-01']) : '—'}</Typography>
            <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row['2025-12'] ? formatCurrency(row['2025-12']) : '—'}</Typography>
            <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row['2025-11'] ? formatCurrency(row['2025-11']) : '—'}</Typography>
            <Typography sx={{ fontSize: '13px', color: 'rgb(10, 22, 40)', fontWeight: 700, textAlign: 'right' }}>{formatCurrency(row.total)}</Typography>
          </Box>
        );
      })}
    </Box>
  );

  const renderByPayerTable = () => (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr', bgcolor: '#f1f5f9', p: 1.5, borderBottom: '1px solid #e2e8f0' }}>
        {['FACILITY / PAYER', 'ITEMS', 'MEDICARE PART A', 'REMITTANCE CLEARING', 'PATIENT RESPONSIBILITY', 'CROSS-ENTITY', 'TAX HOLDING', 'TOTAL BALANCE'].map((h, i) => (
          <Typography key={h} sx={{ fontWeight: 700, fontSize: '11px', color: '#64748b', textAlign: i >= 2 ? 'right' : 'left' }}>{h}</Typography>
        ))}
      </Box>
      {BY_PAYER_DATA.map((row, idx) => (
        <Box key={idx} sx={{ display: 'grid', gridTemplateColumns: '2fr 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr', p: 1.5, borderBottom: idx < BY_PAYER_DATA.length - 1 ? '1px solid #f1f5f9' : 'none', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'rgb(10, 22, 40)' }}>{row.payer}</Typography>
          <Typography sx={{ fontSize: '12px', color: '#3b82f6', fontWeight: 600, textAlign: 'center' }}>{row.items}</Typography>
          <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row.medicare ? formatCurrency(row.medicare) : '—'}</Typography>
          <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row.remittance ? formatCurrency(row.remittance) : '—'}</Typography>
          <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row.patient ? formatCurrency(row.patient) : '—'}</Typography>
          <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row.cross ? formatCurrency(row.cross) : '—'}</Typography>
          <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row.tax ? formatCurrency(row.tax) : '—'}</Typography>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, textAlign: 'right' }}>{formatCurrency(row.total)}</Typography>
        </Box>
      ))}
    </Box>
  );

  const renderByMonthTable = () => (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr', bgcolor: '#f1f5f9', p: 1.5, borderBottom: '1px solid #e2e8f0' }}>
        {['MONTH', 'MEDICARE PART A', 'REMITTANCE CLEARING', 'PATIENT RESPONSIBILITY', 'CROSS-ENTITY', 'TAX HOLDING', 'MONTH TOTAL'].map((h, i) => (
          <Typography key={h} sx={{ fontWeight: 700, fontSize: '11px', color: '#64748b', textAlign: i >= 1 ? 'right' : 'left' }}>{h}</Typography>
        ))}
      </Box>
      {BY_MONTH_DATA.map((row, idx) => (
        <Box key={idx} sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr', p: 1.5, borderBottom: idx < BY_MONTH_DATA.length - 1 ? '1px solid #f1f5f9' : 'none', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: 'rgb(10, 22, 40)' }}>{row.month}</Typography>
          <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row.medicare ? formatCurrency(row.medicare) : '—'}</Typography>
          <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row.remittance ? formatCurrency(row.remittance) : '—'}</Typography>
          <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row.patient ? formatCurrency(row.patient) : '—'}</Typography>
          <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row.cross ? formatCurrency(row.cross) : '—'}</Typography>
          <Typography sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row.tax ? formatCurrency(row.tax) : '—'}</Typography>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, textAlign: 'right' }}>{formatCurrency(row.total)}</Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{ p: 0 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'rgb(10, 22, 40)' }}>Suspense Accounts</Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor funds held in suspense across accounts, payers, and time periods. Click any cell to drill into individual transactions.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<SettingsIcon sx={{ fontSize: 16 }} />}
            onClick={() => setManageDialogOpen(true)}
            sx={{
              color: 'rgb(10, 22, 40)',
              borderColor: '#cbd5e1',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '6px'
            }}
          >
            Manage Accounts
          </Button>
          <ToggleButtonGroup
            value={viewType}
            exclusive
            onChange={handleViewChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                px: 2,
                py: 0.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '12px',
                color: '#64748b',
                borderRadius: '6px !important',
                border: '1px solid #e2e8f0',
                ml: '8px !important',
                '&.Mui-selected': {
                  bgcolor: 'rgba(107, 153, 196, 0.7)',
                  color: '#fff',
                  border: 'none',
                  '&:hover': { bgcolor: 'rgba(107, 153, 196, 0.8)' }
                }
              }
            }}
          >
            <ToggleButton value="account">By Account</ToggleButton>
            <ToggleButton value="payer">By Payer</ToggleButton>
            <ToggleButton value="month">By Month</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="TOTAL OPEN SUSPENSE"
            value="$1,802,228.20"
            subtitle="30 open items"
            backgroundColor="#fff"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="OLDEST ITEM AGE"
            value="143 days"
            subtitle="⚠ Exceeds 30-day threshold"
            variant="default"
            backgroundColor="#fff"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="AVG DAYS IN SUSPENSE"
            value="59.3 days"
            subtitle="All open accounts"
            backgroundColor="#fff"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title="AT RISK (>30 DAYS)"
            value="17"
            subtitle="⚠ Action required"
            variant="default"
            backgroundColor="#fff"
          />
        </Grid>
      </Grid>

      {/* Tables Section */}
      <Box>
        {viewType === 'account' && renderByAccountTable()}
        {viewType === 'payer' && renderByPayerTable()}
        {viewType === 'month' && renderByMonthTable()}
      </Box>

      <ManageAccountsModal open={manageDialogOpen} onClose={() => setManageDialogOpen(false)} />
    </Box>
  );
};

export default SuspenseAccountsScreen;
