import React, { useMemo } from 'react';
import { Box, Typography, IconButton, Chip, Grid, Button, TextField, InputAdornment, FormControl } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { PlbDetailRecord, AssociatedEraFile } from '@/interfaces/api/transactions';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard';
import { themeConfig } from '@/theme/themeConfig';
import { useFbRecoupScreen, useFbRecoupTable } from './FbRecoupScreen.hook';
import * as styles from './FbRecoupScreen.styles';
import { useTheme } from '@mui/material/styles';

const AssociatedEraFilesSection: React.FC<{ files: AssociatedEraFile[]; isCareHospice: boolean }> = ({ files, isCareHospice }) => (
    <Box sx={{ border: `1px solid ${themeConfig.colors.divider}`, borderRadius: '4px', overflowX: 'auto', m: 1.5 }}>
        <Box sx={{ ...styles.offsetGridStyles, background: themeConfig.colors.surfaceAlt, borderBottom: `1px solid ${themeConfig.colors.divider}` }}>
            <Typography fontSize={11} fontWeight={700} color="text.secondary">TRANSACTION NO</Typography>
            <Typography fontSize={11} fontWeight={700} color="text.secondary">{isCareHospice ? 'PTAN' : 'NPI'}</Typography>
            <Typography fontSize={11} fontWeight={700} color="text.secondary">REMIT DATE</Typography>
            <Typography fontSize={11} fontWeight={700} color="text.secondary" textAlign="right">AMOUNT</Typography>
        </Box>
        {files.map((file, idx) => (
            <Box key={idx} sx={{ ...styles.offsetGridStyles, borderBottom: idx === files.length - 1 ? 'none' : `1px solid ${themeConfig.colors.divider}`, alignItems: 'center' }}>
                <Typography fontSize={13} color="primary" sx={{ fontWeight: 600 }}>{file.transactionNo}</Typography>
                <Typography fontSize={13} sx={{ fontWeight: 500 }}>{file.npi}</Typography>
                <Typography fontSize={13} sx={{ fontWeight: 500 }}>{formatDate(file.remitDate)}</Typography>
                <Typography fontSize={13} textAlign="right" color={file.amount < 0 ? 'error.main' : 'text.primary'} sx={{ fontWeight: 700 }}>
                    {formatCurrency(file.amount)}
                </Typography>
            </Box>
        ))}
    </Box>
);



const FbRecoupScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const theme = useTheme();

    const {
        plbDetails,
        totalElements,
        queryParams,
        handleRangeChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        handleFilterChange,
        payerOptions,
        stats,
        globalFilters,
        isFetching,
        isCareHospice,
        setSearchTerm,
        filterNpiPtan,
        setFilterNpiPtan,
        brandOrStateOptions,
        applyFilters,
        onSearch,
        searchTerm,
    } = useFbRecoupScreen({ skip });

    const { expandedRows, toggleRow } = useFbRecoupTable();

    const getTypeBadgeColors = (type: string) => {
        const t = type?.toLowerCase() || '';
        if (t.includes('forward')) {
            return { bg: themeConfig.colors.amber + '18', text: themeConfig.colors.amberDark };
        }
        if (t.includes('recoup')) {
            return { bg: themeConfig.colors.accent + '18', text: themeConfig.colors.accentDark };
        }
        return { bg: themeConfig.colors.charts.teal + '18', text: themeConfig.colors.charts.tealDark };
    };

    const columns = useMemo<DataColumn<PlbDetailRecord>[]>(() => [
        {
            id: 'expand',
            label: '',
            align: 'center',
            render: (row) => (
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
                    {expandedRows.has(row.id) ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                </IconButton>
            ),
        },
        {
            id: 'date',
            label: 'DATE',
            align: 'center',
            accessor: (row) => row.date,
            render: (row) => <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatDate(row.date)}</Typography>,
        },
        {
            id: 'transactionNo',
            label: 'TRANSACTION NO.',
            align: 'center',
            accessor: (row) => row.transactionNo,
            render: (row) => <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.transactionNo}</Typography>,
        },
        {
            id: 'type',
            label: 'TYPE',
            align: 'center',
            accessor: (row) => row.type,
            render: (row) => {
                const colors = getTypeBadgeColors(row.type);
                return (
                    <Chip
                        label={row.type}
                        size="small"
                        sx={{ backgroundColor: colors.bg, color: colors.text, fontWeight: 700, fontSize: '10px' }}
                    />
                );
            },
        },
        {
            id: 'state',
            label: isCareHospice ? 'BRAND' : 'STATE',
            align: 'center',
            accessor: (row) => row.state,
            render: (row) => <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.state}</Typography>,
            filterOptions: brandOrStateOptions,
        },
        {
            id: 'payor',
            label: 'PAYOR',
            align: 'center',
            accessor: (row) => row.payor,
            filterOptions: payerOptions,
            render: (row) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.payor}</Typography>,
        },
        {
            id: 'npi',
            label: isCareHospice ? 'PTAN' : 'NPI',
            align: 'center',
            accessor: (row) => row.npi,
            render: (row) => <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.npi}</Typography>,
        },
        {
            id: 'identifier',
            label: 'IDENTIFIER',
            align: 'center',
            accessor: (row) => row.identifier,
            render: (row) => <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.identifier || '-'}</Typography>,
        },
        {
            id: 'amount',
            label: 'AMOUNT',
            align: 'center',
            accessor: (row) => row.amount,
            render: (row) => (
                <Typography variant="body2" sx={{ fontWeight: 700, color: row.amount < 0 ? 'error.main' : 'text.primary' }}>
                    {formatCurrency(row.amount)}
                </Typography>
            ),
        },
        {
            id: 'suspenseBalance',
            label: 'SUSPENSE BALANCE',
            align: 'center',
            accessor: (row) => row.suspenseBalance,
            render: (row) => (
                <Typography variant="body2" sx={{ fontWeight: 700, color: row.suspenseBalance > 0 ? 'primary.main' : 'text.secondary' }}>
                    {formatCurrency(row.suspenseBalance)}
                </Typography>
            ),
        },
        {
            id: 'status',
            label: 'STATUS',
            align: 'center',
            accessor: (row) => row.status,
            render: (row) => <StatusBadge status={row.status} />,
        },
    ], [expandedRows, toggleRow, payerOptions, isCareHospice, brandOrStateOptions]);

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>FB & Recoup</Typography>
                <Typography variant="body2" color="text.secondary">Forward Balance and recoupment transaction details.</Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <SummaryCard title="TOTAL AMOUNT" value={formatCurrency(stats.totalOriginalAmount)} backgroundColor={theme.palette.background.paper} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <SummaryCard title="TOTAL SUSPENSE BALANCE" value={formatCurrency(stats.totalRemainingAmount)} variant="negative" backgroundColor={theme.palette.background.paper} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <SummaryCard title="ACTION REQUIRED" value={String(stats.activeCount)} backgroundColor={theme.palette.background.paper} />
                </Grid>
            </Grid>
                        <styles.ToolbarWrapper>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <styles.SearchField
                                    size="small"
                                    placeholder="Search by Transaction #"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
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
                                    onClick={() => onSearch()}
                                    sx={{ height: '36px', borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 2 }}
                                >
                                    Search
                                </Button>
                            </Box>
                        </styles.ToolbarWrapper>

            <DataTable
                columns={columns}
                data={plbDetails}
                rowKey={(row) => row.id}
                expandedRows={expandedRows}
                expandedContent={(row) => {
                    if (!row.associatedEraFiles || row.associatedEraFiles.length === 0) {
                        return (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">No associated ERA files found.</Typography>
                            </Box>
                        );
                    }
                    return <AssociatedEraFilesSection files={row.associatedEraFiles} isCareHospice={isCareHospice} />;
                }}
                exportTitle="FB & Recoup Details"
                        customToolbarContent={<RangeDropdown value={globalFilters.rangeLabel} onChange={handleRangeChange} />}
                dictionaryId="fb-recoup"
                serverSide
                totalElements={totalElements}
                page={queryParams.page}
                rowsPerPage={queryParams.size}
                sortCol={queryParams.sortField}
                sortDir={queryParams.sortOrder}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                onSortChange={handleSortChange}
                onFilterChange={handleFilterChange}
                download={false}
                loading={isFetching}
                customFilterContent={
                    <FormControl size="small" sx={{ minWidth: 160, maxWidth: 200, flexShrink: 0 }}>
                        <TextField
                            size="small"
                            value={filterNpiPtan}
                            onChange={(e) => setFilterNpiPtan(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    applyFilters();
                                }
                            }}
                            placeholder={isCareHospice ? 'All PTAN' : 'All NPI'}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" sx={{ m: 0, p: 0 }}>
                                        <IconButton 
                                            size="small" 
                                            onClick={applyFilters} 
                                            sx={{ p: '4px' }}
                                        >
                                            <SearchIcon fontSize="small" color="primary" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: {
                                    pr: '4px',
                                    '& .MuiOutlinedInput-input': {
                                        py: '8.5px',
                                    }
                                }
                            }}
                        />
                    </FormControl>
                }
                additionalFilterCount={(searchTerm ? 1 : 0) + (filterNpiPtan ? 1 : 0)}
            />
        </Box>
    );
};

export default FbRecoupScreen;
