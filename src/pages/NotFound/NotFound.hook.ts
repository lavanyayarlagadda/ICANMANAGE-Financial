import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useNotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error('404 Error: User attempted to access non-existent route:', location.pathname);
    }, [location.pathname]);

    return {
        path: location.pathname
    };
};
