import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, SelectChangeEvent, useTheme, useMediaQuery } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { themeConfig } from '@/theme/themeConfig';
import { subMonths, subYears, format, startOfMonth, parse } from 'date-fns';

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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [internalVal, setInternalVal] = useState(value);
    
    const [fromDate, setFromDate] = useState<Date | null>(startOfMonth(new Date()));
    const [toDate, setToDate] = useState<Date | null>(new Date());

    const calculateDates = (range: string) => {
        const to = new Date();
        let from;
        switch (range) {
            case '1 month': from = subMonths(to, 1); break;
            case '3 months': from = subMonths(to, 3); break;
            case '6 months': from = subMonths(to, 6); break;
            case '1 year': from = subYears(to, 1); break;
            case 'All Time': from = new Date(2020, 0, 1); break; // Default to 2020 for all time
            default: return null;
        }
        return { from, to };
    };

    useEffect(() => {
        if (internalVal !== 'Custom') {
            const dates = calculateDates(internalVal);
            if (dates) {
                setFromDate(dates.from);
                setToDate(dates.to);
                // Important: Notify parent of initial values
                onChange?.(`${format(dates.from, 'yyyy-MM-dd')} to ${format(dates.to, 'yyyy-MM-dd')}`);
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
            onChange?.(`${format(dates.from, 'yyyy-MM-dd')} to ${format(dates.to, 'yyyy-MM-dd')}`);
        } else {
            // If custom or unknown, we don't necessarily call onChange with dates here 
            // unless the date pickers are also updated.
            if (val !== 'Custom') onChange?.(val);
        }
    };

    const handleDateChange = (type: 'from' | 'to', val: Date | null) => {
        setInternalVal('Custom');
        if (type === 'from') {
            setFromDate(val);
            if (val && toDate) onChange?.(`${format(val, 'yyyy-MM-dd')} to ${format(toDate, 'yyyy-MM-dd')}`);
        } else {
            setToDate(val);
            if (fromDate && val) onChange?.(`${format(fromDate, 'yyyy-MM-dd')} to ${format(val, 'yyyy-MM-dd')}`);
        }
    };

    // Custom styles to match the mobile screenshot's vibrant header
    const datePickerSx = {
        '& .MuiInputBase-root': { 
            height: 32, 
            fontSize: '0.75rem', 
            borderRadius: 1.5, 
            width: isMobile ? '100%' : 140,
            backgroundColor: '#fff',
        },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: themeConfig.colors.border },
        flex: isMobile ? 1 : 'unset',
    };

    const slotProps = {
        textField: { size: 'small' as const, sx: datePickerSx },
        desktopPaper: {
            sx: {
                '& .MuiPickersLayout-root': {
                    backgroundColor: '#fff',
                },
                '& .MuiPickersToolbar-root': {
                    backgroundColor: themeConfig.colors.accent, // Matching the orange/brown header from screenshot
                    color: '#fff',
                },
                '& .MuiDateCalendar-root': {
                   '& .MuiPickersDay-root.Mui-selected': {
                       backgroundColor: themeConfig.colors.accent,
                   }
                }
            }
        },
        mobilePaper: {
            sx: {
                '& .MuiPickersToolbar-root': {
                    backgroundColor: themeConfig.colors.accent,
                    color: '#fff',
                },
                '& .MuiPickersDay-root.Mui-selected': {
                    backgroundColor: themeConfig.colors.accent,
                },
                '& .MuiButtonBase-root': {
                    color: themeConfig.colors.accent,
                }
            }
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

            <Box sx={{ 
                display: 'flex', 
                alignItems: isMobile ? 'flex-start' : 'center', 
                gap: isMobile ? 1 : 2,
                flexDirection: isMobile ? 'column' : 'row',
                width: isMobile ? '100%' : 'auto'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: isMobile ? '100%' : 'auto' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, minWidth: 40 }}>FROM</Typography>
                    <DatePicker
                        value={fromDate}
                        onChange={(val) => handleDateChange('from', val)}
                        slotProps={slotProps}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: isMobile ? '100%' : 'auto' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, minWidth: 40 }}>TO</Typography>
                    <DatePicker
                        value={toDate}
                        onChange={(val) => handleDateChange('to', val)}
                        slotProps={slotProps}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default RangeDropdown;

