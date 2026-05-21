import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Paper,
  Collapse,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import ListAltIcon from '@mui/icons-material/ListAlt';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  parse,
} from 'date-fns';
import { formatCurrency } from '@/utils/formatters';
import { useCalendarScreen } from './CalendarScreen.hook';
import { themeConfig } from '@/theme/themeConfig';
import * as styles from './CalendarScreen.styles';

const CalendarScreen: React.FC = () => {
    const {
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
    } = useCalendarScreen();

    const renderHeader = () => (
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', mb: isMobile ? 2 : 3, px: 1, gap: isMobile ? 2 : 0 }}>
            <Box>
                <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 700 }}>{format(currentMonth, 'MMMM yyyy')}</Typography>
                {!isMobile && <Typography variant="body2" color="text.secondary">Daily transaction and payment overview</Typography>}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
                <IconButton onClick={handleToday} size="small" sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5 }}><TodayIcon fontSize="small" /></IconButton>
                <Box sx={{ display: 'flex', border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5, overflow: 'hidden' }}>
                    <IconButton onClick={handlePrevMonth} size="small" sx={{ borderRadius: 0 }}><ChevronLeftIcon fontSize="small" /></IconButton>
                    <IconButton onClick={handleNextMonth} size="small" sx={{ borderRadius: 0, borderLeft: `1px solid ${theme.palette.divider}` }}><ChevronRightIcon fontSize="small" /></IconButton>
                </Box>
            </Box>
        </Box>
    );

    const renderDays = () => {
        const days = isMobile ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <Grid container columns={7} spacing={0} sx={{ borderBottom: `1px solid ${theme.palette.divider}`, backgroundColor: themeConfig.colors.background }}>
                {days.map((day, idx) => (
                    <Grid key={idx} size={{ xs: 1 }} sx={{ py: 1.5, textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>{day}</Typography>
                    </Grid>
                ))}
            </Grid>
        );
    };

    const cells = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let day = startDate;

        while (day <= endDate) {
            const daysInRow = [];
            for (let i = 0; i < 7; i++) {
                const d = day;
                const isCurrentMonth = isSameMonth(d, monthStart);
                const isToday = isSameDay(d, new Date());
                const isSelected = selectedDate && isSameDay(d, selectedDate);

                const dayTransactions = allTransactions.filter((t) => {
                    try {
                        const tDate = parse(t.effectiveDate, 'MM/dd/yyyy', new Date());
                        return isSameDay(tDate, d);
                    } catch (e) { return false; }
                });

                const dayTotal = dayTransactions.reduce((acc, curr) => acc + curr.amount, 0);

                daysInRow.push(
                    <Grid key={d.toISOString()} size={{ xs: 1 }} onClick={() => handleDateSelect(d)} sx={styles.calendarCellStyles(!!isSelected, isCurrentMonth, theme, isMobile, isTablet)}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="caption" sx={{ fontWeight: isToday ? 800 : 600, fontSize: isMobile ? '10px' : '12px', color: isToday ? theme.palette.primary.main : isCurrentMonth ? 'text.primary' : 'text.disabled', width: isMobile ? 20 : 24, height: isMobile ? 20 : 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: isToday ? `${theme.palette.primary.main}15` : 'transparent' }}>{format(d, 'd')}</Typography>
                            {dayTotal !== 0 && !isMobile && <Typography variant="caption" sx={{ fontWeight: 700, color: dayTotal < 0 ? theme.palette.error.main : theme.palette.success.main, fontSize: '9px' }}>{dayTotal > 0 ? '+' : ''}{formatCurrency(dayTotal)}</Typography>}
                        </Box>
                        {!isMobile && (
                            <Box sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                                {dayTransactions.slice(0, isTablet ? 1 : 2).map((t) => (
                                    <Box key={t.id} sx={styles.transactionBadgeStyles(t.transactionType)}>{t.description}</Box>
                                ))}
                            </Box>
                        )}
                    </Grid>
                );
                day = addDays(day, 1);
            }
            rows.push(<Grid container columns={7} key={day.toISOString()} spacing={0}>{daysInRow}</Grid>);
        }
        return rows;
    }, [currentMonth, selectedDate, allTransactions, theme, isMobile, isTablet, handleDateSelect]);

    const renderSelectedDayInfo = () => {
        if (!selectedDate) return null;
        const dayTransactions = allTransactions.filter((t) => {
            try {
                const tDate = parse(t.effectiveDate, 'MM/dd/yyyy', new Date());
                return isSameDay(tDate, selectedDate);
            } catch (e) { return false; }
        });

        return (
            <Collapse in={dayTransactions.length > 0}>
                <Box sx={{ mt: 3, p: 2, backgroundColor: themeConfig.colors.suspenseScreen.bgAlt, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}><ListAltIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />Transactions for {format(selectedDate, 'MMMM d, yyyy')}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {dayTransactions.map((t) => (
                            <Box key={t.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, backgroundColor: themeConfig.colors.surface, borderRadius: 1.5, borderLeft: `4px solid ${t.transactionType === 'PAYMENT' ? theme.palette.success.main : t.transactionType === 'RECOUPMENT' ? theme.palette.error.main : theme.palette.warning.main}` }}>
                                <Box><Typography variant="body2" sx={{ fontWeight: 600 }}>{t.description}</Typography><Typography variant="caption" color="text.secondary">{t.sourceProvider}</Typography></Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: t.amount < 0 ? theme.palette.error.main : theme.palette.text.primary }}>{formatCurrency(t.amount)}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Collapse>
        );
    };

    return (
        <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
            {renderHeader()}
            <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: 'hidden' }}>
                {renderDays()}
                {cells}
            </Paper>
            {renderSelectedDayInfo()}
            <Box sx={{ mt: 3, display: 'flex', gap: isMobile ? 1.5 : 3, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={styles.legendIconStyles(themeConfig.colors.suspense.medicare.bg, themeConfig.colors.suspense.medicare.text)} /><Typography variant="caption" sx={{ fontWeight: 600 }}>Payments</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={styles.legendIconStyles(themeConfig.colors.suspense.cross.bg, themeConfig.colors.suspense.cross.text)} /><Typography variant="caption" sx={{ fontWeight: 600 }}>Recoupments</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={styles.legendIconStyles(themeConfig.colors.suspense.tax.bg, themeConfig.colors.suspense.tax.text)} /><Typography variant="caption" sx={{ fontWeight: 600 }}>Others</Typography></Box>
            </Box>
        </Box>
    );
};

export default CalendarScreen;
