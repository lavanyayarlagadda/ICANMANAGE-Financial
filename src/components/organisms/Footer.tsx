import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const Footer: React.FC = () => {
  const theme = useTheme();

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
      <Typography variant="caption" color="text.secondary">
        CognitiveHealth All Rights Reserved. iCAN RCM Platform v6.0
      </Typography>
      <Typography variant="caption" color={timeLeft <= 60 && timeLeft > 0 ? "error" : "text.secondary"}>
        Session Expiration: {formatTime(timeLeft)}
      </Typography>
    </Box>
  );
};

export default Footer;
