import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Divider,
    Grid,
    Box,
    Typography,
    IconButton,
    TextField,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { GlassDialog } from '../ReconciliationScreen.styles';
import { ReconciliationRow } from '@/interfaces/financials';

interface EftDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    selectedRow: ReconciliationRow | null;
}

const ReconciliationField: React.FC<{ label: string; value: string | number; editable?: boolean; onChange?: (val: string) => void }> = ({ label, value, editable = false, onChange }) => (
    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                border: (t) => `1px solid ${t.palette.divider}`,
                borderRadius: '4px',
                overflow: 'hidden',
                bgcolor: editable ? 'background.paper' : 'grey.100'
            }}
        >
            <Box
                sx={{
                    bgcolor: editable ? 'grey.50' : 'grey.200',
                    px: 1.5,
                    py: 1,
                    borderRight: (t) => `1px solid ${t.palette.divider}`,
                    width: '90px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', lineHeight: 1.2 }}>{label}</Typography>
            </Box>
            <Box sx={{ flex: 1, px: 1 }}>
                <TextField
                    variant="standard"
                    fullWidth
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    disabled={!editable}
                    sx={{
                        '& .MuiInput-root': {
                            fontSize: '12px',
                            fontWeight: 600,
                            '&:before': { display: 'none' },
                            '&:after': { display: 'none' },
                            '&.Mui-disabled': { color: 'text.primary', WebkitTextFillColor: (t) => t.palette.text.secondary, opacity: 0.8 }
                        }
                    }}
                />
            </Box>
        </Box>
    </Grid>
);

const EditDetailsDialog: React.FC<EftDetailsDialogProps> = ({ open, onClose, selectedRow }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperComponent={GlassDialog}>
            <DialogTitle sx={{ bgcolor: 'background.paper', p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '20px', color: 'text.primary' }}>
                    Reconciliation Details - {selectedRow?.transactionNo || '840841565'}
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2 }}>
                <Grid container spacing={1} sx={{ mb: 3 }}>
                    <ReconciliationField label="Transaction Type" value={selectedRow?.transactionType || 'EFT CRE'} />
                    <ReconciliationField label="Tax Id" value="2041495" />
                    <ReconciliationField label="Account Name" value="Metro De" />
                    <ReconciliationField label="Payor" value="PAY PLU" />
                    <ReconciliationField label="Bank Deposit" value={`$ ${selectedRow?.bankDeposit || '134.22'}`} />
                    <ReconciliationField label="Remittance" value="$ 0.00" />

                    <ReconciliationField label="AMD" value="$ 0.00" editable={true} />
                    <ReconciliationField label="Legacy" value="$ 0.00" editable={true} />
                    <ReconciliationField label="GL" value="$ 0.00" editable={true} />
                </Grid>

                <Box sx={{ display: 'flex', border: (t) => `1px solid ${t.palette.divider}`, borderRadius: '4px', overflow: 'hidden' }}>
                    <Box sx={{ flex: 1, borderRight: (t) => `1px solid ${t.palette.divider}` }}>
                        <Box sx={{ bgcolor: 'grey.50', p: 1, borderBottom: (t) => `1px solid ${t.palette.divider}`, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <HistoryIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>History</Typography>
                        </Box>
                        <Box sx={{ p: 2, height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>No Data Available</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ bgcolor: 'grey.50', p: 1, borderBottom: (t) => `1px solid ${t.palette.divider}`, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ChatBubbleOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>Comments</Typography>
                        </Box>
                        <Box sx={{ p: 1.5, flex: 1 }}>
                            <TextField
                                multiline
                                fullWidth
                                rows={4}
                                variant="outlined"
                                placeholder="Enter comments here..."
                                sx={{
                                    '& .MuiOutlinedInput-root': { borderRadius: '4px', fontSize: '13px' }
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AssignmentTurnedInIcon />}
                        sx={{
                            bgcolor: 'secondary.main',
                            padding: '6px 16px',
                            textTransform: 'none',
                            fontWeight: 800,
                            '&:hover': { bgcolor: 'secondary.dark' }
                        }}
                    >
                        Submit
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default EditDetailsDialog;