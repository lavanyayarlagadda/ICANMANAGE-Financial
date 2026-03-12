import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  useTheme,
  Grid,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { useAppSelector } from '@/store';
import { formatCurrency } from '@/utils/formatters';
import { ForwardBalanceNotice, OffsetEvent } from '@/types/financials';
import PipScreen from './PipScreen';
import DataTable, { DataColumn } from '@/components/molecules/DataTable';
import StatusBadge from '@/components/atoms/StatusBadge';
import RangeDropdown from '@/components/atoms/RangeDropdown';
import Accordion from '@/components/atoms/Accordion';
import SummaryCard from '@/components/atoms/SummaryCard';

const OffsetSection: React.FC<{ offset: OffsetEvent }> = ({ offset }) => {
  const theme = useTheme();
  return (
    <Box sx={{ mb: 1 }}>
      <Accordion
        defaultExpanded={false}
        summary={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
              Offset EFT: <span style={{ color: theme.palette.primary.main }}>{offset.eftNumber}</span> &nbsp; {offset.date}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, mr: 4 }}>
              {formatCurrency(offset.amount)}
            </Typography>
            <Chip
              label={`CODE: ${offset.code}`}
              size="small"
              sx={{
                height: 20,
                fontSize: '10px',
                fontWeight: 700,
                bgcolor: '#ffedd5',
                color: '#9a3412',
                border: '1px solid #fed7aa'
              }}
            />
          </Box>
        }
      >
        <Box sx={{ border: "1px solid #eee", borderTop: "none", overflowX: "auto" }}>
          {/* Header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1.2fr 2fr 1fr",
              minWidth: 500,
              px: 2,
              py: 1,
              background: "#fafafa",
              borderBottom: "1px solid #eee",
            }}
          >
            <Typography fontSize={11} fontWeight={700} color="text.secondary">CLAIM ID (DEDUCTED FROM)</Typography>
            <Typography fontSize={11} fontWeight={700} color="text.secondary">PATIENT NAME</Typography>
            <Typography fontSize={11} fontWeight={700} color="text.secondary" textAlign="right">DEDUCTED AMOUNT</Typography>
          </Box>

          {/* Claims */}
          {offset.claims.map((claim, idx) => (
            <Box
              key={idx}
              sx={{
                display: "grid",
                gridTemplateColumns: "1.2fr 2fr 1fr",
                minWidth: 500,
                px: 2,
                py: 1,
                borderBottom: "1px solid #f1f1f1",
              }}
            >
              <Typography fontSize={13} color="primary" sx={{ fontWeight: 500 }}>
                {claim.claimId}
              </Typography>
              <Typography fontSize={13} sx={{ fontWeight: 500 }}>{claim.patientName}</Typography>
              <Typography fontSize={13} textAlign="right" color="error.main" sx={{ fontWeight: 700 }}>
                {formatCurrency(claim.deductedAmount)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Accordion>
    </Box>
  );
};

const ForwardBalanceNoticesTable = ({ data }: { data: ForwardBalanceNotice[] }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const columns: DataColumn<ForwardBalanceNotice>[] = [
    {
      id: 'expand',
      label: '',
      render: (row) => row.offsets.length > 0 ? (
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
          {expandedRows.has(row.id) ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
        </IconButton>
      ) : null,

    },
    {
      id: 'noticeId',
      label: 'NOTICE ID',
      accessor: (row) => row.noticeId,
      render: (row) => <Typography variant="body2" sx={{ fontWeight: 700, color: '#b45309' }}>{row.noticeId}</Typography>,
    },
    {
      id: 'notificationDate',
      label: 'NOTIFICATION DATE',
      accessor: (row) => row.notificationDate,
      render: (row) => <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.notificationDate}</Typography>,
    },
    {
      id: 'provider',
      label: 'PROVIDER / NPI',
      accessor: (row) => `${row.providerName} ${row.npi}`,
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.providerName}</Typography>
          <Typography variant="caption" color="text.secondary">NPI: {row.npi}</Typography>
        </Box>
      ),
    },
    {
      id: 'originalAmount',
      label: 'ORIGINAL AMOUNT',
      align: 'right',
      accessor: (row) => row.originalAmount,
      render: (row) => <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>{formatCurrency(row.originalAmount)}</Typography>,
    },
    {
      id: 'remainingBalance',
      label: 'REMAINING BALANCE',
      align: 'right',
      accessor: (row) => row.remainingBalance,
      render: (row) => <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>{formatCurrency(row.remainingBalance)}</Typography>,
    },
    {
      id: 'status',
      label: 'STATUS',
      accessor: (row) => row.status,
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  const renderExpandedContent = (row: ForwardBalanceNotice) => (
    <Box sx={{ p: 1 }}>
      {row.offsets.map((offset, idx) => (
        <OffsetSection key={idx} offset={offset} />
      ))}
    </Box>
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      rowKey={(row) => row.id}
      expandedRows={expandedRows}
      expandedContent={renderExpandedContent}
      exportTitle="Forward Balance Notices"
      paginated
      // searchable
      customToolbarContent={<RangeDropdown />}
    />
  );
};

const StatementsScreen: React.FC = () => {
  const { activeSubTab } = useAppSelector((s) => s.ui);
  const { forwardBalanceNotices, pipRecords } = useAppSelector((s) => s.financials);

  const totalPipAmount = pipRecords.reduce((sum, r) => sum + r.paymentAmount, 0);
  const totalSuspenseBalance = pipRecords.reduce((sum, r) => sum + r.suspenseBalance, 0);

  const totalOriginalAmount = forwardBalanceNotices.reduce((sum, r) => sum + r.originalAmount, 0);
  const totalRemainingBalance = forwardBalanceNotices.reduce((sum, r) => sum + r.remainingBalance, 0);

  return (
    <Box sx={{}}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {activeSubTab === 0 ? 'PIP Statements' : 'Forward Balance Notices'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {activeSubTab === 0
            ? 'Periodic Interim Payment (PIP) records with NPI-level claim allocations.'
            : 'Overpayment notices with offset events and affected claims.'}
        </Typography>
      </Box>




      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title={activeSubTab === 0 ? "TOTAL PAID AMOUNT" : "TOTAL ORIGINAL AMOUNT"}
            value={formatCurrency(activeSubTab === 0 ? totalPipAmount : totalOriginalAmount)}
            backgroundColor="#fff"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title={activeSubTab === 0 ? "TOTAL SUSPENSE BALANCE" : "TOTAL REMAINING BALANCE"}
            value={formatCurrency(activeSubTab === 0 ? totalSuspenseBalance : totalRemainingBalance)}
            variant={activeSubTab === 1 ? "negative" : "default"}
            backgroundColor="#fff"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SummaryCard
            title="ACTION REQUIRED"
            value={activeSubTab === 0 ? "2" : "1"}
            backgroundColor="#fff"
          />
        </Grid>
      </Grid>


      {activeSubTab === 0 ? (
        <PipScreen />
      ) : (
        <ForwardBalanceNoticesTable data={forwardBalanceNotices} />
      )}
    </Box>
  );
};


export default StatementsScreen;
