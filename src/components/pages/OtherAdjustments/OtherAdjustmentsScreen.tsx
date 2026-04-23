import React, { useMemo } from 'react';
import { Typography, Chip, useTheme, Box, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { OtherAdjustmentRecord } from '@/interfaces/financials';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { useOtherAdjustmentsScreen } from './OtherAdjustmentsScreen.hook';
import * as styles from './OtherAdjustmentsScreen.styles';

const OtherAdjustmentsScreen: React.FC<{ skip?: boolean }> = ({ skip = false }) => {
    const theme = useTheme();
    const {
        adjustments,
        totalElements,
        queryParams,
        handleDrillDown,
        handleEdit,
        handleDelete,
        handleRangeChange,
        handleFilterChange,
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        isError,
        searchTerm,
        setSearchTerm,
        onSearch
    } = useOtherAdjustmentsScreen({ skip });

    const columns = useMemo<DataColumn<OtherAdjustmentRecord>[]>(() => [
        {
            id: 'actions',
            label: 'ACTIONS',
            minWidth: 60,
            render: (r) => (
                <RowActionMenu
                    onView={() => handleDrillDown(r)}
                />
            ),
        },
        { id: 'adjustmentId', label: 'TRANSACTION NUMBER', minWidth: 160, accessor: (r) => r.adjustmentId, render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.adjustmentId}</Typography> },
        { id: 'effectiveDate', label: 'EFFECTIVE DATE', minWidth: 120, accessor: (r) => r.effectiveDate, render: (r) => formatDate(r.effectiveDate) },
        {
            id: 'type',
            label: 'TYPE',
            minWidth: 140,
            accessor: (r) => r.type,
            filterOptions: ['WRITE-OFF', 'CREDIT', 'INTEREST', 'CONTRACTUAL', 'REFUND', 'TRANSFER', 'RECLASSIFICATION', 'CHARITY'],
            render: (r) => <Chip label={r.type} size="small" sx={styles.adjustmentChipStyles(r.type)} />,
        },
        // { id: 'description', label: 'DESCRIPTION', minWidth: 240, accessor: (r) => r.description, render: (r) => r.description },
        { id: 'sourceProvider', label: 'SOURCE / PROVIDER', minWidth: 160, accessor: (r) => r.sourceProvider, filterOptions: ['HOSPICE OF THE SOUTH', 'UNITED HEALTHCARE', 'AETNA'], render: (r) => r.sourceProvider },
        {
            id: 'amount',
            label: 'AMOUNT',
            minWidth: 120,
            align: 'right',
            accessor: (r) => r.amount,
            render: (r) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: r.amount < 0 ? theme.palette.error.main : r.amount > 0 ? theme.palette.success.main : theme.palette.text.primary }}>
                    {formatCurrency(r.amount)}
                </Typography>
            ),
        },
        { id: 'referenceId', label: 'REFERENCE ID', minWidth: 110, accessor: (r) => r.referenceId, render: (r) => r.referenceId },
        { id: 'status', label: 'STATUS', minWidth: 120, accessor: (r) => r.status, filterOptions: ['Applied', 'Pending', 'Under Review'], render: (r) => <StatusBadge status={r.status} /> },
    ], [theme, handleDrillDown, handleEdit, handleDelete]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', minHeight: 0 }}>
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
                data={adjustments || []}
                rowKey={(r) => r.id}
                exportTitle="Other Adjustments"
                customToolbarContent={<RangeDropdown onChange={handleRangeChange} />}
                dictionaryId="other-adjustments"
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
            />
        </Box>
    );
};

export default OtherAdjustmentsScreen;
