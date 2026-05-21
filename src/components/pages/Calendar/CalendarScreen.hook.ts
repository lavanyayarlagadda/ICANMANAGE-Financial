import { useState, useCallback } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { addMonths, subMonths } from 'date-fns';
import { useAppSelector } from '@/store';

export const useCalendarScreen = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const allTransactions = useAppSelector((s) => s.financials.allTransactions);

    const handlePrevMonth = useCallback(() => setCurrentMonth(subMonths(currentMonth, 1)), [currentMonth]);
    const handleNextMonth = useCallback(() => setCurrentMonth(addMonths(currentMonth, 1)), [currentMonth]);
    
    const handleToday = useCallback(() => {
        const today = new Date();
        setCurrentMonth(today);
        setSelectedDate(today);
    }, []);

    const handleDateSelect = useCallback((date: Date) => {
        setSelectedDate(date);
    }, []);

    return {
        theme,
        isMobile,
        isTablet,
        currentMonth,
        selectedDate,
        allTransactions,
        handlePrevMonth,
        handleNextMonth,
        handleToday,
        handleDateSelect,
    };
};
