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
        dynamicColumns,
        isHeadersFetching,
        isHeadersSuccess,
        isError,
        refetch,
        summaryData,
        onSearch
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
                align: 'left',
                render: (row) => (
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleRow(row.transactionNo); }}>
                        {expandedRows.has(row.transactionNo) ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                    </IconButton>
                ),
            },
            transactionNo: {
                id: 'transactionNo',
                label: 'TRANSACTION NUMBER',
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
                align: 'right',
                accessor: (row) => row.reconciliationStatus || 'Pending',
                render: (row) => {
                    const status = row.reconciliationStatus || 'Pending';
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

        if (isHeadersSuccess && (!dynamicColumns || dynamicColumns.length === 0)) {
            return [];
        }

        if (!isHeadersSuccess && (!dynamicColumns || dynamicColumns.length === 0)) {
            return [
                baseColumns.expand,
                baseColumns.transactionNo,
                baseColumns.reference,
                baseColumns.payerName,
                baseColumns.bankAmt,
                baseColumns.remitAmt,
                baseColumns.variance,
                baseColumns.status,
            ];
        }

        // Map dynamic columns from API, fallback to baseColumn definition if ID matches
        const mappedColumns: DataColumn<BankDepositItem>[] = dynamicColumns.map(dc => {
            // Map display name to internal ID (e.g., "Transaction No" -> "transactionNo")
            const mappedId = dc.displayName
                .toLowerCase()
                .replace(/[^a-z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
                .replace(/^(.)/, (_, chr) => chr.toLowerCase())
                .replace(/no$/, 'No') // special case for "No"
                .replace(/amt$/, 'Amt');

            const base = baseColumns[mappedId];
            if (base) {
                return {
                    ...base,
                    label: dc.displayName.toUpperCase()
                };
            }
            return {
                id: mappedId,
                label: dc.displayName.toUpperCase(),
                align: 'center',
                accessor: (row: BankDepositItem) => (row as any)[mappedId],
                render: (row: BankDepositItem) => (
                    <Typography variant="body2">
                        {String((row as any)[mappedId] || '-')}
                    </Typography>
                )
            };
        });

        // Ensure expand is always first
        if (!mappedColumns.find(c => c.id === 'expand')) {
            mappedColumns.unshift(baseColumns.expand);
        }

        return mappedColumns;
    }, [expandedRows, theme, toggleRow, dynamicColumns]);

    const renderExpandedContent = useCallback((item: BankDepositItem) => (
        <ExpandedContentBox>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <SubSectionWrapper>
                        <SubSectionHeader>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>VARIANCE DETAILS</Typography>
                        </SubSectionHeader>
                        <Box sx={{ p: 2 }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary">Variance 1</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(item.variance1)}</Typography>
                                    <Chip label={item.variance1Status} size="small" variant="outlined" sx={{ fontSize: '10px' }} />
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Variance 2</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(item.variance2)}</Typography>
                                    <Chip label={item.variance2Status} size="small" variant="outlined" sx={{ fontSize: '10px' }} />
                                </Box>
                            </Box>
                        </Box>
                    </SubSectionWrapper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <SubSectionWrapper>
                        <SubSectionHeader>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>ADDITIONAL INFORMATION</Typography>
                        </SubSectionHeader>
                        <Box sx={{ p: 2 }}>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary">Account Name</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.accountName || 'N/A'}</Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="caption" color="text.secondary">Batch Owner</Typography>
                                <Typography variant="body2">{item.batchOwner || 'N/A'}</Typography>
                            </Box>
                            {item.comments && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Comments</Typography>
                                    <Typography variant="body2" sx={{ fontStyle: 'italic', fontSize: '0.8rem' }}>{item.comments}</Typography>
                                </Box>
                            )}
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
                {/* <FormControlLabel
                    control={
                        <Switch
                            size="small"
                            checked={exceptionsOnly}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setExceptionsOnly(checked);
                                setFilters({ statusList: checked ? ['Exception'] : [] });
                            }}
                        />
                    }
                    label={<Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>Exceptions Only</Typography>}
                    sx={{ ml: { xs: 0, md: 1 } }}
                /> */}
                {/* <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
                    <RefreshButton variant="outlined" size="small" onClick={() => refetch()}>Refresh Data</RefreshButton>
                    <FinalizeButton variant="contained" size="small">Finalize Selected</FinalizeButton>
                </Box> */}
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

            {columns.length > 1 && filteredDeposits.map((entity) => (
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
                        download={false}
                        rowsPerPageOptions={[5, 10, 20]}
                    />
                </Box>
            ))}

            {isHeadersSuccess && columns.length <= 1 && (
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
