import React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
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
  options = ['MTD', '1 month', '3 months', '6 months', '1 year', 'Custom'],
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
    setErrorOpen,
  } = useRangeDropdown({ value, onChange });

  return (
    <styles.ContainerBox>
      <styles.RangeBox>
        <styles.LabelTypography variant="body2" color="text.secondary">
          Range:
        </styles.LabelTypography>
        <styles.StyledSelect
          size="small"
          value={internalVal}
          onChange={(e) => handleRangeChange(e.target.value as string)}
        >
          {options.map((opt) => (
            <styles.StyledMenuItem key={opt} value={opt}>
              {opt}
            </styles.StyledMenuItem>
          ))}
        </styles.StyledSelect>
      </styles.RangeBox>

      <styles.DatePickersContainer>
        <styles.DatePickerItem>
          <styles.DateLabelTypography variant="caption" color="text.secondary">
            FROM
          </styles.DateLabelTypography>
          <styles.StyledDatePicker
            value={fromDate}
            onChange={(val) => handleDateChange('from', val)}
            slotProps={{
              ...styles.slotProps(isMobile),
              textField: {
                ...styles.slotProps(isMobile).textField,
                error: errorOpen,
              },
            }}
          />
        </styles.DatePickerItem>
        <styles.DatePickerItem>
          <styles.DateLabelTypography variant="caption" color="text.secondary">
            TO
          </styles.DateLabelTypography>
          <styles.StyledDatePicker
            value={toDate}
            onChange={(val) => handleDateChange('to', val)}
            slotProps={{
              ...styles.slotProps(isMobile),
              textField: {
                ...styles.slotProps(isMobile).textField,
                error: errorOpen,
              },
            }}
          />
        </styles.DatePickerItem>
      </styles.DatePickersContainer>
      <styles.StyledSnackbar
        open={errorOpen}
        autoHideDuration={4000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <styles.StyledAlert onClose={() => setErrorOpen(false)} severity="error" variant="filled">
          From Date cannot be after To Date
        </styles.StyledAlert>
      </styles.StyledSnackbar>
    </styles.ContainerBox>
  );
};

export default RangeDropdown;
