import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';

export const useInactivityTimer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const timeoutId = useRef<NodeJS.Timeout | null>(null);
    const lastActivityTime = useRef<number>(Date.now());
    const timeoutValue = useRef<number>(15); // minutes

    // Cache the timeout value on mount or when changed elsewhere (rare)
    useEffect(() => {
        const storedTimeout = localStorage.getItem('ican_inactivity_timeout');
        timeoutValue.current = storedTimeout ? parseInt(storedTimeout) : 15;
    }, []);

    const resetTimer = useCallback(() => {
        // Only reset if authenticated
        if (!isAuthenticated) {
            if (timeoutId.current) clearTimeout(timeoutId.current);
            return;
        }

        // Throttle frequency of resets to once per 2 seconds to save CPU
        const now = Date.now();
        if (now - lastActivityTime.current < 2000) return; 
        lastActivityTime.current = now;

        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }

        if (timeoutValue.current > 0) {
            timeoutId.current = setTimeout(() => {
                dispatch(logout());
                navigate('/login');
                // Optional: show a notification if needed
            }, timeoutValue.current * 60 * 1000);
        }
    }, [isAuthenticated, dispatch, navigate]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
        
        // Initial timer start
        resetTimer();

        events.forEach((event) => {
            window.addEventListener(event, resetTimer, { passive: true });
        });

        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [isAuthenticated, resetTimer]);
};
