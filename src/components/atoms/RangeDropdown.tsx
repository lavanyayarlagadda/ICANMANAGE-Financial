import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, SelectChangeEvent, TextField } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';
import { subMonths, subYears, format, startOfMonth } from 'date-fns';

export interface RangeDropdownProps {
    value?: string;
    onChange?: (val: string) => void;
    options?: string[];
}

const RangeDropdown: React.FC<RangeDropdownProps> = ({
    value = '6 months',
    onChange,
    options = ['1 month', '3 months', '6 months', '1 year', 'All Time', 'Custom']
}) => {
    const [internalVal, setInternalVal] = useState(value);
    const [fromDate, setFromDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const calculateDates = (range: string) => {
        const to = new Date();
        let from;
        switch (range) {
            case '1 month': from = subMonths(to, 1); break;
            case '3 months': from = subMonths(to, 3); break;
            case '6 months': from = subMonths(to, 6); break;
            case '1 year': from = subYears(to, 1); break;
            case 'All Time': from = startOfMonth(to); break; // Dynamic: Start of Current Month
            default: return null;
        }
        return {
            from: format(from || to, 'yyyy-MM-dd'),
            to: format(to, 'yyyy-MM-dd')
        };
    };

    // Initial population
    useEffect(() => {
        if (internalVal === 'All Time' || internalVal === 'Custom') {
            setFromDate(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
            setToDate(format(new Date(), 'yyyy-MM-dd'));
        } else {
            const dates = calculateDates(internalVal);
            if (dates) {
                setFromDate(dates.from);
                setToDate(dates.to);
            }
        }
    }, []);

    const handleChange = (e: SelectChangeEvent) => {
        const val = e.target.value;
        setInternalVal(val);
        const dates = calculateDates(val);
        if (dates) {
            setFromDate(dates.from);
            setToDate(dates.to);
            onChange?.(`${dates.from} to ${dates.to}`);
        } else if (val !== 'Custom') {
            onChange?.(val);
        }
    };

    const handleDateChange = (type: 'from' | 'to', val: string) => {
        setInternalVal('Custom');
        if (type === 'from') {
            setFromDate(val);
            if (val && toDate) onChange?.(`${val} to ${toDate}`);
        } else {
            setToDate(val);
            if (fromDate && val) onChange?.(`${fromDate} to ${val}`);
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Range:
                </Typography>
                <Select
                    size="small"
                    value={internalVal}
                    onChange={handleChange}
                    sx={{
                        height: 32,
                        minWidth: 120,
                        fontSize: '0.85rem',
                        backgroundColor: '#fff',
                        borderRadius: 1.5,
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: themeConfig.colors.border,
                        },
                    }}
                >
                    {options.map((opt) => (
                        <MenuItem key={opt} value={opt} sx={{ fontSize: '0.85rem' }}>
                            {opt}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>FROM</Typography>
                    <TextField
                        type="date"
                        size="small"
                        value={fromDate}
                        onChange={(e) => handleDateChange('from', e.target.value)}
                        sx={{
                            '& .MuiInputBase-root': { height: 32, fontSize: '0.75rem', borderRadius: 1.5, width: 130 },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: themeConfig.colors.border }
                        }}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>TO</Typography>
                    <TextField
                        type="date"
                        size="small"
                        value={toDate}
                        onChange={(e) => handleDateChange('to', e.target.value)}
                        sx={{
                            '& .MuiInputBase-root': { height: 32, fontSize: '0.75rem', borderRadius: 1.5, width: 130 },
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: themeConfig.colors.border }
                        }}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default RangeDropdown;

