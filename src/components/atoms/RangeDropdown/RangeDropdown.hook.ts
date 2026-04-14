import { useState, useEffect, useCallback } from 'react';
import { format, isAfter } from 'date-fns';
import { calculateDatesFromLabel, getInitialCustomRange } from '@/utils/dateUtils';

export interface UseRangeDropdownProps {
  value: string;
  onChange?: (val: string) => void;
}

export const useRangeDropdown = ({ value, onChange }: UseRangeDropdownProps) => {
  const [internalVal, setInternalVal] = useState(value);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  
  // Store custom dates separately to restore them when switching back to 'Custom'
  const [customRange, setCustomRange] = useState<{from: Date | null, to: Date | null}>(getInitialCustomRange());
  
  const [errorOpen, setErrorOpen] = useState(false);

  // Sync internal value with prop
  useEffect(() => {
    setInternalVal(value);
  }, [value]);

  // Set initial dates based on value prop on mount
  useEffect(() => {
    if (value !== 'Custom' && !value.includes(' to ')) {
      const dates = calculateDatesFromLabel(value);
      if (dates) {
        setFromDate(new Date(dates.from));
        setToDate(new Date(dates.to));
      }
    } else if (value.includes(' to ')) {
        const [from, to] = value.split(' to ');
        setFromDate(new Date(from));
        setToDate(new Date(to));
        setInternalVal('Custom');
    } else {
      setFromDate(customRange.from);
      setToDate(customRange.to);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRangeChange = useCallback((val: string) => {
    setInternalVal(val);
    
    if (val === 'Custom') {
      // Restore previous custom dates
      setFromDate(customRange.from);
      setToDate(customRange.to);
      if (customRange.from && customRange.to) {
        onChange?.(`${format(customRange.from, 'yyyy-MM-dd')} to ${format(customRange.to, 'yyyy-MM-dd')}`);
      }
    } else {
      const dates = calculateDatesFromLabel(val);
      if (dates) {
        setFromDate(new Date(dates.from));
        setToDate(new Date(dates.to));
        // Pass the LABEL instead of dates for presets
        onChange?.(val);
      } else {
        onChange?.(val);
      }
    }
  }, [onChange, customRange]);

  const handleDateChange = useCallback((type: 'from' | 'to', val: Date | null) => {
    if (!val) return;

    if (type === 'from') {
      if (toDate && isAfter(val, toDate)) {
        setErrorOpen(true);
        return;
      }
      setInternalVal('Custom');
      setFromDate(val);
      setCustomRange(prev => ({ ...prev, from: val }));
      if (toDate) onChange?.(`${format(val, 'yyyy-MM-dd')} to ${format(toDate, 'yyyy-MM-dd')}`);
    } else {
      if (fromDate && isAfter(fromDate, val)) {
        setErrorOpen(true);
        return;
      }
      setInternalVal('Custom');
      setToDate(val);
      setCustomRange(prev => ({ ...prev, to: val }));
      if (fromDate) onChange?.(`${format(fromDate, 'yyyy-MM-dd')} to ${format(val, 'yyyy-MM-dd')}`);
    }
  }, [fromDate, toDate, onChange]);

  return {
    internalVal,
    fromDate,
    toDate,
    handleRangeChange,
    handleDateChange,
    errorOpen,
    setErrorOpen
  };
};
