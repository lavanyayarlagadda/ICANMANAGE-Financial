import React, { useMemo } from 'react';
import { Box, Typography, IconButton, Chip, Grid } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { formatCurrency } from '@/utils/formatters';
import { ForwardBalanceNotice, OffsetEvent } from '@/interfaces/financials';
import PipScreen from '../Pip/PipScreen';
import SuspenseAccountsScreen from '../Suspense/SuspenseAccountsScreen';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import Accordion from '@/components/atoms/Accordion/Accordion';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import MultiValueDisplay from '@/components/atoms/MultiValueDisplay/MultiValueDisplay';
import { useStatementsScreen, useForwardBalanceNoticesTable } from './StatementsScreen.hook';
import * as styles from './StatementsScreen.styles';

const OffsetSection: React.FC<{ offset: OffsetEvent }> = ({ offset }) => (
    <Box sx={{ mb: 1 }}>
        <Accordion
            defaultExpanded={false}
            summary={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>Offset EFT: <MultiValueDisplay value={offset.eftNumber} displayCount={1} /> &nbsp; {offset.date}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, mr: 4 }}>{formatCurrency(offset.amount)}</Typography>
                    <Chip label={`CODE: ${offset.code}`} size="small" sx={styles.offsetChipStyles} />
                </Box>
            }
        >
            <Box sx={{ border: "1px solid #eee", borderTop: "none", overflowX: "auto" }}>
                <Box sx={{ ...styles.offsetGridStyles, background: "#fafafa", borderBottom: "1px solid #eee" }}>
                    <Typography fontSize={11} fontWeight={700} color="text.secondary">CLAIM ID (DEDUCTED FROM)</Typography>
                    <Typography fontSize={11} fontWeight={700} color="text.secondary">PATIENT NAME</Typography>
                    <Typography fontSize={11} fontWeight={700} color="text.secondary" textAlign="right">DEDUCTED AMOUNT</Typography>
                </Box>
                {offset.claims.map((claim, idx) => (
                    <Box key={idx} sx={{ ...styles.offsetGridStyles, borderBottom: "1px solid #f1f1f1" }}>
                        <Typography fontSize={13} color="primary" sx={{ fontWeight: 500 }}>{claim.claimId}</Typography>
                        <Typography fontSize={13} sx={{ fontWeight: 500 }}>{claim.patientName}</Typography>
                        <Typography fontSize={13} textAlign="right" color="error.main" sx={{ fontWeight: 700 }}>{formatCurrency(claim.deductedAmount)}</Typography>
                    </Box>
                ))}
            </Box>
        </Accordion>
    </Box>
);

const ForwardBalanceNoticesTable = ({ data }: { data: ForwardBalanceNotice[] }) => {
    const { expandedRows, toggleRow } = useForwardBalanceNoticesTable();

    const columns = useMemo<DataColumn<ForwardBalanceNotice>[]>(() => [
        {
            id: 'expand',
            label: '',
            render: (row) => row.offsets.length > 0 ? (
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
                    {expandedRows.has(row.id) ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                </IconButton>
            ) : null,
        },
        { id: 'noticeId', label: 'NOTICE ID', render: (row) => <Typography variant="body2" sx={styles.noticeIdStyles}>{row.noticeId}</Typography> },
        { id: 'notificationDate', label: 'NOTIFICATION DATE', render: (row) => <Typography variant="body2" sx={styles.boldStyles}>{row.notificationDate}</Typography> },
        { id: 'provider', label: 'PROVIDER / NPI', render: (row) => <Box><Typography variant="body2" sx={styles.boldStyles}>{row.providerName}</Typography><Typography variant="caption" color="text.secondary">NPI: {row.npi}</Typography></Box> },
        { id: 'originalAmount', label: 'ORIGINAL AMOUNT', align: 'right', render: (row) => <Typography variant="body2" sx={styles.errorAmountStyles}>{formatCurrency(row.originalAmount)}</Typography> },
        { id: 'remainingBalance', label: 'REMAINING BALANCE', align: 'right', render: (row) => <Typography variant="body2" sx={styles.errorAmountStyles}>{formatCurrency(row.remainingBalance)}</Typography> },
        { id: 'status', label: 'STATUS', render: (row) => <StatusBadge status={row.status} /> },
    ], [expandedRows, toggleRow]);

    return <DataTable columns={columns} data={data} rowKey={(row) => row.id} expandedRows={expandedRows} expandedContent={(row) => <Box sx={{ p: 1 }}>{row.offsets.map((offset, idx) => <OffsetSection key={idx} offset={offset} />)}</Box>} exportTitle="Forward Balance Notices" paginated customToolbarContent={<RangeDropdown />} dictionaryId="statements" />;
};

const StatementsScreen: React.FC = () => {
    const { activeSubTab, finalActiveSubTab, forwardBalanceNotices, stats } = useStatementsScreen();

    return (
        <Box>
            {finalActiveSubTab !== 2 && (
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{finalActiveSubTab === 0 ? 'PIP Statements' : 'Forward Balance Notices'}</Typography>
                    <Typography variant="body2" color="text.secondary">{finalActiveSubTab === 0 ? 'Periodic Interim Payment (PIP) records.' : 'Overpayment notices with offset events.'}</Typography>
                </Box>
            )}

            {activeSubTab === 1 && (
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="TOTAL ORIGINAL AMOUNT" value={formatCurrency(stats.totalOriginalAmount)} backgroundColor="#fff" /></Grid>
                    <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="TOTAL REMAINING BALANCE" value={formatCurrency(stats.totalRemainingBalance)} variant="negative" backgroundColor="#fff" /></Grid>
                    <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="ACTION REQUIRED" value="1" backgroundColor="#fff" /></Grid>
                </Grid>
            )}

            {finalActiveSubTab === 0 ? <PipScreen /> : finalActiveSubTab === 1 ? <ForwardBalanceNoticesTable data={forwardBalanceNotices} /> : <SuspenseAccountsScreen />}
        </Box>
    );
};

export default StatementsScreen;

