import React from 'react';
import { useInactivityTimer } from '@/hooks/useInactivityTimer';
import { useAppSelector } from '@/store';
import { useUserPermissions } from '@/hooks/useUserPermissions';

export const GlobalHooksWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    // useUserPermissions internally calls useGetMeDetailsQuery with the correct skip logic
    const { user } = useUserPermissions();
    
    // We no longer need manually refetch here if useUserPermissions handles the query
    // and correctly skips when not ready.

    useInactivityTimer();
    return <>{children}</>;
};
