import React from 'react';
import {
    Box,
    Typography,
    Grid,
    ToggleButton,
    ToggleButtonGroup,
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
    IconButton
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import Button from '@/components/atoms/Button/Button';
import { formatCurrency } from '@/utils/formatters';
import { useSuspenseAccountsScreen } from './SuspenseAccountsScreen.hook';
import * as styles from './SuspenseAccountsScreen.styles';
import { SUSPENSE_ACCOUNTS, BY_ACCOUNT_DATA, BY_PAYER_DATA, BY_MONTH_DATA } from './SuspenseAccounts.constants';

const ManageAccountsModal = ({ open, onClose }: { open: boolean, onClose: () => void }) => (
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
                <Box sx={{ mb: 4 }}>
                    {SUSPENSE_ACCOUNTS.map((acc) => (
                        <Box key={acc.key} sx={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 0.8fr 0.5fr', py: 1.5, borderBottom: '1px solid #f8fafc', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569', fontSize: '12px' }}>{acc.key.toUpperCase()}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: 'rgb(10, 22, 40)' }}>{acc.label}</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}><Chip label={acc.key.split('_')[0].toUpperCase()} size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 700, bgcolor: acc.color, color: acc.textColor, border: `1px solid ${acc.textColor}20` }} /></Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}><IconButton size="small" sx={{ color: '#64748b' }}><EditIcon sx={{ fontSize: 16 }} /></IconButton><IconButton size="small" sx={{ color: '#94a3b8' }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton></Box>
                        </Box>
                    ))}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 2, mt: 3 }}>Add New Account</Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}><TextField fullWidth label="ACCOUNT KEY" size="small" /></Grid>
                    <Grid size={{ xs: 6 }}><TextField fullWidth label="DISPLAY LABEL" size="small" /></Grid>
                    <Grid size={{ xs: 6 }}><FormControl fullWidth size="small"><InputLabel shrink>COLOR</InputLabel><Select label="COLOR" defaultValue="blue"><MenuItem value="blue">Blue</MenuItem><MenuItem value="purple">Purple</MenuItem></Select></FormControl></Grid>
                    <Grid size={{ xs: 6 }}><TextField fullWidth label="DESCRIPTION" size="small" /></Grid>
                </Grid>
            </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, mt: 2 }}><Button onClick={onClose} sx={{ color: 'text.secondary' }}>Cancel</Button><Button variant="contained" onClick={onClose}>Save Account</Button></DialogActions>
    </Dialog>
);

const SuspenseAccountsScreen: React.FC = () => {
    const { viewType, manageDialogOpen, handleViewChange, toggleManageDialog } = useSuspenseAccountsScreen();

    const renderTable = (data: any[], cols: string, headers: string[], type: 'account' | 'payer' | 'month') => (
        <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <Box sx={{ ...styles.tableGridStyles(cols), bgcolor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                {headers.map((h, i) => (<Typography key={h} sx={styles.headerTypographyStyles(i >= (type === 'month' ? 1 : 2))}>{h}</Typography>))}
            </Box>
            {data.map((row, idx) => (
                <Box key={idx} sx={{ ...styles.tableGridStyles(cols), borderBottom: idx < data.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    {type === 'account' ? <Chip label={row.account} size="small" sx={styles.accountChipStyles(SUSPENSE_ACCOUNTS.find(s => s.label === row.account))} /> : <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{row.payer || row.month}</Typography>}
                    {type !== 'month' && <Typography sx={{ fontSize: '12px', color: '#3b82f6', fontWeight: 600, textAlign: type === 'account' ? 'left' : 'center' }}>{row.items}</Typography>}
                    {Object.keys(row).filter(key => key !== 'account' && key !== 'items' && key !== 'payer' && key !== 'month' && key !== 'total').map(key => (
                        <Typography key={key} sx={{ fontSize: '12px', color: '#64748b', textAlign: 'right' }}>{row[key] ? formatCurrency(row[key]) : '—'}</Typography>
                    ))}
                    <Typography sx={{ fontSize: '13px', fontWeight: 700, textAlign: 'right' }}>{formatCurrency(row.total)}</Typography>
                </Box>
            ))}
        </Box>
    );

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box><Typography variant="h6" sx={{ fontWeight: 700 }}>Suspense Accounts</Typography><Typography variant="body2" color="text.secondary">Monitor funds held in suspense.</Typography></Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button variant="outlined" size="small" startIcon={<SettingsIcon sx={{ fontSize: 16 }} />} onClick={() => toggleManageDialog(true)}>Manage Accounts</Button>
                    <ToggleButtonGroup value={viewType} exclusive onChange={handleViewChange} size="small" sx={styles.toggleButtonGroupStyles}>
                        <ToggleButton value="account">By Account</ToggleButton><ToggleButton value="payer">By Payer</ToggleButton><ToggleButton value="month">By Month</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}><SummaryCard title="TOTAL OPEN SUSPENSE" value="$1,802,228.20" backgroundColor="#fff" /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}><SummaryCard title="OLDEST ITEM AGE" value="143 days" variant="default" backgroundColor="#fff" /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}><SummaryCard title="AVG DAYS IN SUSPENSE" value="59.3 days" backgroundColor="#fff" /></Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}><SummaryCard title="AT RISK (>30 DAYS)" value="17" variant="default" backgroundColor="#fff" /></Grid>
            </Grid>
            {viewType === 'account' && renderTable(BY_ACCOUNT_DATA, '2fr 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr', ['ACCOUNT TYPE', 'ITEMS', '2026-04', '2026-03', '2026-02', '2026-01', '2025-12', '2025-11', 'TOTAL BALANCE'], 'account')}
            {viewType === 'payer' && renderTable(BY_PAYER_DATA, '2fr 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr', ['FACILITY / PAYER', 'ITEMS', 'MEDICARE', 'REMIT', 'PATIENT', 'CROSS', 'TAX', 'TOTAL'], 'payer')}
            {viewType === 'month' && renderTable(BY_MONTH_DATA, '1fr 1fr 1fr 1fr 1fr 1fr 1fr', ['MONTH', 'MEDICARE', 'REMIT', 'PATIENT', 'CROSS', 'TAX', 'TOTAL'], 'month')}
            <ManageAccountsModal open={manageDialogOpen} onClose={() => toggleManageDialog(false)} />
        </Box>
    );
};

export default SuspenseAccountsScreen;
