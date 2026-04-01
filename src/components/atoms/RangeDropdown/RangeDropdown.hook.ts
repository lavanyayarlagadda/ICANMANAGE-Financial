import { useState, useEffect, useCallback } from 'react';
import { subMonths, subYears, format, startOfMonth,isAfter } from 'date-fns';

export interface UseRangeDropdownProps {
  value: string;
  onChange?: (val: string) => void;
}

export const useRangeDropdown = ({ value, onChange }: UseRangeDropdownProps) => {
  const [internalVal, setInternalVal] = useState(value);
  const [fromDate, setFromDate] = useState<Date | null>(startOfMonth(new Date()));
  const [toDate, setToDate] = useState<Date | null>(new Date());
    const [errorOpen, setErrorOpen] = useState(false);

  const calculateDates = useCallback((range: string) => {
    const to = new Date();
    let from;
    switch (range) {
      case '1 month': from = subMonths(to, 1); break;
      case '3 months': from = subMonths(to, 3); break;
      case '6 months': from = subMonths(to, 6); break;
      case '1 year': from = subYears(to, 1); break;
      case 'All Time': from = new Date(2020, 0, 1); break;
      default: return null;
    }
    return { from, to };
  }, []);

  useEffect(() => {
    if (internalVal !== 'Custom') {
      const dates = calculateDates(internalVal);
      if (dates) {
        setFromDate(dates.from);
        setToDate(dates.to);
        onChange?.(`${format(dates.from, 'yyyy-MM-dd')} to ${format(dates.to, 'yyyy-MM-dd')}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRangeChange = useCallback((val: string) => {
    setInternalVal(val);
    const dates = calculateDates(val);
    if (dates) {
      setFromDate(dates.from);
      setToDate(dates.to);
      onChange?.(`${format(dates.from, 'yyyy-MM-dd')} to ${format(dates.to, 'yyyy-MM-dd')}`);
    } else {
      if (val !== 'Custom') onChange?.(val);
    }
  }, [calculateDates, onChange]);

  const handleDateChange = useCallback((type: 'from' | 'to', val: Date | null) => {
          if (!val) return;

        if (type === 'from') {
            if (toDate && isAfter(val, toDate)) {
                setErrorOpen(true);
                return;
            }
            setInternalVal('Custom');
            setFromDate(val);
            if (toDate) onChange?.(`${format(val, 'yyyy-MM-dd')} to ${format(toDate, 'yyyy-MM-dd')}`);
        } else {
            if (fromDate && isAfter(fromDate, val)) {
                setErrorOpen(true);
                return;
            }
            setInternalVal('Custom');
            setToDate(val);
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
