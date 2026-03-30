import { useState, useEffect, useCallback } from 'react';

export const useFooter = () => {
  const getTimeoutSeconds = useCallback(() => {
    const timeoutMin = parseInt(localStorage.getItem('ican_inactivity_timeout') || '15', 10);
    return (isNaN(timeoutMin) ? 15 : timeoutMin) * 60;
  }, []);

  const [timeLeft, setTimeLeft] = useState(getTimeoutSeconds());

  useEffect(() => {
    let activityTimer: ReturnType<typeof setTimeout> | null = null;
    let countdownInterval: ReturnType<typeof setInterval> | null = null;

    const resetTimer = () => {
      setTimeLeft(getTimeoutSeconds());
    };

    const handleActivity = () => {
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
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => {
      events.forEach(event => document.removeEventListener(event, handleActivity));
      window.removeEventListener('ican_inactivity_timeout_changed', handleTimeoutChange);
      if (activityTimer) clearTimeout(activityTimer);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [getTimeoutSeconds]);

  const formatTime = useCallback((seconds: number) => {
    if (seconds <= 0) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, []);

  return {
    timeLeft,
    formatTime,
  };
};
