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
  
  // Track if dates have been touched in the current 'Custom' session
  const [fromTouched, setFromTouched] = useState(false);
  const [toTouched, setToTouched] = useState(false);
  
  // Store custom dates separately to restore them when switching back to 'Custom'
  const [customRange, setCustomRange] = useState<{from: Date | null, to: Date | null}>(getInitialCustomRange());
  
  const [errorOpen, setErrorOpen] = useState(false);

  // Sync internal value and dates with prop
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
        setFromTouched(true);
        setToTouched(true);
        setInternalVal('Custom');
    } else {
      setFromDate(customRange.from);
      setToDate(customRange.to);
    }
  }, [value, customRange.from, customRange.to]);

  const handleRangeChange = useCallback((val: string) => {
    setInternalVal(val);
    
    if (val === 'Custom') {
      // Restore previous custom dates but consider them "untouched" for a fresh session
      // if they were just switching from a preset.
      setFromDate(customRange.from);
      setToDate(customRange.to);
      setFromTouched(false);
      setToTouched(false);
      
      // We don't trigger onChange immediately on selecting 'Custom' anymore
      // to avoid using possibly stale custom dates from a previous session.
    } else {
      const dates = calculateDatesFromLabel(val);
      if (dates) {
        setFromDate(new Date(dates.from));
        setToDate(new Date(dates.to));
        setFromTouched(true);
        setToTouched(true);
        onChange?.(val);
      } else {
        onChange?.(val);
      }
    }
  }, [onChange, customRange]);

  const handleDateChange = useCallback((type: 'from' | 'to', val: Date | null) => {
    if (!val) return;

    setInternalVal('Custom');

    let nextFrom = fromDate;
    let nextTo = toDate;
    let nextFromTouched = fromTouched;
    let nextToTouched = toTouched;

    if (type === 'from') {
      if (toDate && isAfter(val, toDate)) {
        setErrorOpen(true);
        return;
      }
      setFromDate(val);
      setCustomRange(prev => ({ ...prev, from: val }));
      nextFrom = val;
      nextFromTouched = true;
      setFromTouched(true);
    } else {
      if (fromDate && isAfter(fromDate, val)) {
        setErrorOpen(true);
        return;
      }
      setToDate(val);
      setCustomRange(prev => ({ ...prev, to: val }));
      nextTo = val;
      nextToTouched = true;
      setToTouched(true);
    }

    // Only trigger search if BOTH dates have been explicitly selected in this 'Custom' session
    if (nextFrom && nextTo && nextFromTouched && nextToTouched) {
      onChange?.(`${format(nextFrom, 'yyyy-MM-dd')} to ${format(nextTo, 'yyyy-MM-dd')}`);
    }
  }, [fromDate, toDate, fromTouched, toTouched, onChange]);

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
