import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { themeConfig } from '@/theme/themeConfig';

export interface RangeDropdownProps {
    value?: string;
    onChange?: (val: string) => void;
    options?: string[];
}

const RangeDropdown: React.FC<RangeDropdownProps> = ({
    value = '6 months',
    onChange,
    options = ['1 month', '3 months', '6 months', '1 year', 'YTD', 'All Time']
}) => {
    const [internalVal, setInternalVal] = useState(value);

    const handleChange = (e: SelectChangeEvent) => {
        setInternalVal(e.target.value);
        onChange?.(e.target.value);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
                Range:
            </Typography>
            <Select
                size="small"
                value={internalVal}
                onChange={handleChange}
                sx={{
                    height: 28,
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
    );
};

export default RangeDropdown;
