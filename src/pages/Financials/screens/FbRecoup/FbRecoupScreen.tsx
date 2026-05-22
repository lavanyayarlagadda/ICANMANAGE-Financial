import React, { useMemo, useState } from 'react';
import { Box, Typography, IconButton, Chip, Grid, Button, InputAdornment, TextField, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
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

const advancedInputStyles = {
    bgcolor: '#ffffff',
    borderRadius: '6px',
    '& .MuiOutlinedInput-root': {
        height: '36px',
        fontSize: '13px',
        color: '#0f172a',
        '& fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.15)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(0, 0, 0, 0.3)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
        },
    },
};

const FbRecoupScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const theme = useTheme();
    const [showAdvanced, setShowAdvanced] = useState(false);

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
        searchTerm,
        setSearchTerm,
        filterPayor,
        setFilterPayor,
        filterNpiPtan,
        setFilterNpiPtan,
        filterStateBrand,
        setFilterStateBrand,
        brandOrStateOptions,
        applyFilters,
        clearFilters
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
        return { bg: themeConfig.colors.teal + '18', text: themeConfig.colors.tealDark };
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
    ], [expandedRows, toggleRow, payerOptions, isCareHospice]);

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>FB & Recoup</Typography>
                <Typography variant="body2" color="text.secondary">Forward Balance and recoupment transaction details.</Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <SummaryCard title="TOTAL AMOUNT" value={formatCurrency(stats.totalAmount)} backgroundColor={theme.palette.background.paper} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <SummaryCard title="TOTAL SUSPENSE BALANCE" value={formatCurrency(stats.totalSuspenseBalance)} variant="negative" backgroundColor={theme.palette.background.paper} />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <SummaryCard title="ACTIVE RECORDS" value={String(stats.activeCount)} backgroundColor={theme.palette.background.paper} />
                </Grid>
            </Grid>

            <styles.ToolbarWrapper>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}>
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
                        onClick={applyFilters}
                        sx={{ height: '36px', borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 2 }}
                    >
                        Search
                    </Button>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            cursor: 'pointer',
                            color: 'primary.main',
                            fontWeight: 700,
                            fontSize: '13px',
                            ml: 2,
                            userSelect: 'none',
                            '&:hover': { opacity: 0.8, textDecoration: 'underline' }
                        }}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        {showAdvanced ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                        Advanced Search
                    </Box>
                </Box>
            </styles.ToolbarWrapper>

            {showAdvanced && (
                <Box
                    sx={{
                        bgcolor: themeConfig.colors.slate[800],
                        color: '#ffffff',
                        borderRadius: '8px',
                        p: 3,
                        mb: 3,
                        position: 'relative',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: themeConfig.shadows.elevated
                    }}
                >
                    <IconButton
                        size="small"
                        onClick={() => setShowAdvanced(false)}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': { color: '#ffffff' }
                        }}
                    >
                        <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>

                    <Grid container spacing={3}>
                        {/* Row 1 */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block', color: 'rgba(255, 255, 255, 0.85)', fontSize: '11px', textTransform: 'uppercase' }}>
                                Payor
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                value={filterPayor}
                                onChange={(e) => setFilterPayor(e.target.value)}
                                sx={advancedInputStyles}
                            >
                                <MenuItem value="All">All Payors Selected</MenuItem>
                                {payerOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block', color: 'rgba(255, 255, 255, 0.85)', fontSize: '11px', textTransform: 'uppercase' }}>
                                Transaction No.
                            </Typography>
                            <TextField
                                placeholder="Transaction No."
                                fullWidth
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                sx={advancedInputStyles}
                            />
                        </Grid>

                        {/* Row 2 */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block', color: 'rgba(255, 255, 255, 0.85)', fontSize: '11px', textTransform: 'uppercase' }}>
                                {isCareHospice ? 'PTAN' : 'NPI'}
                            </Typography>
                            <TextField
                                placeholder={isCareHospice ? 'PTAN' : 'NPI'}
                                fullWidth
                                size="small"
                                value={filterNpiPtan}
                                onChange={(e) => setFilterNpiPtan(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                sx={advancedInputStyles}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.8, display: 'block', color: 'rgba(255, 255, 255, 0.85)', fontSize: '11px', textTransform: 'uppercase' }}>
                                {isCareHospice ? 'Brand' : 'State'}
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                size="small"
                                value={filterStateBrand}
                                onChange={(e) => setFilterStateBrand(e.target.value)}
                                sx={advancedInputStyles}
                            >
                                <MenuItem value="All">{isCareHospice ? 'Select Brand' : 'Select State'}</MenuItem>
                                {brandOrStateOptions.map((opt) => (
                                    <MenuItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={clearFilters}
                            sx={{
                                color: '#ffffff',
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                    borderColor: '#ffffff',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Clear Filters
                        </Button>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={applyFilters}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3
                            }}
                        >
                            Apply Search
                        </Button>
                    </Box>
                </Box>
            )}

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
            />
        </Box>
    );
};

export default FbRecoupScreen;
