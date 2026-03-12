import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Popover,
    Button,
    Chip,
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Zoom,
    Fade,
    useMediaQuery,
    useTheme,
    Grid,
    Tooltip,
    styled,
    ButtonBase,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import {
    Drawer,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import DashboardLayout from '@/components/templates/DashboardLayout';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import { useAppSelector } from '@/store';
import { AllTransaction } from '@/types/financials';
import StatusBadge from '@/components/atoms/StatusBadge';
import { formatCurrency } from '@/utils/formatters';

const dummyData = [
    { id: '1', date: '01/25/2026', category: 'PAYMENT', type: 'Claim Payment', description: 'Claim Payment - MC10677', payer: 'HOSPICE OF THE SOUTH', amount: '$3,729.12', status: 'Posted' },
    { id: '2', date: '01/25/2026', category: 'ADJUSTMENT', type: 'Write-off', description: 'Bad debt write-off - Patient deceased', payer: 'HOSPICE OF THE SOUTH', amount: '-$1,250.00', status: 'Approved' },
    { id: '3', date: '01/25/2026', category: 'PAYMENT', type: 'EFT Payment', description: 'EFT Payment - EFT1559917', payer: 'JM MAC SCHEMES', amount: '$4,421.92', status: 'Completed' },
    { id: '4', date: '01/24/2026', category: 'PAYMENT', type: 'Claim Payment', description: 'Claim Payment - MC20451', payer: 'AETNA MEDICARE', amount: '$3,200.00', status: 'Reconciled' },
    { id: '5', date: '01/23/2026', category: 'RECOUPMENT', type: 'Recoupment', description: 'Overpayment recovery - MC20451', payer: 'AETNA MEDICARE', amount: '-$650.00', status: 'Recovered' },
];

const tableDescs = {
    date: {
        title: 'Effective Date',
        short: 'THE DATE WHEN THE TRANSACTION WAS LEGALLY RECOGNIZED IN THE SYSTEM.',
        long: 'The date when the transaction '
    },
    category: {
        title: 'Category',
        short: 'THE BROAD CLASSIFICATION OF THE FINANCIAL EVENT (E.G., PAYMENT, ADJUSTMENT).',
        long: 'The broad classification of the financial event. Categories include Payment, Recoupment, Forward Balance, and Adjustment.'
    },
    description: {
        title: 'Description',
        short: 'A DETAILED MEMO OR CLAIM IDENTIFIER ASSOCIATED WITH THIS TRASACTION.',
        long: 'A detailed memo or claim identifier associated with this transaction. This often includes claim numbers like MC10677 or EFT IDs.'
    },
    payer: {
        title: 'Source / Payer',
        short: 'THE ORIGINATING FINANCIAL ENTITY OR INSURANCE PROVIDER.',
        long: 'The originating financial entity or insurance provider responsible for the transaction, such as Aetna Medicare or JM MAC.'
    },
    amount: {
        title: 'Amount',
        short: 'THE TOTAL MONETARY VALUE OF THE TRANSACTION.',
        long: 'The total monetary value of the transaction. Negative values represent deductions like recoupments or write-offs.'
    },
    status: {
        title: 'Status',
        short: 'CURRENT RECONCILIATION STATE (POSTED, COMPLETED, RECONCILED).',
        long: 'Current reconciliation state of the transaction. Posted means it reached the ledger, Reconciled means verified against bank records.'
    }
};

const cardDescs = {
    revenue: {
        title: 'Total Amount Posted',
        value: '$9.77M',
        long: 'Total cumulative amount successfully posted to the ledger for the current period.'
    },
    reconRate: {
        title: 'Reconciliation Rate',
        value: '99.54%',
        long: 'The percentage of processed checks that have been successfully matched with bank deposits.'
    },
    avgDays: {
        title: 'Avg. Days to Reconcile',
        value: '5.39',
        long: 'The average duration in days from payment receipt to final ledger reconciliation.'
    }
};

const StatusChip = ({ status }: { status: string }) => {
    const success = ['Posted', 'Completed', 'Reconciled', 'Approved', 'Recovered'];
    const warning = ['Pending', 'Needs Review', 'Under Review'];
    const error = ['Overdue', 'Disputed', 'Needs Attention'];

    const color = success.includes(status) ? 'success' : warning.includes(status) ? 'warning' : 'error';
    return <Chip label={status} color={color} variant="outlined" size="small" sx={{ borderRadius: 1, px: 1, fontSize: '0.7rem', fontWeight: 600 }} />;
};

export default function PocScreen() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const patterns = [
        { id: 'pattern1', label: 'Pattern 1 — Standard Tooltip' },
        { id: 'pattern2', label: 'Pattern 2 — Styled Modern Tooltip' },
        { id: 'pattern3', label: 'Pattern 3 — Popover on Click' },
        // { id: 'pattern4', label: 'Pattern 4 — Expandable Row' },
        { id: 'pattern5', label: 'Pattern 5 — Side Drawer Dictionary' },
        { id: 'pattern6', label: 'Pattern 6 — Glassmorphism Floating Card' },
        // { id: 'pattern7', label: 'Pattern 7 — Animated Underline Reveal' },
        // { id: 'pattern8', label: 'Pattern 8 — Accordion Reveal' },
        { id: 'pattern9', label: 'Pattern 9 — Floating Badge + Zoom' },
        // { id: 'pattern10', label: 'Pattern 10 — Gradient Pill Tags' },
    ];

    const [selectedPattern, setSelectedPattern] = useState(patterns[0].id);

    const renderContent = () => {
        switch (selectedPattern) {
            case 'pattern1': return <Pattern1 />;
            case 'pattern2': return <Pattern2 />;
            case 'pattern3': return <Pattern3 />;
            // case 'pattern4': return <Pattern4 />;
            case 'pattern5': return <Pattern5 />;
            case 'pattern6': return <Pattern6 />;
            // case 'pattern7': return <Pattern7 />;
            // case 'pattern8': return <Pattern8 />;
            case 'pattern9': return <Pattern9 />;
            // case 'pattern10': return <Pattern10 />;
            default: return null;
        }
    };

    return (
        <DashboardLayout>
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%', minHeight: 'calc(100vh - 64px)' }}>
                <Box sx={{ width: isMobile ? '100%' : 280, borderRight: 1, borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0 }}>
                    <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>Selected Patterns POC</Typography>
                    <List component="nav" disablePadding>
                        {patterns.map((pattern) => (
                            <ListItem key={pattern.id} disablePadding>
                                <ListItemButton selected={selectedPattern === pattern.id} onClick={() => setSelectedPattern(pattern.id)}>
                                    <ListItemText primary={pattern.label} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box sx={{ flexGrow: 1, p: 4, bgcolor: '#f8fafc', overflow: 'auto' }}>
                    {renderContent()}
                </Box>
            </Box>
        </DashboardLayout>
    );
}

// ============================================================================
// PATTERN 4: Expandable Description Row
// ============================================================================
const Pattern4 = () => {
    const [open, setOpen] = useState(true);
    const allTransactions = useAppSelector((s) => s.financials.allTransactions);

    const columns: Array<DataColumn<AllTransaction>> = [
        { id: 'effectiveDate', label: 'DATE', accessor: (r) => r.effectiveDate, render: (r) => r.effectiveDate, minWidth: 120 },
        { id: 'transactionType', label: 'CATEGORY', accessor: (r) => r.transactionType, render: (r) => r.transactionType, minWidth: 140 },
        { id: 'description', label: 'DESCRIPTION', accessor: (r) => r.description, render: (r) => r.description, minWidth: 200 },
        { id: 'sourceProvider', label: 'PAYER', accessor: (r) => r.sourceProvider, render: (r) => r.sourceProvider, minWidth: 180 },
        { id: 'amount', label: 'AMOUNT', accessor: (r) => r.amount, render: (r) => formatCurrency(r.amount), minWidth: 120, align: 'right' },
        { id: 'status', label: 'STATUS', accessor: (r) => r.status, render: (r) => <StatusBadge status={r.status} />, minWidth: 120 },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>Pattern 4 — Expandable Description Row</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>A toggle reveals a description banner row below headers. Dismissible reference.</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: -2, zIndex: 1 }}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setOpen(!open)}
                    endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{ color: '#475569', borderColor: '#cbd5e1', textTransform: 'none', bgcolor: 'white', px: 2, borderRadius: 2 }}
                >
                    {open ? 'Hide descriptions' : 'Show descriptions'}
                </Button>
            </Box>

            <Collapse in={open}>
                <Box sx={{ display: 'flex', bgcolor: '#f1f5f9', border: '1px solid #e2e8f0', p: 2, borderRadius: 2, mb: 1 }}>
                    {[tableDescs.date.short, tableDescs.category.short, tableDescs.description.short, tableDescs.payer.short, tableDescs.amount.short, tableDescs.status.short].map((desc, idx) => (
                        <Box key={idx} sx={{ flex: 1, px: 2, borderRight: idx < 5 ? '1px solid #cbd5e1' : 'none' }}>
                            <Typography sx={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.02em' }}>
                                {desc}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Collapse>

            <DataTable columns={columns} data={allTransactions} rowKey={(r) => r.id} />

            <Box sx={{ display: 'flex', gap: 2 }}>
                {[cardDescs.revenue, cardDescs.reconRate, cardDescs.avgDays].map((card, idx) => (
                    <Paper key={idx} education={0} sx={{ flex: 1, p: 2, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>{card.title.toUpperCase()}</Typography>
                            <ExpandMoreIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                        </Box>
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', mb: idx === 0 ? 2 : 0 }}>{card.value}</Typography>
                        {idx === 0 && (
                            <Box sx={{ display: 'flex', p: 1.5, bgcolor: '#f1f5f9', borderRadius: 1, alignItems: 'center', gap: 1 }}>
                                <LightbulbOutlinedIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                <Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>{card.long}</Typography>
                            </Box>
                        )}
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

// ============================================================================
// PATTERN 3: Popover on Click
// ============================================================================
const Pattern3 = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [popoverData, setPopoverData] = useState({ title: '', desc: '' });
    const allTransactions = useAppSelector((s) => s.financials.allTransactions);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>, title: string, desc: string) => {
        setAnchorEl(event.currentTarget);
        setPopoverData({ title, desc });
    };

    const handleClose = () => setAnchorEl(null);

    const columns: Array<DataColumn<AllTransaction>> = [
        { id: 'effectiveDate', label: <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>DATE <IconButton size="small" onClick={(e) => handleClick(e as any, 'Effective Date', tableDescs.date.long)} sx={{ p: 0 }}><HelpOutlineIcon sx={{ fontSize: 14, color: '#94a3b8' }} /></IconButton></Box>, accessor: (r) => r.effectiveDate, render: (r) => r.effectiveDate, minWidth: 120 },
        { id: 'transactionType', label: <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>CATEGORY <IconButton size="small" onClick={(e) => handleClick(e as any, 'Category', tableDescs.category.long)} sx={{ p: 0 }}><HelpOutlineIcon sx={{ fontSize: 14, color: '#94a3b8' }} /></IconButton></Box>, accessor: (r) => r.transactionType, render: (r) => r.transactionType, minWidth: 140 },
        { id: 'description', label: <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>DESCRIPTION <IconButton size="small" onClick={(e) => handleClick(e as any, 'Description', tableDescs.description.long)} sx={{ p: 0 }}><HelpOutlineIcon sx={{ fontSize: 14, color: '#94a3b8' }} /></IconButton></Box>, accessor: (r) => r.description, render: (r) => r.description, minWidth: 200 },
        { id: 'sourceProvider', label: <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>PAYER <IconButton size="small" onClick={(e) => handleClick(e as any, 'Source / Payer', tableDescs.payer.long)} sx={{ p: 0 }}><HelpOutlineIcon sx={{ fontSize: 14, color: '#94a3b8' }} /></IconButton></Box>, accessor: (r) => r.sourceProvider, render: (r) => r.sourceProvider, minWidth: 180 },
        { id: 'amount', label: <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>AMOUNT <IconButton size="small" onClick={(e) => handleClick(e as any, 'Amount', tableDescs.amount.long)} sx={{ p: 0 }}><HelpOutlineIcon sx={{ fontSize: 14, color: '#94a3b8' }} /></IconButton></Box>, accessor: (r) => r.amount, render: (r) => formatCurrency(r.amount), minWidth: 120, align: 'right' },
        { id: 'status', label: <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>STATUS <IconButton size="small" onClick={(e) => handleClick(e as any, 'Status', tableDescs.status.long)} sx={{ p: 0 }}><HelpOutlineIcon sx={{ fontSize: 14, color: '#94a3b8' }} /></IconButton></Box>, accessor: (r) => r.status, render: (r) => <StatusBadge status={r.status} />, minWidth: 120 },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>Pattern 3 — Popover on Click</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>Click the ? icon for a rich popover. Best for medium/long descriptions.</Typography>
            </Box>

            <DataTable columns={columns} data={allTransactions} rowKey={(r) => r.id} />

            <Box sx={{ display: 'flex', gap: 2 }}>
                {[cardDescs.revenue, cardDescs.reconRate, cardDescs.avgDays].map((card, idx) => (
                    <Paper key={idx} elevation={0} sx={{ flex: 1, p: 2, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Box>
                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', mb: 0.5 }}>{card.title.toUpperCase()}</Typography>
                                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{card.value}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <IconButton size="small" onClick={(e) => handleClick(e as any, card.title, card.long)} sx={{ p: 0.5, bgcolor: '#f1f5f9' }}>
                                    <HelpOutlineIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                                </IconButton>
                            </Box>
                        </Box>
                    </Paper>
                ))}
            </Box>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                    elevation: 4,
                    sx: { p: 0, mt: 1, borderRadius: 3, maxWidth: 320, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }
                }}
            >
                <Box sx={{ p: 2, px: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LightbulbOutlinedIcon sx={{ color: '#f97316', fontSize: 18 }} />
                        <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>{popoverData.title}</Typography>
                    </Box>
                    <Typography sx={{ color: '#64748b', fontSize: '0.75rem', lineHeight: 1.6 }}>{popoverData.desc}</Typography>
                </Box>
            </Popover>
        </Box>
    );
};

// ============================================================================
// PATTERN 6: Glassmorphism Floating Card
// ============================================================================
const Pattern6 = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [popoverData, setPopoverData] = useState({ title: '', desc: '' });

    const handleClick = (event: React.MouseEvent<HTMLElement>, title: string, desc: string) => {
        setAnchorEl(event.currentTarget);
        setPopoverData({ title, desc });
    };

    const handleClose = () => setAnchorEl(null);

    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
    };

    const cardColors = ['#f0f9ff', '#f0fdf4', '#fff1f2'];
    const textColors = ['#0369a1', '#166534', '#9f1239'];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>Pattern 6 — Glassmorphism Floating Card</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>Click any header to reveal a frosted-glass floating card with description. Modern, visually rich, dismissible with "Got it".</Typography>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'visible' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            {[tableDescs.date, tableDescs.category, tableDescs.description, tableDescs.payer, tableDescs.amount, tableDescs.status].map((col, idx) => (
                                <TableCell key={idx} sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem', py: 2 }}>
                                    <Box
                                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { color: '#3b82f6' } }}
                                        onClick={(e) => handleClick(e, col.title, col.long)}
                                    >
                                        {col.title.toUpperCase()}
                                        <AutoAwesomeIcon sx={{ fontSize: 12, color: '#94a3b8' }} />
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dummyData.map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell sx={{ color: '#334155', fontSize: '0.75rem' }}>{row.date}</TableCell>
                                <TableCell sx={{ color: '#334155', fontSize: '0.75rem', fontWeight: 600 }}>{row.category}</TableCell>
                                <TableCell sx={{ color: '#334155', fontSize: '0.75rem' }}>{row.description}</TableCell>
                                <TableCell sx={{ color: '#334155', fontSize: '0.75rem' }}>{row.payer}</TableCell>
                                <TableCell sx={{ color: '#334155', fontSize: '0.75rem', fontWeight: 500 }}>{row.amount}</TableCell>
                                <TableCell><StatusChip status={row.status} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', gap: 2 }}>
                {[cardDescs.revenue, cardDescs.reconRate, cardDescs.avgDays].map((card, idx) => (
                    <Paper
                        key={idx}
                        elevation={0}
                        sx={{ flex: 1, p: 2, border: '1px solid', borderColor: cardColors[idx].replace('f', 'e'), borderRadius: 2, bgcolor: cardColors[idx] }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, cursor: 'pointer' }} onClick={(e) => handleClick(e, card.title, card.long)}>
                            <AutoAwesomeIcon sx={{ fontSize: 14, color: textColors[idx] }} />
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: textColors[idx], letterSpacing: '0.05em' }}>{card.title.toUpperCase()}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', mb: 1 }}>{card.value}</Typography>
                        {idx !== 1 && <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>{idx === 0 ? 'Total billed amount.' : card.long.substring(0, 70) + '...'}</Typography>}
                        {idx === 1 && <Typography sx={{ fontSize: '0.7rem', color: '#64748b' }}>{card.long.substring(0, 90) + '...'}</Typography>}
                    </Paper>
                ))}
            </Box>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                TransitionComponent={Fade}
                PaperProps={{
                    sx: { ...glassStyle, mt: 1, p: 2.5, borderRadius: 4, maxWidth: 300 }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Box sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', p: 0.5, borderRadius: '50%', display: 'flex' }}>
                        <AutoAwesomeIcon sx={{ color: '#3b82f6', fontSize: 16 }} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: '#1d4ed8', fontSize: '0.8rem', letterSpacing: '0.05em' }}>{popoverData.title.toUpperCase()}</Typography>
                </Box>
                <Typography sx={{ color: '#475569', fontSize: '0.75rem', lineHeight: 1.6, fontWeight: 500, letterSpacing: '0.02em', mb: 2 }}>{popoverData.desc.toUpperCase()}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button size="small" variant="text" sx={{ color: '#3b82f6', fontWeight: 600, fontSize: '0.75rem' }} onClick={handleClose}>GOT IT</Button>
                </Box>
            </Popover>
        </Box>
    );
};

// ============================================================================
// PATTERN 9: Floating Badge + Zoom Popover
// ============================================================================
const Pattern9 = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [popoverData, setPopoverData] = useState({ title: '', desc: '' });

    const handleClick = (event: React.MouseEvent<HTMLElement>, title: string, desc: string) => {
        setAnchorEl(event.currentTarget);
        setPopoverData({ title, desc });
    };

    const badgeColors = ['#bfdbfe', '#bbf7d0', '#fecaca', '#bfdbfe']; // Light blue, green, red, blue

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>Pattern 9 — Floating Badge + Zoom Popover</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>A small circular badge next to each header. Clicking it opens a popover with a colored header bar and zoom animation.</Typography>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            {[tableDescs.date, tableDescs.category, tableDescs.description, tableDescs.payer, tableDescs.amount, tableDescs.status].map((col, idx) => (
                                <TableCell key={idx} sx={{ py: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                        <Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '0.75rem', letterSpacing: '0.05em' }}>{col.title.toUpperCase()}</Typography>
                                        <Box
                                            sx={{
                                                width: 18, height: 18, borderRadius: '50%', bgcolor: badgeColors[idx],
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                '&:hover': { filter: 'brightness(0.9)' }
                                            }}
                                            onClick={(e) => handleClick(e, col.title, col.long)}
                                        >
                                            <Typography sx={{ fontSize: '0.6rem', color: '#1e293b', fontWeight: 600 }}>?</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dummyData.map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell sx={{ color: '#334155', fontSize: '0.75rem' }}>{row.date}</TableCell>
                                <TableCell sx={{ color: '#334155', fontSize: '0.75rem', fontWeight: 600 }}>{row.category}</TableCell>
                                <TableCell sx={{ color: '#334155', fontSize: '0.75rem' }}>{row.description}</TableCell>
                                <TableCell sx={{ color: '#334155', fontSize: '0.75rem' }}>{row.payer}</TableCell>
                                <TableCell sx={{ color: '#334155', fontSize: '0.75rem', fontWeight: 500 }}>{row.amount}</TableCell>
                                <TableCell><StatusChip status={row.status} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                {[cardDescs.revenue, cardDescs.reconRate, cardDescs.avgDays].map((card, idx) => (
                    <Paper key={idx} elevation={0} sx={{ flex: 1, p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2, position: 'relative' }}>
                        <Box
                            sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: badgeColors[idx % 4], display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', top: 12, right: 12 }}
                            onClick={(e) => handleClick(e, card.title, card.long)}
                        >
                            <Typography sx={{ fontSize: '0.7rem', color: '#1e293b', fontWeight: 700 }}>?</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em', mb: 1 }}>{card.title.toUpperCase()}</Typography>
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{card.value}</Typography>
                    </Paper>
                ))}
            </Box>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                TransitionComponent={Zoom}
                PaperProps={{
                    elevation: 8,
                    sx: { mt: 1.5, borderRadius: 2, maxWidth: 320, overflow: 'hidden', border: '1px solid #e2e8f0' }
                }}
            >
                <Box sx={{ bgcolor: '#4f81bd', px: 2, py: 1.5 }}>
                    <Typography sx={{ fontWeight: 600, color: 'white', fontSize: '0.875rem' }}>{popoverData.title}</Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                    <Typography sx={{ color: '#64748b', fontSize: '0.75rem', lineHeight: 1.6 }}>{popoverData.desc}</Typography>
                </Box>
            </Popover>
        </Box>
    );
};

// ============================================================================
// PATTERN 10: Gradient Pill Tags
// ============================================================================
const Pattern10 = () => {
    const [openCol, setOpenCol] = useState<string | null>(null);

    const toggleCol = (title: string) => {
        setOpenCol(openCol === title ? null : title);
    };

    const pillGradients = [
        'linear-gradient(90deg, #60a5fa, #818cf8)',
        'linear-gradient(90deg, #34d399, #10b981)',
        'linear-gradient(90deg, #fb923c, #f87171)',
        'linear-gradient(90deg, #64748b, #94a3b8)',
        'linear-gradient(90deg, #60a5fa, #818cf8)',
        'linear-gradient(90deg, #34d399, #10b981)',
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>Pattern 10 — Gradient Pill Tags</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>A small gradient pill next to each header with "INFO" label. Click to toggle the description inline. Eye-catching and compact.</Typography>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            {[tableDescs.date, tableDescs.category, tableDescs.description, tableDescs.payer, tableDescs.amount, tableDescs.status].map((col, idx) => (
                                <TableCell key={idx} sx={{ py: 2, verticalAlign: 'top', width: '16.6%' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '0.75rem', letterSpacing: '0.05em' }}>{col.title.toUpperCase()}</Typography>
                                        <Chip
                                            label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><HelpOutlineIcon sx={{ fontSize: 10 }} /> INFO</Box>}
                                            onClick={() => toggleCol(col.title)}
                                            sx={{
                                                height: 18, fontSize: '0.55rem', fontWeight: 700, background: pillGradients[idx], color: 'white',
                                                border: 'none', cursor: 'pointer', '& .MuiChip-label': { px: 1 }
                                            }}
                                        />
                                    </Box>
                                    <Collapse in={openCol === col.title}>
                                        <Box sx={{ mt: 2, mb: 1, p: 1.5, bgcolor: '#f1f5f9', borderRadius: 2 }}>
                                            <Typography sx={{ fontSize: '0.65rem', color: '#64748b', lineHeight: 1.6, letterSpacing: '0.02em' }}>
                                                {col.long.toUpperCase()}
                                            </Typography>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dummyData.map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell sx={{ color: '#334155', fontSize: '0.75rem' }}>{row.date}</TableCell>
                                <TableCell sx={{ color: '#334155', fontSize: '0.75rem', fontWeight: 600 }}>{row.category}</TableCell>
                                <TableCell sx={{ color: '#334155', fontSize: '0.75rem' }}>{row.description}</TableCell>
                                <TableCell sx={{ color: '#334155', fontSize: '0.75rem' }}>{row.payer}</TableCell>
                                <TableCell sx={{ color: '#334155', fontSize: '0.75rem', fontWeight: 500 }}>{row.amount}</TableCell>
                                <TableCell><StatusChip status={row.status} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                {[cardDescs.revenue, cardDescs.reconRate, cardDescs.avgDays].map((card, idx) => (
                    <Paper key={idx} elevation={0} sx={{ flex: 1, p: 2, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>{card.title.toUpperCase()}</Typography>
                            <Chip
                                label="INFO"
                                onClick={() => toggleCol(card.title)}
                                sx={{ height: 16, fontSize: '0.55rem', fontWeight: 700, background: pillGradients[idx], color: 'white', border: 'none' }}
                            />
                        </Box>
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{card.value}</Typography>
                        <Collapse in={openCol === card.title}>
                            <Typography sx={{ mt: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 1, fontSize: '0.7rem', color: '#64748b', lineHeight: 1.6 }}>
                                {card.long}
                            </Typography>
                        </Collapse>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

// ============================================================================
// PATTERN 1: Standard Tooltip
// ============================================================================
const Pattern1 = () => {
    const allTransactions = useAppSelector((s) => s.financials.allTransactions);

    const columns: Array<DataColumn<AllTransaction>> = [
        { id: 'effectiveDate', label: <Tooltip title={tableDescs.date.long} arrow placement="top"><Box sx={{ cursor: 'help', borderBottom: '1px dotted #cbd5e1' }}>DATE</Box></Tooltip>, accessor: (r) => r.effectiveDate, render: (r) => r.effectiveDate, minWidth: 120 },
        { id: 'transactionType', label: <Tooltip title={tableDescs.category.long} arrow placement="top"><Box sx={{ cursor: 'help', borderBottom: '1px dotted #cbd5e1' }}>CATEGORY</Box></Tooltip>, accessor: (r) => r.transactionType, render: (r) => r.transactionType, minWidth: 140 },
        { id: 'description', label: <Tooltip title={tableDescs.description.long} arrow placement="top"><Box sx={{ cursor: 'help', borderBottom: '1px dotted #cbd5e1' }}>DESCRIPTION</Box></Tooltip>, accessor: (r) => r.description, render: (r) => r.description, minWidth: 200 },
        { id: 'sourceProvider', label: <Tooltip title={tableDescs.payer.long} arrow placement="top"><Box sx={{ cursor: 'help', borderBottom: '1px dotted #cbd5e1' }}>PAYER</Box></Tooltip>, accessor: (r) => r.sourceProvider, render: (r) => r.sourceProvider, minWidth: 180 },
        { id: 'amount', label: <Tooltip title={tableDescs.amount.long} arrow placement="top"><Box sx={{ cursor: 'help', borderBottom: '1px dotted #cbd5e1' }}>AMOUNT</Box></Tooltip>, accessor: (r) => r.amount, render: (r) => formatCurrency(r.amount), minWidth: 120, align: 'right' },
        { id: 'status', label: <Tooltip title={tableDescs.status.long} arrow placement="top"><Box sx={{ cursor: 'help', borderBottom: '1px dotted #cbd5e1' }}>STATUS</Box></Tooltip>, accessor: (r) => r.status, render: (r) => <StatusBadge status={r.status} />, minWidth: 120 },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>Pattern 1 — Standard Tooltip</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>Hover over column headers or titles to see the description in a tooltip.</Typography>
            </Box>

            <DataTable columns={columns} data={allTransactions} rowKey={(r) => r.id} />

            <Box sx={{ display: 'flex', gap: 2 }}>
                {[cardDescs.revenue, cardDescs.reconRate, cardDescs.avgDays].map((card, idx) => (
                    <Paper key={idx} education={0} sx={{ flex: 1, p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                        <Tooltip title={card.long} arrow placement="top">
                            <Box sx={{ display: 'inline-block', mb: 1, cursor: 'help', borderBottom: '1px dotted #cbd5e1' }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>{card.title.toUpperCase()}</Typography>
                            </Box>
                        </Tooltip>
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{card.value}</Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

// ============================================================================
// PATTERN 7: Animated Underline Reveal
// ============================================================================
const AnimatedUnderlineLabel = ({ title, description }: { title: string, description: string }) => (
    <Box sx={{
        position: 'relative',
        display: 'inline-block',
        '&:hover .desc': { opacity: 1, maxHeight: 200, mt: 1, maxWidth: 400 },
        '& .title': {
            position: 'relative', display: 'inline-block', fontWeight: 600, cursor: 'pointer',
            '&::after': {
                content: '""', position: 'absolute', width: '100%', transform: 'scaleX(0)', height: '2px', bottom: -2, left: 0,
                backgroundColor: 'primary.main', transformOrigin: 'bottom right', transition: 'transform 0.3s ease-out'
            }
        },
        '&:hover .title::after': { transform: 'scaleX(1)', transformOrigin: 'top left', maxWidth: 400 }
    }}>
        <Typography variant="subtitle1" className="title" sx={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569' }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" className="desc" sx={{ opacity: 0, maxHeight: 0, overflow: 'hidden', transition: 'all 0.4s ease', maxWidth: 250, fontSize: '0.75rem', textAlign: 'left' }}>
            {description}
        </Typography>
    </Box>
);

const Pattern7 = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>Pattern 7 — Animated Underline Reveal</Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>Hover title to expand underline and reveal the description smoothly below.</Typography>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2, minHeight: 180 }}>
            <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                        {[tableDescs.date, tableDescs.category, tableDescs.description, tableDescs.payer, tableDescs.amount, tableDescs.status].map((col, idx) => (
                            <TableCell key={idx} sx={{ verticalAlign: 'top', py: 2 }}>
                                <AnimatedUnderlineLabel title={col.title} description={col.long} />
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dummyData.map((row, idx) => (
                        <TableRow key={idx}>
                            <TableCell sx={{ color: '#334155', fontSize: '0.75rem' }}>{row.date}</TableCell>
                            <TableCell sx={{ color: '#334155', fontSize: '0.75rem', fontWeight: 600 }}>{row.category}</TableCell>
                            <TableCell sx={{ color: '#334155', fontSize: '0.75rem' }}>{row.description}</TableCell>
                            <TableCell sx={{ color: '#334155', fontSize: '0.75rem' }}>{row.payer}</TableCell>
                            <TableCell sx={{ color: '#334155', fontSize: '0.75rem', fontWeight: 500 }}>{row.amount}</TableCell>
                            <TableCell><StatusChip status={row.status} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', gap: 2 }}>
            {[cardDescs.revenue, cardDescs.reconRate, cardDescs.avgDays].map((card, idx) => (
                <Paper key={idx} elevation={0} sx={{ flex: 1, p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2, minHeight: 120 }}>
                    <AnimatedUnderlineLabel title={card.title} description={card.long} />
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', mt: 1 }}>{card.value}</Typography>
                </Paper>
            ))}
        </Box>
    </Box>
);

// ============================================================================
// PATTERN 2: Styled Modern Tooltip
// ============================================================================
const ModernTooltip = styled(({ className, ...props }: any) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .MuiTooltip-tooltip`]: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        color: '#1e293b',
        maxWidth: 320,
        fontSize: '0.8rem',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    [`& .MuiTooltip-arrow`]: {
        color: '#e2e8f0',
    },
}));

const ModernTooltipContent = ({ title, desc, icon, onClose }: { title: string, desc: string, icon?: React.ReactNode, onClose?: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLong = desc.length > 80;

    return (
        <Box sx={{ pointerEvents: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {icon || <LightbulbOutlinedIcon sx={{ color: '#3b82f6', fontSize: 18 }} />}
                <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', color: '#1e293b', letterSpacing: '0.02em' }}>{title}</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.6 }}>
                {isExpanded || !isLong ? desc : `${desc.substring(0, 80)}...`}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                {isLong && !isExpanded && (
                    <Button
                        size="small"
                        variant="text"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(true);
                        }}
                        sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#3b82f6', minWidth: 0, p: 0, '&:hover': { background: 'transparent', textDecoration: 'underline' } }}
                    >
                        LEARN MORE
                    </Button>
                )}
                {(isExpanded || !isLong) && (
                    <Button
                        size="small"
                        variant="text"
                        onClick={onClose}
                        sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#3b82f6', minWidth: 0, p: 0, '&:hover': { background: 'transparent' } }}
                    >
                        GOT IT
                    </Button>
                )}
            </Box>
        </Box>
    );
};

const InteractiveModernTooltip = ({ title, desc, icon, children, placement = "top" as any }: any) => {
    const [open, setOpen] = useState(false);
    return (
        <ModernTooltip
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            title={<ModernTooltipContent title={title} desc={desc} icon={icon} onClose={() => setOpen(false)} />}
            arrow
            interactive
            placement={placement}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 400 }}
        >
            {children}
        </ModernTooltip>
    );
};

const Pattern2 = () => {
    const allTransactions = useAppSelector((s) => s.financials.allTransactions);

    const getHeader = (title: string, desc: string) => (
        <InteractiveModernTooltip title={title} desc={desc}>
            <Box component="span" sx={{
                fontWeight: 600, color: '#3b82f6', fontSize: '0.75rem',
                letterSpacing: '0.05em', cursor: 'help', pb: 0.5,
                borderBottom: '2px solid rgba(59, 130, 246, 0.2)',
                '&:hover': { borderBottomColor: '#3b82f6', color: '#1d4ed8' },
                transition: 'all 0.2s'
            }}>
                {title.toUpperCase()}
            </Box>
        </InteractiveModernTooltip>
    );

    const columns: Array<DataColumn<AllTransaction>> = [
        { id: 'effectiveDate', label: getHeader('Date', tableDescs.date.long), accessor: (r) => r.effectiveDate, render: (r) => r.effectiveDate, minWidth: 120 },
        { id: 'transactionType', label: getHeader('Category', tableDescs.category.long), accessor: (r) => r.transactionType, render: (r) => r.transactionType, minWidth: 140 },
        { id: 'description', label: getHeader('Description', tableDescs.description.long), accessor: (r) => r.description, render: (r) => r.description, minWidth: 200 },
        { id: 'sourceProvider', label: getHeader('Source / Payer', tableDescs.payer.long), accessor: (r) => r.sourceProvider, render: (r) => r.sourceProvider, minWidth: 180 },
        { id: 'amount', label: getHeader('Amount', tableDescs.amount.long), accessor: (r) => r.amount, render: (r) => formatCurrency(r.amount), minWidth: 120, align: 'right' },
        { id: 'status', label: getHeader('Status', tableDescs.status.long), accessor: (r) => r.status, render: (r) => <StatusBadge status={r.status} />, minWidth: 120 },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>Pattern 2 — Styled Modern Tooltip</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>A premium version of the tooltip with glassmorphism, soft shadows, and a clean white aesthetic. Perfect for modern layouts.</Typography>
            </Box>

            <DataTable columns={columns} data={allTransactions} rowKey={(r) => r.id} />

            <Box sx={{ display: 'flex', gap: 2 }}>
                {[cardDescs.revenue, cardDescs.reconRate, cardDescs.avgDays].map((card, idx) => (
                    <Paper key={idx} education={0} sx={{ flex: 1, p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2, transition: 'all 0.3s', '&:hover': { boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' } }}>
                        <InteractiveModernTooltip title={card.title} desc={card.long} icon={<InfoOutlinedIcon sx={{ color: '#3b82f6', fontSize: 18 }} />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, cursor: 'help', width: 'fit-content' }}>
                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>{card.title.toUpperCase()}</Typography>
                                <HelpOutlineIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                            </Box>
                        </InteractiveModernTooltip>
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{card.value}</Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

const Pattern5 = () => {
    const [open, setOpen] = useState(false);
    const [selectedField, setSelectedField] = useState({ title: '', desc: '' });
    const allTransactions = useAppSelector((s) => s.financials.allTransactions);

    const handleOpen = (title: string, desc: string) => {
        setSelectedField({ title, desc });
        setOpen(true);
    };

    const columns: Array<DataColumn<AllTransaction>> = [
        { id: 'effectiveDate', label: <ButtonBase onClick={() => handleOpen('Effective Date', tableDescs.date.long)} sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem' }}>EFFECTIVE DATE <MenuBookIcon sx={{ ml: 0.5, fontSize: 12 }} /></ButtonBase>, accessor: (r) => r.effectiveDate, render: (r) => r.effectiveDate, minWidth: 120 },
        { id: 'transactionType', label: <ButtonBase onClick={() => handleOpen('Category', tableDescs.category.long)} sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem' }}>CATEGORY <MenuBookIcon sx={{ ml: 0.5, fontSize: 12 }} /></ButtonBase>, accessor: (r) => r.transactionType, render: (r) => r.transactionType, minWidth: 140 },
        { id: 'description', label: <ButtonBase onClick={() => handleOpen('Description', tableDescs.description.long)} sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem' }}>DESCRIPTION <MenuBookIcon sx={{ ml: 0.5, fontSize: 12 }} /></ButtonBase>, accessor: (r) => r.description, render: (r) => r.description, minWidth: 200 },
        { id: 'sourceProvider', label: <ButtonBase onClick={() => handleOpen('Source / Payer', tableDescs.payer.long)} sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem' }}>PAYER <MenuBookIcon sx={{ ml: 0.5, fontSize: 12 }} /></ButtonBase>, accessor: (r) => r.sourceProvider, render: (r) => r.sourceProvider, minWidth: 180 },
        { id: 'amount', label: <ButtonBase onClick={() => handleOpen('Amount', tableDescs.amount.long)} sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem' }}>AMOUNT <MenuBookIcon sx={{ ml: 0.5, fontSize: 12 }} /></ButtonBase>, accessor: (r) => r.amount, render: (r) => formatCurrency(r.amount), minWidth: 120, align: 'right' },
        { id: 'status', label: <ButtonBase onClick={() => handleOpen('Status', tableDescs.status.long)} sx={{ fontWeight: 600, color: '#64748b', fontSize: '0.75rem' }}>STATUS <MenuBookIcon sx={{ ml: 0.5, fontSize: 12 }} /></ButtonBase>, accessor: (r) => r.status, render: (r) => <StatusBadge status={r.status} />, minWidth: 120 },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>Pattern 5 — Side Drawer Data Dictionary</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>Click column headers to open a side drawer with a full data dictionary entry. Best for very long technical explanations.</Typography>
            </Box>

            <DataTable columns={columns} data={allTransactions} rowKey={(r) => r.id} />

            <Box sx={{ display: 'flex', gap: 2 }}>
                {[cardDescs.revenue, cardDescs.reconRate, cardDescs.avgDays].map((card, idx) => (
                    <Paper key={idx} elevation={0} sx={{ flex: 1, p: 2.5, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', letterSpacing: '0.05em' }}>{card.title.toUpperCase()}</Typography>
                            <IconButton size="small" onClick={() => handleOpen(card.title, card.long)}>
                                <MoreHorizIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                        </Box>
                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{card.value}</Typography>
                    </Paper>
                ))}
            </Box>

            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: 350, p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Field Dictionary</Typography>
                        <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
                    </Box>
                    <Box sx={{ bgcolor: '#f8fafc', p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        <Typography variant="overline" sx={{ color: '#3b82f6', fontWeight: 800 }}>{selectedField.title}</Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.8 }}>
                            {selectedField.desc}
                        </Typography>
                        <Box sx={{ mt: 3, p: 2, bgcolor: '#eff6ff', borderRadius: 2 }}>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#1d4ed8' }}>Usage Tip:</Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: '#3b82f6' }}>This field is critical for monthly closing reports.</Typography>
                        </Box>
                    </Box>
                </Box>
            </Drawer>
        </Box>
    );
};

const Pattern8 = () => {
    const allTransactions = useAppSelector((s) => s.financials.allTransactions);

    const columns: Array<DataColumn<AllTransaction>> = [
        { id: 'effectiveDate', label: <Accordion sx={{ boxShadow: 'none', width: '100%', bgcolor: 'transparent' }}><AccordionSummary sx={{ p: 0, minHeight: 0, '& .MuiAccordionSummary-content': { m: 0 } }} expandIcon={<ExpandMoreIcon sx={{ fontSize: 12 }} />}><Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>DATE</Typography></AccordionSummary><AccordionDetails sx={{ p: 1, bgcolor: '#f1f5f9' }}><Typography sx={{ fontSize: '0.6rem' }}>{tableDescs.date.long}</Typography></AccordionDetails></Accordion>, accessor: (r) => r.effectiveDate, render: (r) => r.effectiveDate, minWidth: 120 },
        { id: 'transactionType', label: <Accordion sx={{ boxShadow: 'none', width: '100%', bgcolor: 'transparent' }}><AccordionSummary sx={{ p: 0, minHeight: 0, '& .MuiAccordionSummary-content': { m: 0 } }} expandIcon={<ExpandMoreIcon sx={{ fontSize: 12 }} />}><Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>CATEGORY</Typography></AccordionSummary><AccordionDetails sx={{ p: 1, bgcolor: '#f1f5f9' }}><Typography sx={{ fontSize: '0.6rem' }}>{tableDescs.category.long}</Typography></AccordionDetails></Accordion>, accessor: (r) => r.transactionType, render: (r) => r.transactionType, minWidth: 140 },
        { id: 'description', label: <Accordion sx={{ boxShadow: 'none', width: '100%', bgcolor: 'transparent' }}><AccordionSummary sx={{ p: 0, minHeight: 0, '& .MuiAccordionSummary-content': { m: 0 } }} expandIcon={<ExpandMoreIcon sx={{ fontSize: 12 }} />}><Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>DESCRIPTION</Typography></AccordionSummary><AccordionDetails sx={{ p: 1, bgcolor: '#f1f5f9' }}><Typography sx={{ fontSize: '0.6rem' }}>{tableDescs.description.long}</Typography></AccordionDetails></Accordion>, accessor: (r) => r.description, render: (r) => r.description, minWidth: 200 },
        { id: 'sourceProvider', label: <Accordion sx={{ boxShadow: 'none', width: '100%', bgcolor: 'transparent' }}><AccordionSummary sx={{ p: 0, minHeight: 0, '& .MuiAccordionSummary-content': { m: 0 } }} expandIcon={<ExpandMoreIcon sx={{ fontSize: 12 }} />}><Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>PAYER</Typography></AccordionSummary><AccordionDetails sx={{ p: 1, bgcolor: '#f1f5f9' }}><Typography sx={{ fontSize: '0.6rem' }}>{tableDescs.payer.long}</Typography></AccordionDetails></Accordion>, accessor: (r) => r.sourceProvider, render: (r) => r.sourceProvider, minWidth: 180 },
        { id: 'amount', label: <Accordion sx={{ boxShadow: 'none', width: '100%', bgcolor: 'transparent' }}><AccordionSummary sx={{ p: 0, minHeight: 0, '& .MuiAccordionSummary-content': { m: 0 } }} expandIcon={<ExpandMoreIcon sx={{ fontSize: 12 }} />}><Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>AMOUNT</Typography></AccordionSummary><AccordionDetails sx={{ p: 1, bgcolor: '#f1f5f9' }}><Typography sx={{ fontSize: '0.6rem' }}>{tableDescs.amount.long}</Typography></AccordionDetails></Accordion>, accessor: (r) => r.amount, render: (r) => formatCurrency(r.amount), minWidth: 120, align: 'right' },
        { id: 'status', label: <Accordion sx={{ boxShadow: 'none', width: '100%', bgcolor: 'transparent' }}><AccordionSummary sx={{ p: 0, minHeight: 0, '& .MuiAccordionSummary-content': { m: 0 } }} expandIcon={<ExpandMoreIcon sx={{ fontSize: 12 }} />}><Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '0.75rem' }}>STATUS</Typography></AccordionSummary><AccordionDetails sx={{ p: 1, bgcolor: '#f1f5f9' }}><Typography sx={{ fontSize: '0.6rem' }}>{tableDescs.status.long}</Typography></AccordionDetails></Accordion>, accessor: (r) => r.status, render: (r) => <StatusBadge status={r.status} />, minWidth: 120 },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>Pattern 8 — Accordion Reveal</Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>Standard MUI Accordion implementation for each header. Very familiar and mobile-friendly.</Typography>
            </Box>

            <DataTable columns={columns} data={allTransactions} rowKey={(r) => r.id} />

            <Box sx={{ display: 'flex', gap: 2 }}>
                {[cardDescs.revenue, cardDescs.reconRate, cardDescs.avgDays].map((card, idx) => (
                    <Paper key={idx} elevation={0} sx={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                        <Accordion sx={{ boxShadow: 'none' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box>
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', mb: 0.5 }}>{card.title.toUpperCase()}</Typography>
                                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{card.value}</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>{card.long}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};
