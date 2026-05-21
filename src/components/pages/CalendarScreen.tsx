import React, { useState } from 'react';
import {
  Box,
  Typography,
  useTheme,
  IconButton,
  Grid,
  Paper,
  Tooltip,
  useMediaQuery,
  Collapse,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import ListAltIcon from '@mui/icons-material/ListAlt';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  parse,
} from 'date-fns';
import { useAppSelector } from '@/store';
import { formatCurrency } from '@/utils/formatters';
import { AllTransaction } from '@/types/financials';

const CalendarScreen: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const allTransactions = useAppSelector((s) => s.financials.allTransactions);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const renderHeader = () => {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center', 
        justifyContent: 'space-between', 
        mb: isMobile ? 2 : 3, 
        px: 1,
        gap: isMobile ? 2 : 0
      }}>
        <Box>
          <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 700 }}>
            {format(currentMonth, 'MMMM yyyy')}
          </Typography>
          {!isMobile && (
            <Typography variant="body2" color="text.secondary">
              Daily transaction and payment overview
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handleToday} size="small" sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5 }}>
              <TodayIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', border: `1px solid ${theme.palette.divider}`, borderRadius: 1.5, overflow: 'hidden' }}>
            <IconButton onClick={handlePrevMonth} size="small" sx={{ borderRadius: 0 }}>
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={handleNextMonth} size="small" sx={{ borderRadius: 0, borderLeft: `1px solid ${theme.palette.divider}` }}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderDays = () => {
    const days = isMobile ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <Grid container columns={7} spacing={0} sx={{ borderBottom: `1px solid ${theme.palette.divider}`, backgroundColor: '#fcfcfc' }}>
        {days.map((day, idx) => (
          <Grid key={idx} size={1} sx={{ py: 1.5, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const d = day;
        const formattedDate = format(d, 'd');
        const isCurrentMonth = isSameMonth(d, monthStart);
        const isToday = isSameDay(d, new Date());
        const isSelected = selectedDate && isSameDay(d, selectedDate);

        const dayTransactions = allTransactions.filter((t) => {
          try {
            const tDate = parse(t.effectiveDate, 'MM/dd/yyyy', new Date());
            return isSameDay(tDate, d);
          } catch (e) {
            return false;
          }
        });

        const dayTotal = dayTransactions.reduce((acc, curr) => acc + curr.amount, 0);

        days.push(
          <Grid
            key={d.toISOString()}
            size={1}
            onClick={() => setSelectedDate(d)}
            sx={{
              height: isMobile ? 60 : isTablet ? 100 : 120,
              border: `0.5px solid ${theme.palette.divider}`,
              backgroundColor: isSelected ? `${theme.palette.primary.main}08` : isCurrentMonth ? '#fff' : '#fcfcfc',
              p: 0.5,
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: isCurrentMonth ? '#f8fafc' : '#f8fafc',
              },
              ...(isSelected && {
                border: `1.5px solid ${theme.palette.primary.main}`,
                zIndex: 1
              })
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: isToday ? 800 : 600,
                  fontSize: isMobile ? '10px' : '12px',
                  color: isToday ? theme.palette.primary.main : isCurrentMonth ? 'text.primary' : 'text.disabled',
                  width: isMobile ? 20 : 24,
                  height: isMobile ? 20 : 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  backgroundColor: isToday ? `${theme.palette.primary.main}15` : 'transparent',
                }}
              >
                {formattedDate}
              </Typography>
              {dayTotal !== 0 && !isMobile && (
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: dayTotal < 0 ? theme.palette.error.main : theme.palette.success.main,
                    fontSize: '9px',
                  }}
                >
                  {dayTotal > 0 ? '+' : ''}{formatCurrency(dayTotal)}
                </Typography>
              )}
              {dayTotal !== 0 && isMobile && (
                 <Box sx={{ 
                    width: 4, 
                    height: 4, 
                    borderRadius: '50%', 
                    mt: 1,
                    backgroundColor: dayTotal < 0 ? theme.palette.error.main : theme.palette.success.main 
                  }} />
              )}
            </Box>
            
            {!isMobile && (
              <Box sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                {dayTransactions.slice(0, isTablet ? 1 : 2).map((t) => (
                  <Box
                    key={t.id}
                    sx={{
                      fontSize: '9px',
                      p: '1px 4px',
                      borderRadius: '3px',
                      backgroundColor:
                        t.transactionType === 'PAYMENT'
                          ? '#e0f2fe'
                          : t.transactionType === 'RECOUPMENT'
                          ? '#fef2f2'
                          : '#f1f5f9',
                      color:
                        t.transactionType === 'PAYMENT'
                          ? '#0369a1'
                          : t.transactionType === 'RECOUPMENT'
                          ? '#991b1b'
                          : '#475569',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      fontWeight: 600,
                      border: '1px solid currentColor',
                    }}
                  >
                    {t.description}
                  </Box>
                ))}
                {dayTransactions.length > (isTablet ? 1 : 2) && (
                  <Typography variant="caption" sx={{ fontSize: '8px', fontStyle: 'italic', color: 'text.secondary', pl: 0.5 }}>
                    + {dayTransactions.length - (isTablet ? 1 : 2)} more
                  </Typography>
                )}
              </Box>
            )}
          </Grid>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Grid container columns={7} key={day.toISOString()} spacing={0}>
          {days}
        </Grid>
      );
      days = [];
    }
    return rows;
  };

  const renderSelectedDayInfo = () => {
    if (!selectedDate) return null;
    
    const dayTransactions = allTransactions.filter((t) => {
      try {
        const tDate = parse(t.effectiveDate, 'MM/dd/yyyy', new Date());
        return isSameDay(tDate, selectedDate);
      } catch (e) {
        return false;
      }
    });

    return (
      <Collapse in={!!selectedDate && dayTransactions.length > 0}>
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ListAltIcon fontSize="small" sx={{ color: theme.palette.primary.main }} />
            Transactions for {format(selectedDate, 'MMMM d, yyyy')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {dayTransactions.map((t) => (
              <Box 
                key={t.id} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 1.5,
                  backgroundColor: '#fff',
                  borderRadius: 1.5,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  borderLeft: `4px solid ${
                    t.transactionType === 'PAYMENT' ? theme.palette.success.main : 
                    t.transactionType === 'RECOUPMENT' ? theme.palette.error.main : 
                    theme.palette.warning.main
                  }`
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{t.description}</Typography>
                  <Typography variant="caption" color="text.secondary">{t.sourceProvider}</Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 700, 
                    color: t.amount < 0 ? theme.palette.error.main : theme.palette.text.primary 
                  }}
                >
                  {formatCurrency(t.amount)}
                </Typography>
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
      <Paper elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        {renderDays()}
        {renderCells()}
      </Paper>

      {renderSelectedDayInfo()}

      {/* Legend */}
      <Box sx={{ mt: 3, display: 'flex', gap: isMobile ? 1.5 : 3, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#e0f2fe', border: '1px solid #0369a1' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: isMobile ? '10px' : '12px' }}>Payments</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#fef2f2', border: '1px solid #991b1b' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: isMobile ? '10px' : '12px' }}>Recoupments</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f1f5f9', border: '1px solid #475569' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: isMobile ? '10px' : '12px' }}>Others</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CalendarScreen;
