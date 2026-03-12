import React, { useState } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Button,
  TextField,
  InputAdornment,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Chip,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useAppSelector } from '@/store';
import { formatCurrency } from '@/utils/formatters';
import { BankDepositItem, RemittanceAdviceItem, PostingApplicationItem } from '@/types/financials';

const KPICard = ({ title, value, subtext, subtextColor }: { title: string; value: string; subtext?: string; subtextColor?: string }) => {
  return (
    <Card sx={{ p: 2, height: '100%', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <Typography variant="caption" sx={{ color: 'rgb(100, 116, 139)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1, mb: 0.5 }}>
        {value}
      </Typography>
      {subtext && (
        <Typography variant="body2" sx={{ color: subtextColor || 'rgb(100, 116, 139)', fontWeight: 500 }}>
          {subtext}
        </Typography>
      )}
    </Card>
  );
};

const ExpandableRow = ({ item }: { item: BankDepositItem }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow 
        onClick={() => setOpen(!open)} 
        sx={{ 
          cursor: 'pointer', 
          '&:hover': { backgroundColor: 'rgba(107, 153, 196, 0.05)' },
          backgroundColor: open ? 'rgba(107, 153, 196, 0.02)' : 'inherit'
        }}
      >
        <TableCell sx={{ borderBottom: open ? 'none' : undefined }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small">
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>{item.reference}</Typography>
              <Typography variant="caption" color="text.secondary">{item.date}</Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell sx={{ borderBottom: open ? 'none' : undefined }}>
          <Typography variant="body2">{item.payerName}</Typography>
        </TableCell>
        <TableCell align="right" sx={{ borderBottom: open ? 'none' : undefined }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(item.bankAmt)}</Typography>
        </TableCell>
        <TableCell align="right" sx={{ borderBottom: open ? 'none' : undefined }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(item.remitAmt)}</Typography>
        </TableCell>
        <TableCell align="right" sx={{ borderBottom: open ? 'none' : undefined }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              color: item.variance < 0 ? theme.palette.error.main : theme.palette.text.primary 
            }}
          >
            {formatCurrency(item.variance)}
          </Typography>
        </TableCell>
        <TableCell align="right" sx={{ borderBottom: open ? 'none' : undefined }}>
          <Chip 
            label={item.status} 
            size="small" 
            icon={item.status === 'Matched' ? <CheckCircleOutlineIcon sx={{ fontSize: '14px !important' }} /> : <ErrorOutlineIcon sx={{ fontSize: '14px !important' }} />}
            sx={{ 
              backgroundColor: item.status === 'Matched' ? '#f0fdf4' : '#fef2f2', 
              color: item.status === 'Matched' ? '#166534' : '#991b1b',
              fontWeight: 600,
              fontSize: '11px',
              border: `1px solid ${item.status === 'Matched' ? '#bbf7d0' : '#fecaca'}`
            }} 
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ p: 0, borderBottom: open ? undefined : 'none' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 3, backgroundColor: '#fff', borderTop: '1px solid #e2e8f0' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
                    <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>(A) REMITTANCE ADVICE</Typography>
                    </Box>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ py: 1.5, color: 'text.secondary', fontWeight: 600, fontSize: '11px' }}>REMIT REFERENCE</TableCell>
                          <TableCell sx={{ py: 1.5, color: 'text.secondary', fontWeight: 600, fontSize: '11px' }} align="right">AMOUNT</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {item.remittanceAdvice.map((ra, idx) => (
                          <TableRow key={idx}>
                            <TableCell sx={{ py: 1.5 }}>{ra.reference}</TableCell>
                            <TableCell sx={{ py: 1.5, fontWeight: 700 }} align="right">{formatCurrency(ra.amount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
                    <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>(B) POSTING & APPLICATION</Typography>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      {item.postingApplication.map((pa, idx) => (
                        <Box key={idx} sx={{ mb: 2, p: 1.5, backgroundColor: '#f8fafc', borderRadius: 1, border: '1px solid #f1f5f9' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{pa.system}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(pa.amount)}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">{pa.date} | Ref: {pa.reference}</Typography>
                            <Chip 
                              label={pa.status} 
                              size="small" 
                              sx={{ 
                                height: 20, 
                                fontSize: '10px', 
                                fontWeight: 700,
                                backgroundColor: pa.status === 'Posted' ? '#f0fdf4' : pa.status === 'Pending' ? '#f1f5f9' : '#fff7ed',
                                color: pa.status === 'Posted' ? '#166534' : pa.status === 'Pending' ? '#475569' : '#9a3412'
                              }} 
                            />
                          </Box>
                        </Box>
                      ))}
                      <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>C-D Variance</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#166534' }}>$0.00</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const BankDepositsScreen: React.FC = () => {
  const theme = useTheme();
  const bankDeposits = useAppSelector((s) => s.financials.bankDeposits);
  const [selectedEntityId, setSelectedEntityId] = useState<'all' | string>('all');

  const entities = [
    { id: 'all', name: 'All Entities (Consolidated)' },
    { id: 'e1', name: 'Apex Primary Care' },
    { id: 'e2', name: 'Apex Surgical Center' },
    { id: 'e3', name: 'Apex Home Health' },
  ];

  return (
    <Box sx={{ px: 3, pt: 1, pb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Bank Deposit Reconciliation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Match bank deposits to remittances and track their posting status across various systems.
        </Typography>
      </Box>

      {/* Filters Row 1 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>Range:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 1, px: 1, py: 0.5 }}>
            <Typography variant="body2" sx={{ fontSize: '13px', color: 'text.primary' }}>01-02-2026</Typography>
            <CalendarMonthIcon sx={{ fontSize: 16, ml: 1, color: 'text.secondary' }} />
          </Box>
          <Typography variant="body2" color="text.secondary">to</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 1, px: 1, py: 0.5 }}>
            <Typography variant="body2" sx={{ fontSize: '13px', color: 'text.primary' }}>10-02-2026</Typography>
            <CalendarMonthIcon sx={{ fontSize: 16, ml: 1, color: 'text.secondary' }} />
          </Box>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block' }}>View Entity</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {entities.map((e) => (
              <Chip
                key={e.id}
                label={e.name}
                onClick={() => setSelectedEntityId(e.id)}
                sx={{
                  backgroundColor: selectedEntityId === e.id ? 'rgba(107, 153, 196, 0.7)' : '#f1f5f9',
                  color: selectedEntityId === e.id ? '#fff' : 'rgb(100, 116, 139)',
                  fontWeight: 600,
                  fontSize: '12px',
                  '&:hover': {
                    backgroundColor: selectedEntityId === e.id ? 'rgba(107, 153, 196, 0.8)' : '#e2e8f0',
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Filters Row 2 - Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 1, p: 1.5, gap: 2, mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search by Check#, Amount, or Payer..."
          sx={{ 
            backgroundColor: '#fff', 
            width: 320,
            '& .MuiOutlinedInput-root': {
              height: 36,
              fontSize: '13px'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControlLabel
          control={<Switch size="small" />}
          label={<Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Exceptions Only</Typography>}
          sx={{ ml: 1 }}
        />

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button 
            variant="outlined" 
            size="small" 
            sx={{ 
              backgroundColor: '#fff', 
              color: 'text.primary', 
              borderColor: 'divider', 
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Refresh Data
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(107, 153, 196, 0.7)', 
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'rgba(107, 153, 196, 0.8)',
                boxShadow: 'none',
              }
            }}
          >
            Finalize Selected
          </Button>
        </Box>
      </Box>

      {/* KPI Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <KPICard 
            title="Total Collections" 
            value={formatCurrency(84007.08)} 
            subtext="6 Deposits" 
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPICard 
            title="Reconciliation Rate" 
            value="99.95%" 
            subtext="Variance: $-40.00" 
            subtextColor={theme.palette.error.main}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPICard 
            title="Action Required" 
            value="1" 
            subtext="Cross-Entity Items" 
          />
        </Grid>
      </Grid>

      {/* Data Section */}
      {bankDeposits
        .filter(entity => selectedEntityId === 'all' || entity.id === selectedEntityId)
        .map((entity) => (
          <Box key={entity.id} sx={{ mb: 4 }}>
            <Box sx={{ px: 2, py: 1, backgroundColor: '#f1f5f9', borderRadius: '4px 4px 0 0', border: '1px solid #e2e8f0', borderBottom: 'none' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'rgb(10, 22, 40)' }}>
                {entity.name} — {entity.items.length} Items
              </Typography>
            </Box>
            <TableContainer component={Paper} sx={{ borderRadius: '0 0 4px 4px', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell sx={{ py: 1.5, color: 'text.secondary', fontWeight: 600, fontSize: '11px' }}>REF / DATE</TableCell>
                    <TableCell sx={{ py: 1.5, color: 'text.secondary', fontWeight: 600, fontSize: '11px' }}>PAYER NAME</TableCell>
                    <TableCell sx={{ py: 1.5, color: 'text.secondary', fontWeight: 600, fontSize: '11px' }} align="right">BANK AMT</TableCell>
                    <TableCell sx={{ py: 1.5, color: 'text.secondary', fontWeight: 600, fontSize: '11px' }} align="right">REMIT AMT</TableCell>
                    <TableCell sx={{ py: 1.5, color: 'text.secondary', fontWeight: 600, fontSize: '11px' }} align="right">VARIANCE</TableCell>
                    <TableCell sx={{ py: 1.5, color: 'text.secondary', fontWeight: 600, fontSize: '11px' }} align="right">STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {entity.items.map((item) => (
                    <ExpandableRow key={item.id} item={item} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
    </Box>
  );
};

export default BankDepositsScreen;
