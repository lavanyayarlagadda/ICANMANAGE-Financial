import React, { useMemo, useCallback } from 'react';
import {
    Chip,
    alpha,
    Tabs,
    Tab,
    Box,
    Typography,
    useTheme,
    InputAdornment,
    Switch,
    FormControlLabel,
    Grid,
    IconButton,

} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { formatCurrency } from '@/utils/formatters';
import { BankDepositItem } from '@/interfaces/financials';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import { themeConfig } from '@/theme/themeConfig';
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
import { useBankDepositsScreen } from './BankDepositsScreen.hook';

const BankDepositsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const theme = useTheme();
    const {
        filteredDeposits,
        totalElements,
        queryParams,
        selectedEntityId,
        setSelectedEntityId,
        expandedRows,
        entities,
        exceptionsOnly,
        setExceptionsOnly,
        toggleRow,
        handleRangeChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        refetch,
    } = useBankDepositsScreen({ skip });

    const summaryStats = useMemo(() => {
        let totalItems = 0;
        let exceptions = 0;
        let totalBankAmt = 0;

        filteredDeposits.forEach(entity => {
            totalItems += entity.items.length;
            entity.items.forEach(item => {
                totalBankAmt += item.bankAmt;
                if (item.status === 'Exception') exceptions++;
            });
        });

        const reconRate = totalItems > 0 ? ((totalItems - exceptions) / totalItems * 100).toFixed(2) : '100.00';
        return { totalBankAmt, reconRate, exceptions };
    }, [filteredDeposits]);

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
            id: 'transactionNo',
            label: 'TRANSACTION #',
            accessor: (row) => row.id,
            render: (row) => <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{row.id}</Typography>,
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
            render: (row) => {
                const isMatched = row.status === 'Matched';
                const statusColors = isMatched ? themeConfig.status.match : themeConfig.status.critical;

                return (
                    <Chip
                        label={row.status}
                        size="small"
                        icon={isMatched ? <CheckCircleOutlineIcon sx={{ fontSize: '14px !important' }} /> : <ErrorOutlineIcon sx={{ fontSize: '14px !important' }} />}
                        sx={{
                            backgroundColor: statusColors.bg,
                            color: statusColors.text,
                            fontWeight: 600,
                            fontSize: '11px',
                            border: `1px solid ${alpha(statusColors.text, 0.2)}`
                        }}
                    />
                );
            },
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
                                                backgroundColor: pa.status === 'Posted' ? alpha(theme.palette.success.main, 0.1) : pa.status === 'Pending' ? theme.palette.action.hover : alpha(theme.palette.warning.main, 0.1),
                                                color: pa.status === 'Posted' ? theme.palette.success.main : pa.status === 'Pending' ? theme.palette.text.secondary : theme.palette.warning.main
                                            }}
                                        />
                                    </Box>
                                </PostingItemBox>
                            ))}
                        </Box>
                    </SubSectionWrapper>
                </Grid>
            </Grid>
        </ExpandedContentBox>
    ), [theme]);

    return (
        <ScreenWrapper>
            <ScreenHeader>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Bank Deposit Reconciliation</Typography>
                <Typography variant="body2" color="text.secondary">Match bank deposits to remittances and track their posting status across various systems.</Typography>
            </ScreenHeader>

            <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', mb: 1.5, display: 'block', letterSpacing: '0.05em' }}>View Entity</Typography>
                <Tabs
                    value={selectedEntityId}
                    onChange={(_, val) => setSelectedEntityId(val)}
                    variant="scrollable"
                    scrollButtons={true}
                    allowScrollButtonsMobile
                    sx={{
                        minHeight: 'auto',
                        '& .MuiTabs-indicator': { display: 'none' },
                        '& .MuiTabs-flexContainer': { gap: 1 },
                        '& .MuiTabs-scrollButtons': {
                            width: 28,
                            borderRadius: '4px',
                            backgroundColor: alpha(themeConfig.colors.slate[100], 0.3),
                            '&.Mui-disabled': { opacity: 0 }
                        }
                    }}
                >
                    {entities.map((e) => {
                        const isActive = selectedEntityId === e.id;
                        return (
                            <Tab
                                key={e.id}
                                value={e.id}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: '13px',
                                    minHeight: 'auto',
                                    p: 0,
                                    opacity: 1,
                                    '& .MuiBox-root': {
                                        px: 2,
                                        py: 0.6,
                                        borderRadius: '16px',
                                        transition: 'all 0.2s',
                                        backgroundColor: isActive ? themeConfig.colors.tabs.activeBgHover : 'transparent',
                                        color: isActive ? themeConfig.colors.tabs.textActive : themeConfig.colors.tabs.textInactive,
                                        '&:hover': {
                                            backgroundColor: isActive ? alpha(themeConfig.colors.primary, 0.8) : themeConfig.colors.tabs.subBg,
                                        }
                                    }
                                }}
                                label={<Box>{e.name}</Box>}
                                disableRipple
                            />
                        );
                    })}
                </Tabs>
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
                    control={<Switch size="small" checked={exceptionsOnly} onChange={(e) => setExceptionsOnly(e.target.checked)} />}
                    label={<Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Exceptions Only</Typography>}
                    sx={{ ml: { xs: 0, md: 1 } }}
                />
                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
                    <RefreshButton variant="outlined" size="small" onClick={() => refetch()}>Refresh Data</RefreshButton>
                    <FinalizeButton variant="contained" size="small">Finalize Selected</FinalizeButton>
                </Box>
            </ToolbarWrapper>

            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <SummaryCard title="TOTAL COLLECTIONS" value={formatCurrency(summaryStats.totalBankAmt)} variant="highlight" backgroundColor={theme.palette.background.paper} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <SummaryCard title="RECONCILIATION RATE" value={`${summaryStats.reconRate}%`} variant={summaryStats.exceptions > 0 ? "negative" : "positive"} backgroundColor={theme.palette.background.paper} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <SummaryCard title="ACTION REQUIRED" value={String(summaryStats.exceptions)} backgroundColor={theme.palette.background.paper} />
                </Grid>
            </Grid>

            {filteredDeposits.map((entity) => (
                <Box key={entity.id} sx={{ mb: 4 }}>
                    <EntitySectionHeader>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>{entity.name} — {entity.items.length} Items</Typography>
                    </EntitySectionHeader>
                    <DataTable
                        columns={columns}
                        data={entity.items}
                        rowKey={(row) => row.id}
                        expandedRows={expandedRows}
                        expandedContent={renderExpandedContent}
                        paginated={false}
                        searchable={false}
                        customToolbarContent={<RangeDropdown onChange={handleRangeChange} />}
                        dictionaryId="bank-deposits"
                        sortCol={queryParams.sortField}
                        sortDir={queryParams.sortOrder}
                        onSortChange={handleSortChange}
                        download={false}
                    />
                </Box>
            ))}
        </ScreenWrapper>
    );
};

export default BankDepositsScreen;
