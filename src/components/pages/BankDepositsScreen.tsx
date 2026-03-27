import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  useTheme,
  InputAdornment,
  Switch,
  FormControlLabel,
  Grid,
  IconButton,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
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
import {
  ScreenWrapper,
  ScreenHeader,
  EntityChip,
  ToolbarWrapper,
  SearchField,
  RefreshButton,
  FinalizeButton,
  EntitySectionHeader,
  ExpandedContentBox,
  SubSectionWrapper,
  SubSectionHeader,
  PostingItemBox
} from './BankDepositsScreen.styles';

const BankDepositsScreen: React.FC = () => {
  const theme = useTheme();
  const bankDeposits = useAppSelector((s) => s.financials.bankDeposits);
  const [selectedEntityId, setSelectedEntityId] = useState<'all' | string>('all');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());


  const entities = useMemo(() => [
    { id: 'all', name: 'All Entities (Consolidated)' },
    { id: 'e1', name: 'Apex Primary Care' },
    { id: 'e2', name: 'Apex Surgical Center' },
    { id: 'e3', name: 'Apex Home Health' },
  ], []);

  const toggleRow = useCallback((id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }, []);

  const columns = useMemo<DataColumn<BankDepositItem>[]>(() => [
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
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>{row.reference}</Typography>
          <Typography variant="caption" color="text.secondary">{row.date}</Typography>
        </Box>
      ),
    },
    { id: 'payerName', label: 'PAYER NAME' },
    {
      id: 'bankAmt',
      label: 'BANK AMT',
      align: 'right',
      render: (row) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(row.bankAmt)}</Typography>,
    },
    {
      id: 'remitAmt',
      label: 'REMIT AMT',
      align: 'right',
      render: (row) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(row.remitAmt)}</Typography>,
    },
    {
      id: 'variance',
      label: 'VARIANCE',
      align: 'right',
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
      render: (row) => (
        <Chip
          label={row.status}
          size="small"
          icon={row.status === 'Matched' ? <CheckCircleOutlineIcon sx={{ fontSize: '14px !important' }} /> : <ErrorOutlineIcon sx={{ fontSize: '14px !important' }} />}
          sx={{
            backgroundColor: row.status === 'Matched' ? `${theme.palette.success.main}10` : `${theme.palette.error.main}10`,
            color: row.status === 'Matched' ? theme.palette.success.main : theme.palette.error.main,
            fontWeight: 600,
            fontSize: '11px',
            border: `1px solid ${row.status === 'Matched' ? `${theme.palette.success.main}40` : `${theme.palette.error.main}40`}`
          }}
        />
      ),
    },
  ], [expandedRows, theme, toggleRow]);

  const renderExpandedContent = useCallback((item: BankDepositItem) => (
    <ExpandedContentBox>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SubSectionWrapper>
            <SubSectionHeader>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>(A) REMITTANCE ADVICE</Typography>
            </SubSectionHeader>
            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', background: theme.palette.background.default }}>
                    <th style={{ padding: '8px 16px', fontSize: '11px', color: theme.palette.text.secondary }}>REMIT REFERENCE</th>
                    <th style={{ padding: '8px 16px', fontSize: '11px', color: theme.palette.text.secondary, textAlign: 'right' }}>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {item.remittanceAdvice.map((ra, idx) => (
                    <tr key={idx} style={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                      <td style={{ padding: '8px 16px', fontSize: '13px' }}>{ra.reference}</td>
                      <td style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 700, textAlign: 'right' }}>{formatCurrency(ra.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </SubSectionWrapper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SubSectionWrapper>
            <SubSectionHeader>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>(B) POSTING & APPLICATION</Typography>
            </SubSectionHeader>
            <Box sx={{ p: 2, maxHeight: 200, overflow: 'auto' }}>
              {item.postingApplication.map((pa, idx) => (
                <PostingItemBox key={idx}>
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
                        backgroundColor: pa.status === 'Posted' ? `${theme.palette.success.main}10` : pa.status === 'Pending' ? theme.palette.action.hover : `${theme.palette.warning.main}10`,
                        color: pa.status === 'Posted' ? theme.palette.success.main : pa.status === 'Pending' ? theme.palette.text.secondary : theme.palette.warning.main
                      }}
                    />
                  </Box>
                </PostingItemBox>
              ))}
              <Box sx={{ mt: 1, pt: 1, borderTop: `1px dashed ${theme.palette.divider}`, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>C-D Variance</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.success.main }}>$0.00</Typography>
              </Box>
            </Box>
          </SubSectionWrapper>
        </Grid>
      </Grid>
    </ExpandedContentBox>
  ), [theme]);

  return (
    <ScreenWrapper>
      <ScreenHeader>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Bank Deposit Reconciliation
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Match bank deposits to remittances and track their posting status across various systems.
        </Typography>
      </ScreenHeader>

      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block' }}>View Entity</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {entities.map((e) => (
            <EntityChip
              key={e.id}
              label={e.name}
              onClick={() => setSelectedEntityId(e.id)}
              isSelected={selectedEntityId === e.id}
            />
          ))}
        </Box>
      </Box>

      <ToolbarWrapper>
        <SearchField
          size="small"
          placeholder="Search by Check#, Amount, or Payer..."
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
          <RefreshButton variant="outlined" size="small">
            Refresh Data
          </RefreshButton>
          <FinalizeButton variant="contained" size="small">
            Finalize Selected
          </FinalizeButton>
        </Box>
      </ToolbarWrapper>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard title="Total Collections" value={formatCurrency(84007.08)} variant="highlight" backgroundColor="#fff" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard title="Reconciliation Rate" value="99.95%" variant="negative" backgroundColor="#fff" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard title="Action Required" value="1" backgroundColor="#fff" />
        </Grid>
      </Grid>

      {bankDeposits
        .filter(entity => selectedEntityId === 'all' || entity.id === selectedEntityId)
        .map((entity) => (
          <Box key={entity.id} sx={{ mb: 4 }}>
            <EntitySectionHeader>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'rgb(10, 22, 40)' }}>
                {entity.name} — {entity.items.length} Items
              </Typography>
            </EntitySectionHeader>
            <DataTable
              columns={columns}
              data={entity.items}
              rowKey={(row) => row.id}
              expandedRows={expandedRows}
              expandedContent={renderExpandedContent}
              paginated={false}
              searchable={false}
              customToolbarContent={<RangeDropdown />}
              dictionaryId="bank-deposits"
            />
          </Box>
        ))}
    </ScreenWrapper>
  );
};

export default BankDepositsScreen;
