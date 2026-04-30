import React, { useMemo } from 'react';
import {
    Box,
    Chip,
    Typography,
    useTheme,
    IconButton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { BankDepositItem } from '@/interfaces/financials';
import { DataColumn } from '@/components/molecules/DataTable/DataTable.hook';
import { themeConfig } from '@/theme/themeConfig';

import { DynamicColumn } from '@/interfaces/api/common';

interface UseBankDepositColumnsProps {
    expandedRows: Set<string>;
    toggleRow: (id: string) => void;
    dynamicColumns: DynamicColumn[];
    isHeadersSuccess: boolean;
    payerOptions: { label: string; value: string }[];
    statusOptions: string[];
}

export const useBankDepositColumns = ({
    expandedRows,
    toggleRow,
    dynamicColumns,
    isHeadersSuccess,
    payerOptions,
    statusOptions,
}: UseBankDepositColumnsProps) => {
    const theme = useTheme();

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
            baiAmount: {
                id: 'baiAmount',
                label: 'BANK AMT',
                align: 'center',
                accessor: (row) => row.baiAmount,
                render: (row) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(row.baiAmount)}</Typography>,
            },
            remitAmount: {
                id: 'remitAmount',
                label: 'REMITTANCE',
                align: 'center',
                accessor: (row) => row.remitAmount,
                render: (row) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(row.remitAmount)}</Typography>,
            },
            variance: {
                id: 'variance',
                label: 'VARIANCE',
                align: 'center',
                accessor: (row) => row.varianceAmount,
                disableSort: true,
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
                accessor: (row) => row.status,
                filterOptions: statusOptions,
                render: (row) => {
                    const isZeroTransaction = row.transactionNo === "No Transaction#";
                    if (isZeroTransaction) {
                        const status = row.status;
                        if (!status) return '-';
                        const isMatched = status === 'Matched' || status === 'Reconciled';
                        const statusColors = isMatched ? themeConfig.status.match : themeConfig.status.critical;
                        return <Chip label={status} sx={{ backgroundColor: statusColors.bg, color: statusColors.text, border: `1px solid ${theme.palette.divider}` }} icon={isMatched ? <CheckCircleOutlineIcon sx={{ fontSize: '14px !important' }} /> : <ErrorOutlineIcon sx={{ fontSize: '14px !important' }} />} />;
                    }
                    if (!row.variance1Status && !row.variance2Status) return '-';
                    return (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {row.variance1Status && (
                                <Chip
                                    label={row.variance1Status}
                                    sx={{
                                        backgroundColor: themeConfig.colors.slate[50],
                                        color: themeConfig.colors.success,
                                        fontWeight: 500,
                                    }}
                                />
                            )}
                            {row.variance2Status && (
                                <Chip
                                    label={row.variance2Status}
                                    sx={{
                                        backgroundColor: themeConfig.status.critical,
                                        color: themeConfig.colors.warning,
                                        fontWeight: 500,
                                    }}
                                />
                            )}
                        </Box>
                    );
                },
            },
        };

        if (!isHeadersSuccess || !dynamicColumns || dynamicColumns.length === 0) {
            return [baseColumns.expand];
        }

        const mappedColumns: DataColumn<BankDepositItem>[] = dynamicColumns.map(dc => {
            const mappedId = dc.displayName
                .toLowerCase()
                .replace(/[^a-z0-9]+(.)/g, (_: string, chr: string) => chr.toUpperCase())
                .replace(/^(.)/, (_: string, chr: string) => chr.toLowerCase());

            const lowerName = dc.displayName.toLowerCase();
            
            const base = Object.values(baseColumns).find(c => {
                const cid = c.id.toLowerCase();
                if (lowerName.includes('status')) return cid === 'status';
                if (lowerName.includes('payer') || lowerName.includes('payor')) return cid === 'payername';
                if (lowerName.includes('bank') || lowerName.includes('amount') || lowerName.includes('deposit')) return cid === 'baiamount';
                if (lowerName.includes('remittance')) return cid === 'remitamount';
                if (lowerName.includes('variance')) return cid === 'variance';
                if (lowerName.includes('trans') || (lowerName.includes('check') && !lowerName.includes('pay'))) return cid === 'transactionno';
                if (lowerName.includes('ref') || (lowerName.includes('date') && !lowerName.includes('received'))) return cid === 'reference';
                return false;
            });

            const actualField = base ? base.id : mappedId;

            if (base) {
                return {
                    ...base,
                    label: dc.displayName.toUpperCase(),
                    accessor: (row: BankDepositItem) => {
                        const val = (row as unknown as Record<string, unknown>)[actualField];
                        if (typeof val === 'string' || typeof val === 'number' || val === null) return val;
                        return (base.accessor ? (base.accessor(row) as string | number | null) : null);
                    },
                    render: (row: BankDepositItem) => {
                        const val = (row as unknown as Record<string, unknown>)[actualField];
                        if (typeof val === 'number' && (actualField.toLowerCase().includes('amt') || actualField.toLowerCase().includes('amount') || actualField.toLowerCase().includes('variance') || actualField.toLowerCase().includes('remit') || actualField.toLowerCase().includes('deposit'))) {
                            return <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(val)}</Typography>;
                        }
                        return base.render ? base.render(row) : <Typography variant="body2">{val !== null && val !== undefined ? String(val) : '-'}</Typography>;
                    },
                    filterOptions: actualField === 'payerName' ? payerOptions : (actualField === 'status' ? statusOptions : base.filterOptions)
                };
            }

            return {
                id: mappedId,
                label: dc.displayName.toUpperCase(),
                align: 'center',
                accessor: (row: BankDepositItem) => {
                    const val = (row as unknown as Record<string, unknown>)[mappedId];
                    return (typeof val === 'string' || typeof val === 'number' || val === null) ? val : null;
                },
                render: (row: BankDepositItem) => {
                    const val = (row as unknown as Record<string, unknown>)[mappedId];
                    if (typeof val === 'number' && (mappedId.toLowerCase().includes('amt') || mappedId.toLowerCase().includes('amount') || mappedId.toLowerCase().includes('variance'))) {
                        return <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(val)}</Typography>;
                    }
                    if (mappedId.toLowerCase().includes('date') && val) {
                        return <Typography variant="body2">{formatDate(String(val))}</Typography>;
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

    return { columns };
};
