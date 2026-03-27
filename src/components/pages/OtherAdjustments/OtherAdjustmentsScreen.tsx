import React, { useMemo } from 'react';
import { Typography, Chip, useTheme } from '@mui/material';
import DataTable from '@/components/molecules/DataTable/DataTable';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import RangeDropdown from '@/components/atoms/RangeDropdown/RangeDropdown';
import StatusBadge from '@/components/atoms/StatusBadge/StatusBadge';
import RowActionMenu from '@/components/molecules/RowActionMenu/RowActionMenu';
import { OtherAdjustmentRecord } from '@/interfaces/financials';
import { formatCurrency } from '@/utils/formatters';
import { useOtherAdjustmentsScreen } from './OtherAdjustmentsScreen.hook';
import * as styles from './OtherAdjustmentsScreen.styles';

const OtherAdjustmentsScreen: React.FC = () => {
    const theme = useTheme();
    const {
        otherAdjustments,
        handleView,
        handleEdit,
        handleDelete,
    } = useOtherAdjustmentsScreen();

    const columns = useMemo<DataColumn<OtherAdjustmentRecord>[]>(() => [
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 60,
            render: (r) => (
                <RowActionMenu
                    onView={() => handleView(r as unknown as Record<string, unknown>)}
                    onEdit={() => handleEdit(r as unknown as Record<string, unknown>)}
                    onDelete={() => handleDelete(r.id)}
                />
            ),
        },
        { id: 'adjustmentId', label: 'Adjustment ID', minWidth: 140, render: (r) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.adjustmentId}</Typography> },
        { id: 'effectiveDate', label: 'Effective Date', minWidth: 120 },
        {
            id: 'type',
            label: 'Type',
            minWidth: 140,
            filterOptions: ['WRITE-OFF', 'CREDIT', 'INTEREST', 'CONTRACTUAL', 'REFUND', 'TRANSFER', 'RECLASSIFICATION', 'CHARITY'],
            render: (r) => <Chip label={r.type} size="small" sx={styles.adjustmentChipStyles(r.type)} />,
        },
        { id: 'description', label: 'Description', minWidth: 240 },
        { id: 'sourceProvider', label: 'Source / Provider', minWidth: 160 },
        {
            id: 'amount',
            label: 'Amount',
            minWidth: 120,
            align: 'right',
            render: (r) => (
                <Typography variant="body2" sx={styles.amountStyles(r.amount, theme)}>
                    {formatCurrency(r.amount)}
                </Typography>
            ),
        },
        { id: 'referenceId', label: 'Reference ID', minWidth: 110 },
        { id: 'status', label: 'Status', minWidth: 120, filterOptions: ['Applied', 'Pending', 'Under Review'], render: (r) => <StatusBadge status={r.status} /> },
    ], [theme, handleView, handleEdit, handleDelete]);

    return (
        <DataTable
            columns={columns}
            data={otherAdjustments}
            rowKey={(r) => r.id}
            exportTitle="Other Adjustments"
            customToolbarContent={<RangeDropdown />}
            dictionaryId="other-adjustments"
        />
    );
};

export default OtherAdjustmentsScreen;

