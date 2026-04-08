import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { RootState } from '@/store';
import { useNavigate } from 'react-router-dom';

export const useInactivityTimer = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const timeoutId = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = () => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }

        if (!isAuthenticated) return;

        // Get timeout from localStorage or default to 15 mins
        const storedTimeout = localStorage.getItem('ican_inactivity_timeout');
        const timeoutMinutes = storedTimeout ? parseInt(storedTimeout) : 15;

        if (timeoutMinutes > 0) {
            timeoutId.current = setTimeout(() => {
                dispatch(logout());
                navigate('/login', { replace: true });
            }, timeoutMinutes * 60 * 1000);
        }
    };

    useEffect(() => {
        const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

        const handleActivity = () => {
            resetTimer();
        };

        if (isAuthenticated) {
            resetTimer();
            events.forEach((event) => {
                window.addEventListener(event, handleActivity);
            });
        }

        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [isAuthenticated]);
};
