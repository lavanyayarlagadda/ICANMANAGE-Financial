import React from 'react';
import { useInactivityTimer } from '@/hooks/useInactivityTimer';
import { useGetMeDetailsQuery } from '@/store/api/userApi';
import { useAppSelector } from '@/store';

export const GlobalHooksWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const { refetch } = useGetMeDetailsQuery(undefined, { skip: !isAuthenticated });
    
    React.useEffect(() => {
        if (isAuthenticated) {
            refetch();
        }
    }, [isAuthenticated, refetch]);

    useInactivityTimer();
    return <>{children}</>;
};
