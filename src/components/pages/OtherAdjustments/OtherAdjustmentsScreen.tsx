import React, { useMemo } from 'react';
import { Typography, Chip, useTheme, Box } from '@mui/material';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { OtherAdjustmentRecord } from '@/interfaces/financials';
import { formatCurrency } from '@/utils/formatters';
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
        handleSortChange,
        onPageChange,
        onRowsPerPageChange,
        isError,
    } = useOtherAdjustmentsScreen({ skip });

    const columns = useMemo<DataColumn<OtherAdjustmentRecord>[]>(() => [
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 60,
            render: (r) => (
                <RowActionMenu
                    onView={() => handleDrillDown(r)}
                // onEdit={() => handleEdit(r)}
                // onDelete={() => handleDelete(r.id)}
                />
            ),
        },
        { id: 'adjustmentId', label: 'Transaction Number', minWidth: 160, accessor: (r) => r.adjustmentId, render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.adjustmentId}</Typography> },
        { id: 'effectiveDate', label: 'Effective Date', minWidth: 120, accessor: (r) => r.effectiveDate, render: (r) => r.effectiveDate },
        {
            id: 'type',
            label: 'Type',
            minWidth: 140,
            accessor: (r) => r.type,
            filterOptions: ['WRITE-OFF', 'CREDIT', 'INTEREST', 'CONTRACTUAL', 'REFUND', 'TRANSFER', 'RECLASSIFICATION', 'CHARITY'],
            render: (r) => <Chip label={r.type} size="small" sx={styles.adjustmentChipStyles(r.type)} />,
        },
        // { id: 'description', label: 'Description', minWidth: 240, accessor: (r) => r.description, render: (r) => r.description },
        { id: 'sourceProvider', label: 'Source / Provider', minWidth: 160, accessor: (r) => r.sourceProvider, filterOptions: ['HOSPICE OF THE SOUTH', 'UNITED HEALTHCARE', 'AETNA'], render: (r) => r.sourceProvider },
        {
            id: 'amount',
            label: 'Amount',
            minWidth: 120,
            align: 'right',
            accessor: (r) => r.amount,
            render: (r) => (
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: r.amount < 0 ? theme.palette.error.main : r.amount > 0 ? theme.palette.success.main : theme.palette.text.primary }}>
                    {formatCurrency(r.amount)}
                </Typography>
            ),
        },
        { id: 'referenceId', label: 'Reference ID', minWidth: 110, accessor: (r) => r.referenceId, render: (r) => r.referenceId },
        { id: 'status', label: 'Status', minWidth: 120, accessor: (r) => r.status, filterOptions: ['Applied', 'Pending', 'Under Review'], render: (r) => <StatusBadge status={r.status} /> },
    ], [theme, handleDrillDown, handleEdit, handleDelete]);

    if (isError) return <Box sx={{ p: 4, color: 'error.main' }}>Error loading adjustments.</Box>;

    return (
        <DataTable
            columns={columns}
            data={adjustments}
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
            download={false}
        />
    );
};

export default OtherAdjustmentsScreen;

