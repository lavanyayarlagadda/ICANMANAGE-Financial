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
  IconButton,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useAppSelector } from '@/store';
import { formatCurrency } from '@/utils/formatters';
import { BankDepositItem } from '@/types/financials';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import SummaryCard from '@/components/atoms/SummaryCard';
import RangeDropdown from '@/components/atoms/RangeDropdown';

const BankDepositsScreen: React.FC = () => {
  const theme = useTheme();
  const bankDeposits = useAppSelector((s) => s.financials.bankDeposits);
  const [selectedEntityId, setSelectedEntityId] = useState<'all' | string>('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());


  const entities = [
    { id: 'all', name: 'All Entities (Consolidated)' },
    { id: 'e1', name: 'Apex Primary Care' },
    { id: 'e2', name: 'Apex Surgical Center' },
    { id: 'e3', name: 'Apex Home Health' },
  ];


  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const columns: DataColumn<BankDepositItem>[] = [
    {
      id: 'expand',
      label: '',
      render: (row) => (
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
          {expandedRows.has(row.id) ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
        </IconButton>

      ),
    },
    {
      id: 'reference',
      label: 'REF / DATE',
      accessor: (row) => row.reference,
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>{row.reference}</Typography>
          <Typography variant="caption" color="text.secondary">{row.date}</Typography>
        </Box>
      ),
    },
    {
      id: 'payerName',
      label: 'PAYER NAME',
      accessor: (row) => row.payerName,
      render: (row) => <Typography variant="body2">{row.payerName}</Typography>,
    },
    {
      id: 'bankAmt',
      label: 'BANK AMT',
      align: 'right',
      accessor: (row) => row.bankAmt,
      render: (row) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(row.bankAmt)}</Typography>,
    },
    {
      id: 'remitAmt',
      label: 'REMIT AMT',
      align: 'right',
      accessor: (row) => row.remitAmt,
      render: (row) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(row.remitAmt)}</Typography>,
    },
    {
      id: 'variance',
      label: 'VARIANCE',
      align: 'right',
      accessor: (row) => row.variance,
      render: (row) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: row.variance < 0 ? theme.palette.error.main : theme.palette.text.primary
          }}
        >
          {formatCurrency(row.variance)}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'STATUS',
      align: 'right',
      accessor: (row) => row.status,
      render: (row) => (
        <Chip
          label={row.status}
          size="small"
          icon={row.status === 'Matched' ? <CheckCircleOutlineIcon sx={{ fontSize: '14px !important' }} /> : <ErrorOutlineIcon sx={{ fontSize: '14px !important' }} />}
          sx={{
            backgroundColor: row.status === 'Matched' ? '#f0fdf4' : '#fef2f2',
            color: row.status === 'Matched' ? '#166534' : '#991b1b',
            fontWeight: 600,
            fontSize: '11px',
            border: `1px solid ${row.status === 'Matched' ? '#bbf7d0' : '#fecaca'}`
          }}
        />
      ),
    },
  ];

  const renderExpandedContent = (item: BankDepositItem) => (
    <Box sx={{ p: 2, backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: 1 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
            <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>(A) REMITTANCE ADVICE</Typography>
            </Box>
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', background: '#f8fafc' }}>
                    <th style={{ padding: '8px 16px', fontSize: '11px', color: '#64748b' }}>REMIT REFERENCE</th>
                    <th style={{ padding: '8px 16px', fontSize: '11px', color: '#64748b', textAlign: 'right' }}>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {item.remittanceAdvice.map((ra, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 16px', fontSize: '13px' }}>{ra.reference}</td>
                      <td style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 700, textAlign: 'right' }}>{formatCurrency(ra.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 1 }}>
            <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>(B) POSTING & APPLICATION</Typography>
            </Box>
            <Box sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
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
              <Box sx={{ mt: 1, pt: 1, borderTop: '1px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>C-D Variance</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#166534' }}>$0.00</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

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

    

      {/* Filter Chips */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block' }}>View Entity</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
                  mb: 0.5,
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
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' }, 
        backgroundColor: '#f8fafc', 
        border: '1px solid #e2e8f0', 
        borderRadius: 1, 
        p: 1.5, 
        gap: 2, 
        mb: 3 
      }}>
        <TextField
          size="small"
          placeholder="Search by Check#, Amount, or Payer..."
          sx={{ 
            backgroundColor: '#fff', 
            flex: { xs: '1 1 auto', md: '0 0 320px' },
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
          sx={{ ml: { xs: 0, md: 1 } }}
        />

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="outlined" 
            size="small" 
            sx={{ 
              backgroundColor: '#fff', 
              color: 'text.primary', 
              borderColor: 'divider', 
              textTransform: 'none',
              fontWeight: 600,
              flex: { xs: 1, md: 'none' }
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
              flex: { xs: 1, md: 'none' },
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
      {/* KPI Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="Total Collections"
            value={formatCurrency(84007.08)}
            variant="highlight"
            backgroundColor="#fff"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="Reconciliation Rate"
            value="99.95%"
            variant="negative"
            backgroundColor="#fff"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="Action Required"
            value="1"
            backgroundColor="#fff"
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
            <DataTable
              columns={columns}
              data={entity.items}
              rowKey={(row) => row.id}
              expandedRows={expandedRows}
              expandedContent={renderExpandedContent}
              paginated={false}
              searchable={false}
              customToolbarContent={<RangeDropdown />}
            />
          </Box>
        ))}
    </Box>
  );
};

export default BankDepositsScreen;
