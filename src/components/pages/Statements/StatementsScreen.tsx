import React, { useMemo } from 'react';
import { Box, Typography, IconButton, Chip, Grid, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ForwardBalanceNotice, OffsetEvent } from '@/interfaces/financials';
import { TableQueryParams } from '@/interfaces/api';
import PipScreen from '../Pip/PipScreen';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import Accordion from '@/components/atoms/Accordion/Accordion';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import MultiValueDisplay from '@/components/atoms/MultiValueDisplay/MultiValueDisplay';
import { themeConfig } from '@/theme/themeConfig';
import { useStatementsScreen, useForwardBalanceNoticesTable } from './StatementsScreen.hook';
import * as styles from './StatementsScreen.styles';
import SuspenseAccountsScreen from '../Suspense/SuspenseAccountsScreen';

import { useTheme } from '@mui/material/styles';

const OffsetSection: React.FC<{ offset: OffsetEvent }> = ({ offset }) => (
    <Box sx={{ mb: 1 }}>
        <Accordion
            defaultExpanded={false}
            summary={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>Offset EFT: <MultiValueDisplay value={offset.eftNumber} displayCount={1} /> &nbsp; {formatDate(offset.date)}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, textAlign: 'center' }}>{formatCurrency(offset.amount)}</Typography>
                    <Chip label={`CODE: ${offset.code}`} size="small" sx={styles.offsetChipStyles} />
                </Box>
            }
        >
            <Box sx={{ border: `1px solid ${themeConfig.colors.divider}`, borderTop: "none", overflowX: "auto" }}>
                <Box sx={{ ...styles.offsetGridStyles, background: themeConfig.colors.surfaceAlt, borderBottom: `1px solid ${themeConfig.colors.divider}` }}>
                    <Typography fontSize={11} fontWeight={700} color="text.secondary">CLAIM ID (DEDUCTED FROM)</Typography>
                    <Typography fontSize={11} fontWeight={700} color="text.secondary">PATIENT NAME</Typography>
                    <Typography fontSize={11} fontWeight={700} color="text.secondary" textAlign="center">DEDUCTED AMOUNT</Typography>
                </Box>
                {offset.claims.map((claim, idx) => (
                    <Box key={idx} sx={{ ...styles.offsetGridStyles, borderBottom: `1px solid ${themeConfig.colors.divider}` }}>
                        <Typography fontSize={13} color="primary" sx={{ fontWeight: 500 }}>{claim.claimId}</Typography>
                        <Typography fontSize={13} sx={{ fontWeight: 500 }}>{claim.patientName}</Typography>
                        <Typography fontSize={13} textAlign="center" color="error.main" sx={{ fontWeight: 700 }}>{formatCurrency(claim.deductedAmount)}</Typography>
                    </Box>
                ))}
            </Box>
        </Accordion>
    </Box>
);

const ForwardBalanceNoticesTable = ({
    data,
    totalElements,
    queryParams,
    onPageChange,
    onRowsPerPageChange,
    onSortChange,
    onRangeChange,
    rangeLabel,
    searchTerm,
    setSearchTerm,
    onSearch
}: {
    data: ForwardBalanceNotice[],
    totalElements: number,
    queryParams: TableQueryParams,
    onPageChange: (p: number) => void,
    onRowsPerPageChange: (s: number) => void,
    onSortChange: (colId: string, dir: 'asc' | 'desc') => void,
    onRangeChange: (range: string) => void,
    rangeLabel: string,
    searchTerm: string,
    setSearchTerm: (v: string) => void,
    onSearch: (v: string) => void
}) => {
    const { expandedRows, toggleRow } = useForwardBalanceNoticesTable();

    const columns = useMemo<DataColumn<ForwardBalanceNotice>[]>(() => [
        {
            id: 'expand',
            label: '',
            align: 'center',
            render: (row) => row.offsets.length > 0 ? (
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
                    {expandedRows.has(row.id) ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                </IconButton>
            ) : null,

        },
        {
            id: 'noticeId',
            label: 'NOTICE ID',
            align: 'center',
            accessor: (row) => row.noticeId,
            render: (row) => <Typography variant="body2" sx={{ fontWeight: 700, color: themeConfig.colors.amberDark }}>{row.noticeId}</Typography>,
        },
        {
            id: 'notificationDate',
            label: 'NOTIFICATION DATE',
            align: 'center',
            accessor: (row) => row.notificationDate,
            render: (row) => <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatDate(row.notificationDate)}</Typography>,
        },
        {
            id: 'provider',
            label: 'PROVIDER / NPI',
            align: 'center',
            accessor: (row) => `${row.providerName} ${row.npi}`,
            render: (row) => (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.providerName}</Typography>
                    <Typography variant="caption" color="text.secondary">NPI: {row.npi}</Typography>
                </Box>
            ),
        },
        {
            id: 'originalAmount',
            label: 'ORIGINAL AMOUNT',
            align: 'center',
            accessor: (row) => row.originalAmount,
            render: (row) => <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>{formatCurrency(row.originalAmount)}</Typography>,
        },
        {
            id: 'remainingBalance',
            label: 'REMAINING BALANCE',
            align: 'center',
            accessor: (row) => row.remainingBalance,
            render: (row) => <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>{formatCurrency(row.remainingBalance)}</Typography>,
        },
        {
            id: 'status',
            label: 'STATUS',
            align: 'center',
            accessor: (row) => row.status,
            render: (row) => <StatusBadge status={row.status} />,
        },
    ], [expandedRows, toggleRow]);

    const theme = useTheme();

    return (
        <Box>
            <styles.ToolbarWrapper>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <styles.SearchField
                        size="small"
                        placeholder="Search by Transaction #"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch(searchTerm)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: 18, color: theme.palette.primary.main }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => onSearch(searchTerm)}
                        sx={{ height: '36px', borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 2 }}
                    >
                        Search
                    </Button>
                </Box>
            </styles.ToolbarWrapper>
            <DataTable
                columns={columns}
                data={data}
                rowKey={(row) => row.id}
                expandedRows={expandedRows}
                expandedContent={(row) => <Box sx={{ p: 1 }}>{row.offsets.map((offset, idx) => <OffsetSection key={idx} offset={offset} />)}</Box>}
                exportTitle="Forward Balance Notices"
                customToolbarContent={<RangeDropdown value={rangeLabel} onChange={onRangeChange} />}
                dictionaryId="statements"
                serverSide
                totalElements={totalElements}
                page={queryParams.page}
                rowsPerPage={queryParams.size}
                sortCol={queryParams.sortField}
                sortDir={queryParams.sortOrder}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                onSortChange={onSortChange}
                download={false}
            />
        </Box>
    );
};

const StatementsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const theme = useTheme();
    const {
        activeSubTab,
        finalActiveSubTab,
        forwardBalanceNotices,
        totalElements,
        queryParams,
        handleRangeChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        searchTerm,
        setSearchTerm,
        onSearch,
        stats,
        globalFilters
    } = useStatementsScreen({ skip });

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
                    <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="TOTAL ORIGINAL AMOUNT" value={formatCurrency(stats.totalOriginalAmount)} backgroundColor={theme.palette.background.paper} /></Grid>
                    <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="TOTAL REMAINING BALANCE" value={formatCurrency(stats.totalRemainingBalance)} variant="negative" backgroundColor={theme.palette.background.paper} /></Grid>
                    <Grid size={{ xs: 12, md: 4 }}><SummaryCard title="ACTION REQUIRED" value="1" backgroundColor={theme.palette.background.paper} /></Grid>
                </Grid>
            )}

            {finalActiveSubTab === 0 ? (
                <PipScreen skip={finalActiveSubTab !== 0} />
            ) : finalActiveSubTab === 1 ? (
                <ForwardBalanceNoticesTable
                    data={forwardBalanceNotices}
                    totalElements={totalElements}
                    queryParams={queryParams}
                    onPageChange={onPageChange}
                    onRowsPerPageChange={onRowsPerPageChange}
                    onSortChange={handleSortChange}
                    onRangeChange={handleRangeChange}
                    rangeLabel={globalFilters.rangeLabel}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSearch={onSearch}
                />
            ) : (
                <SuspenseAccountsScreen skip={finalActiveSubTab !== 2} />
            )}
        </Box>
    );
};

export default StatementsScreen;

