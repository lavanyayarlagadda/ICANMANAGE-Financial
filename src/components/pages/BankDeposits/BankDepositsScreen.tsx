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
    Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { formatCurrency, formatDate } from '@/utils/formatters';
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
        searchTerm,
        setSearchTerm,
        setFilters,
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
        statusOptions,
        payerOptions,
        dynamicColumns,
        isHeadersFetching,
        isHeadersSuccess,
        isError,
        refetch,
        onSearch,
        summaryData,
        rowHistory
    } = useBankDepositsScreen({ skip });

    const summaryStats = useMemo(() => {
        if (summaryData) {
            const { totalBaiAmount, actionRequiredCount, reconciliationRatePercentage } = summaryData;
            return {
                totalBankAmt: totalBaiAmount,
                reconRate: (reconciliationRatePercentage || 0).toFixed(2),
                exceptions: actionRequiredCount
            };
        }

        let totalItems = 0;
        let exceptions = 0;
        let totalBankAmt = 0;

        filteredDeposits.forEach(entity => {
            totalItems += entity.items.length;
            entity.items.forEach((item: BankDepositItem) => {
                totalBankAmt += item.baiAmount;
                if (item.reconciliationStatus === 'Exception' || item.varianceAmount !== 0) exceptions++;
            });
        });

        const reconRate = totalItems > 0 ? (((totalItems - exceptions) / totalItems) * 100).toFixed(2) : '100.00';
        return { totalBankAmt, reconRate, exceptions };
    }, [filteredDeposits, summaryData]);

    const columns = useMemo<DataColumn<BankDepositItem>[]>(() => {
        // Base columns that are always present or have complex custom rendering
        const baseColumns: Record<string, DataColumn<BankDepositItem>> = {
            expand: {
                id: 'expand',
                label: '',
                render: (row) => (
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleRow(row.transactionNo); }}>
                        {expandedRows.has(row.transactionNo) ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                    </IconButton>
                ),
            },
            transactionNo: {
                id: 'transactionNo',
                label: 'TRANSACTION NO',
                align: 'center',
                accessor: (row) => row.transactionNo,
                render: (row) => <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{row.transactionNo}</Typography>,
            },
            reference: {
                id: 'reference',
                label: 'REF / DATE',
                align: 'center',
                accessor: (row) => row.accountNo,
                render: (row) => (
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>{row.accountNo}</Typography>
                        <Typography variant="caption" color="text.secondary">{formatDate(row.baiReceivedDate)}</Typography>
                    </Box>
                ),
            },
            payerName: {
                id: 'payerName',
                label: 'PAYER NAME',
                align: 'center',
                accessor: (row) => row.payerName,
                filterOptions: payerOptions,
                render: (row) => <Typography variant="body2">{row.payerName}</Typography>,
            },
            bankAmt: {
                id: 'bankAmt',
                label: 'BANK AMT',
                align: 'center',
                accessor: (row) => row.baiAmount,
                render: (row) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(row.baiAmount)}</Typography>,
            },
            remitAmt: {
                id: 'remitAmt',
                label: 'REMIT AMT',
                align: 'center',
                accessor: (row) => row.remitAmount,
                render: (row) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(row.remitAmount)}</Typography>,
            },
            variance: {
                id: 'variance',
                label: 'VARIANCE',
                align: 'center',
                accessor: (row) => row.varianceAmount,
                render: (row) => (
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            color: row.varianceAmount < 0 ? theme.palette.error.main : theme.palette.text.primary
                        }}
                    >
                        {formatCurrency(row.varianceAmount)}
                    </Typography>
                ),
            },
            status: {
                id: 'status',
                label: 'STATUS',
                align: 'center',
                accessor: (row) => row.reconciliationStatus || row.status || 'Pending',
                filterOptions: statusOptions,
                render: (row) => {
                    const status = row.reconciliationStatus || row.status || 'Pending';
                    const isMatched = status === 'Matched' || status === 'Reconciled';
                    const statusColors = isMatched ? themeConfig.status.match : themeConfig.status.critical;

                    return (
                        <Chip
                            label={status}
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
        };

        const defaultColumns = [
            baseColumns.expand,
            baseColumns.transactionNo,
            baseColumns.reference,
            baseColumns.payerName,
            baseColumns.bankAmt,
            baseColumns.remitAmt,
            baseColumns.variance,
            baseColumns.status,
        ];

        if (!isHeadersSuccess || !dynamicColumns || dynamicColumns.length === 0) {
            return defaultColumns;
        }

        // Map dynamic columns from API
        const mappedColumns: DataColumn<BankDepositItem>[] = dynamicColumns.map(dc => {
            const mappedId = dc.displayName
                .toLowerCase()
                .replace(/[^a-z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
                .replace(/^(.)/, (_, chr) => chr.toLowerCase());

            const lowerName = dc.displayName.toLowerCase();
            const base = Object.values(baseColumns).find(c => {
                const cid = c.id.toLowerCase();
                if (lowerName.includes('status')) return cid === 'status';
                if (lowerName.includes('payer') || lowerName.includes('payor')) return cid === 'payername';
                if (lowerName.includes('bank') && (lowerName.includes('amt') || lowerName.includes('amount') || lowerName.includes('deposit'))) return cid === 'bankamt';
                if (lowerName.includes('remit') && (lowerName.includes('amt') || lowerName.includes('amount'))) return cid === 'remitamt';
                if (lowerName.includes('variance')) return cid === 'variance';
                if (lowerName.includes('trans') || (lowerName.includes('check') && !lowerName.includes('pay'))) return cid === 'transactionno';
                if (lowerName.includes('ref') || (lowerName.includes('date') && !lowerName.includes('received'))) return cid === 'reference';
                return false;
            });

            const actualField = mappedId;

            if (base) {
                return {
                    ...base,
                    label: dc.displayName.toUpperCase(),
                    accessor: (row: BankDepositItem) => {
                        const val = (row as any)[actualField];
                        return val !== undefined ? val : base.accessor?.(row);
                    },
                    filterOptions: actualField === 'payerName' ? payerOptions : base.filterOptions
                };
            }

            return {
                id: mappedId,
                label: dc.displayName.toUpperCase(),
                align: 'center',
                accessor: (row: BankDepositItem) => (row as any)[actualField],
                render: (row: BankDepositItem) => {
                    const val = (row as any)[actualField];
                    if (typeof val === 'number' && (mappedId.toLowerCase().includes('amt') || mappedId.toLowerCase().includes('amount') || mappedId.toLowerCase().includes('variance'))) {
                        return <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(val)}</Typography>;
                    }
                    if (mappedId.toLowerCase().includes('date') && val) {
                        return <Typography variant="body2">{formatDate(val)}</Typography>;
                    }
                    return <Typography variant="body2">{val !== null && val !== undefined ? String(val) : '-'}</Typography>;
                }
            };
        });

        if (!mappedColumns.find(c => c.id === 'expand')) {
            mappedColumns.unshift(baseColumns.expand);
        }

        return mappedColumns;
    }, [expandedRows, theme, toggleRow, dynamicColumns, isHeadersSuccess, payerOptions, statusOptions]);

    const renderExpandedContent = useCallback((item: BankDepositItem) => {
        const history = rowHistory[item.transactionNo];
        const { data: historyData, isLoading } = history || { data: null, isLoading: false };

        return (
            <ExpandedContentBox sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.02), p: 2 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 1 }}>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>Loading History...</Typography>
                        <Typography variant="caption" color="text.secondary">Fetching detailed reconciliation data</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {/* Section B: REMITTANCE ADVICE */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <SubSectionWrapper sx={{ height: '100%' }}>
                                <SubSectionHeader>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: theme.palette.primary.main, letterSpacing: '0.05em' }}>(B) REMITTANCE ADVICE</Typography>
                                </SubSectionHeader>
                                <Box sx={{ p: 0 }}>
                                    <Box sx={{ display: 'flex', px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ flex: 1, fontWeight: 700 }}>PAYER / DATE</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ width: 100, textAlign: 'right', fontWeight: 700 }}>AMOUNT</Typography>
                                    </Box>
                                    {historyData?.remitDataRecords?.map((remit: any, idx: number) => (
                                        <Box key={idx} sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }}>{remit.payerName}</Typography>
                                                <Typography variant="body2" sx={{ width: 100, textAlign: 'right', fontWeight: 700 }}>{formatCurrency(remit.amount)}</Typography>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Date: {remit.receivedDate ? formatDate(remit.receivedDate) : '-'} | File: {remit.fileName}</Typography>
                                        </Box>
                                    )) || (
                                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                                <Typography variant="caption" color="text.secondary">No remittance advice found</Typography>
                                            </Box>
                                        )}
                                </Box>
                            </SubSectionWrapper>
                        </Grid>

                        {/* Section C: POSTING & APPLICATION */}
                        <Grid size={{ xs: 12, lg: 4 }}>
                            <SubSectionWrapper sx={{ height: '100%' }}>
                                <SubSectionHeader>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: theme.palette.primary.main, letterSpacing: '0.05em' }}>(C) POSTING & APPLICATION</Typography>
                                </SubSectionHeader>
                                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {historyData?.cashPostingRecords?.map((post: any, idx: number) => (
                                        <PostingItemBox key={idx} sx={{ p: 1.5, borderRadius: '8px', borderLeft: `4px solid ${theme.palette.warning.main}`, backgroundColor: theme.palette.background.paper, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{post.payerName || 'Unknown Payer'}</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(post.amount)}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {post.depositDate ? formatDate(post.depositDate) : '-'} | {post.paymentMethod}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                                    Batch: {post.batchId}
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                {post.fileName} | {post.paymentType}
                                            </Typography>
                                        </PostingItemBox>
                                    )) || (
                                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                                <Typography variant="caption" color="text.secondary">No posting application data found</Typography>
                                            </Box>
                                        )}
                                </Box>
                            </SubSectionWrapper>
                        </Grid>
                    </Grid>
                )}
            </ExpandedContentBox>
        );
    }, [theme, rowHistory]);

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
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <SearchField
                        size="small"
                        placeholder="Search by Check"
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
                        sx={{ height: '36px', borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                    >
                        Search
                    </Button>
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
                        rowKey={(row) => row.transactionNo}
                        expandedRows={expandedRows}
                        expandedContent={renderExpandedContent}
                        paginated={true}
                        searchable={false}
                        customToolbarContent={<RangeDropdown onChange={handleRangeChange} />}
                        dictionaryId="bank-deposits"
                        serverSide
                        sortCol={queryParams.sortField}
                        sortDir={queryParams.sortOrder}
                        onSortChange={handleSortChange}
                        page={queryParams.page}
                        rowsPerPage={queryParams.size}
                        totalElements={entity.totalItems || 0}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={onRowsPerPageChange}
                        onFilterChange={(newFilters) => {
                            const filterKeys = Object.keys(newFilters);
                            const statusKey = filterKeys.find(k => k.toLowerCase().includes('status'));
                            const payerKey = filterKeys.find(k => k.toLowerCase().includes('payer') || k.toLowerCase().includes('payor'));
                            
                            setFilters({
                                status: statusKey ? newFilters[statusKey] : null,
                                payerList: payerKey ? [newFilters[payerKey]] : []
                            });
                        }}
                        download={false}
                        rowsPerPageOptions={[5, 10, 20, 50]}
                    />
                </Box>
            ))}

            {isHeadersSuccess && columns.length <= 1 && filteredDeposits.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center', backgroundColor: alpha(themeConfig.colors.slate[100], 0.3), borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        No configurable columns found for this entity. Please contact support.
                    </Typography>
                </Box>
            )}
        </ScreenWrapper>
    );
};

export default BankDepositsScreen;
