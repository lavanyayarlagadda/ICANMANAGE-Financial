import React from 'react';
import { Box, Typography, Select, MenuItem, useTheme, useMediaQuery, Snackbar, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRangeDropdown } from './RangeDropdown.hook';
import * as styles from './RangeDropdown.styles';

export interface RangeDropdownProps {
  value?: string;
  onChange?: (val: string) => void;
  options?: string[];
}

const RangeDropdown: React.FC<RangeDropdownProps> = ({
  value = '1 month',
  onChange,
  options = ['MTD', '1 month', '3 months', '6 months', '1 year', 'Custom']
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    internalVal,
    fromDate,
    toDate,
    handleRangeChange,
    handleDateChange,
    errorOpen,
    setErrorOpen
  } = useRangeDropdown({ value, onChange });

  return (
    <Box sx={styles.containerStyles}>
      <Box sx={styles.rangeBoxStyles}>
        <Typography variant="body2" color="text.secondary" sx={styles.labelStyles}>
          Range:
        </Typography>
        <Select
          size="small"
          value={internalVal}
          onChange={(e) => handleRangeChange(e.target.value)}
          sx={styles.selectStyles}
        >
          {options.map((opt) => (
            <MenuItem key={opt} value={opt} sx={{ fontSize: '0.85rem' }}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={styles.datePickersContainerStyles(isMobile)}>
        <Box sx={styles.datePickerItemStyles(isMobile)}>
          <Typography variant="caption" color="text.secondary" sx={styles.dateLabelStyles}>FROM</Typography>
          <DatePicker
            value={fromDate}
            onChange={(val) => handleDateChange('from', val)}
            slotProps={{
              ...styles.slotProps(isMobile),
              textField: {
                ...styles.slotProps(isMobile).textField,
                error: errorOpen
              }
            }}
          />
        </Box>
        <Box sx={styles.datePickerItemStyles(isMobile)}>
          <Typography variant="caption" color="text.secondary" sx={styles.dateLabelStyles}>TO</Typography>
          <DatePicker
            value={toDate}
            onChange={(val) => handleDateChange('to', val)}
            slotProps={{
              ...styles.slotProps(isMobile),
              textField: {
                ...styles.slotProps(isMobile).textField,
                error: errorOpen
              }
            }}
          />
        </Box>
      </Box>
      <Snackbar
        open={errorOpen}
        autoHideDuration={4000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setErrorOpen(false)} severity="error" variant="filled" sx={{ width: '100%' }}>
          From Date cannot be after To Date
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RangeDropdown;

