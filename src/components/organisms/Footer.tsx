import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, Button, IconButton, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useAppSelector, useAppDispatch } from '@/store';
import { removeProfilerFilter, setProfilerBannerOpen } from '@/store/slices/financialsSlice';

const profilerFieldsMap: Record<string, string> = {
  accountNumber: 'Account Number',
  patientName: 'Patient Name',
  payer: 'Payer Name',
  totalDue: 'Total Due',
  amountCollected: 'Collected',
  balance: 'Balance',
  lastActivityDate: 'Last Activity Date',
  assignedTo: 'Assigned To',
  status: 'Status',
};

const profilerOperatorsMap: Record<string, string> = {
  equals: '=',
  contains: 'contains',
  starts_with: 'starts with',
  in_list: 'in',
  greater_than: '>',
  less_than: '<',
};

const Footer: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const activePage = useAppSelector(s => s.ui.activePage);
  const profilerFilters = useAppSelector(s => s.financials.profilerFilters);
  const profilerBannerOpen = useAppSelector(s => s.financials.profilerBannerOpen);

  const getTimeoutSeconds = () => {
    const timeoutMin = parseInt(localStorage.getItem('ican_inactivity_timeout') || '15', 10);
    return (isNaN(timeoutMin) ? 15 : timeoutMin) * 60;
  };

  const [timeLeft, setTimeLeft] = useState(getTimeoutSeconds());

  useEffect(() => {
    let activityTimer: ReturnType<typeof setTimeout> | null = null;
    let countdownInterval: ReturnType<typeof setInterval> | null = null;

    const resetTimer = () => {
      setTimeLeft(getTimeoutSeconds());
    };

    const handleActivity = () => {
      // Throttle event so we don't reset state a million times per second
      if (activityTimer) return;
      activityTimer = setTimeout(() => {
        resetTimer();
        activityTimer = null;
      }, 500);
    };

    const handleTimeoutChange = () => {
      resetTimer();
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, handleActivity));
    window.addEventListener('ican_inactivity_timeout_changed', handleTimeoutChange);

    countdownInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      events.forEach(event => document.removeEventListener(event, handleActivity));
      window.removeEventListener('ican_inactivity_timeout_changed', handleTimeoutChange);
      if (activityTimer) clearTimeout(activityTimer);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Active Profiler Filters Banner */}
      {activePage === 'collections' && profilerBannerOpen && profilerFilters.length > 0 && (
        <Box
          sx={{
            py: 1.5,
            px: 3,
            backgroundColor: '#F8F9FA',
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Active Profiler Filters
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profilerFilters.map(f => (
                <Chip
                  key={f.id}
                  label={
                    <Typography variant="body2">
                      {profilerFieldsMap[f.field]} {profilerOperatorsMap[f.operator]} <strong>{f.value}</strong>
                    </Typography>
                  }
                  onDelete={() => dispatch(removeProfilerFilter(f.id))}
                  sx={{ backgroundColor: '#E9ECEF', borderRadius: 1 }}
                />
              ))}
            </Box>
          </Box>
          <Button
            size="small"
            variant="outlined"
            onClick={() => dispatch(setProfilerBannerOpen(false))}
            startIcon={<CloseIcon fontSize="small" />}
            sx={{ textTransform: 'none', backgroundColor: 'white' }}
          >
            Close
          </Button>
        </Box>
      )}

      {/* Main Footer */}
      <Box
        component="footer"
        sx={{
          py: 1.5,
          px: 3,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
        backgroundColor: theme.palette.background.paper,
          flexShrink: 0,
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          © CognitiveHealth | All Rights Reserved. | ICAN RCM Platform v4.0
        </Typography>

        {activePage === 'collections' && (
          <Button
            size="small"
            variant="contained"
            onClick={() => dispatch(setProfilerBannerOpen(!profilerBannerOpen))}
            endIcon={profilerBannerOpen ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
            sx={{
              textTransform: 'none',
              backgroundColor: '#4A90E2',
              '&:hover': { backgroundColor: '#357ABD' }
            }}
          >
            Profiler
          </Button>
        )}

        <Typography variant="caption" sx={{ color: timeLeft <= 60 && timeLeft > 0 ? "error.light" : "rgba(255,255,255,0.7)" }}>
          Session Expiration: {formatTime(timeLeft)}
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
