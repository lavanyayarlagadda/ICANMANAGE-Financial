import { useState, useEffect, useCallback } from 'react';
import { format, isAfter } from 'date-fns';
import { calculateDatesFromLabel, getInitialCustomRange } from '@/utils/dateUtils';
import { RootState, useAppSelector } from '@/store';

export interface UseRangeDropdownProps {
  value: string;
  onChange?: (val: string) => void;
}

export const useRangeDropdown = ({ value, onChange }: UseRangeDropdownProps) => {
  const { globalFilters } = useAppSelector((s: RootState) => s.financials);
  const [internalVal, setInternalVal] = useState(value);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  

  
  // Store custom dates separately to restore them when switching back to 'Custom'
  const [customRange, setCustomRange] = useState<{from: Date | null, to: Date | null}>(getInitialCustomRange());
  
  const [errorOpen, setErrorOpen] = useState(false);

  // Sync internal value and dates with prop.
  // Only react to incoming value changes to avoid resetting picker month
  // while the user is interacting with calendar navigation.
  useEffect(() => {
    setInternalVal(value);
    
    if (value !== 'Custom' && !value.includes(' to ')) {
      const dates = calculateDatesFromLabel(value);
      if (dates) {
        setFromDate(new Date(dates.from));
        setToDate(new Date(dates.to));
      }
    } else if (value.includes(' to ')) {
        const [from, to] = value.split(' to ');
        const fDate = new Date(from);
        const tDate = new Date(to);
        setFromDate(fDate);
        setToDate(tDate);
        setCustomRange({ from: fDate, to: tDate });
        setInternalVal('Custom');
    } else {
      // For shared "Custom" mode, prefer globally selected date range
      // so the same custom dates persist across all screens.
      if (globalFilters.rangeLabel === 'Custom') {
        const globalFrom = new Date(globalFilters.fromDate);
        const globalTo = new Date(globalFilters.toDate);
        if (!Number.isNaN(globalFrom.getTime()) && !Number.isNaN(globalTo.getTime())) {
          setFromDate(globalFrom);
          setToDate(globalTo);
          setCustomRange({ from: globalFrom, to: globalTo });
          return;
        }
      }
      setFromDate(customRange.from);
      setToDate(customRange.to);
    }
  }, [value, globalFilters.fromDate, globalFilters.toDate, globalFilters.rangeLabel, customRange.from, customRange.to]);

  const handleRangeChange = useCallback((val: string) => {
    setInternalVal(val);
    
    if (val === 'Custom') {
      // Default custom to current month whenever switching to Custom.
      const defaultCustom = getInitialCustomRange();
      setFromDate(defaultCustom.from);
      setToDate(defaultCustom.to);
      setCustomRange(defaultCustom);
      onChange?.(`${format(defaultCustom.from, 'yyyy-MM-dd')} to ${format(defaultCustom.to, 'yyyy-MM-dd')}`);
    } else {
      const dates = calculateDatesFromLabel(val);
      if (dates) {
        setFromDate(new Date(dates.from));
        setToDate(new Date(dates.to));
        onChange?.(val);
      } else {
        onChange?.(val);
      }
    }
  }, [onChange]);

  const handleDateChange = useCallback((type: 'from' | 'to', val: Date | null) => {
    if (!val) return;

    setInternalVal('Custom');

    let nextFrom = fromDate;
    let nextTo = toDate;

    if (type === 'from') {
      if (toDate && isAfter(val, toDate)) {
        setErrorOpen(true);
        return;
      }
      setFromDate(val);
      setCustomRange(prev => ({ ...prev, from: val }));
      nextFrom = val;
    } else {
      if (fromDate && isAfter(fromDate, val)) {
        setErrorOpen(true);
        return;
      }
      setToDate(val);
      setCustomRange(prev => ({ ...prev, to: val }));
      nextTo = val;
    }

    // Trigger on every valid date change so both From and To edits refresh results.
    if (nextFrom && nextTo) {
      onChange?.(`${format(nextFrom, 'yyyy-MM-dd')} to ${format(nextTo, 'yyyy-MM-dd')}`);
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
