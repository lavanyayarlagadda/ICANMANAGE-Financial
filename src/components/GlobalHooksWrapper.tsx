import React from 'react';
import { useInactivityTimer } from '@/hooks/useInactivityTimer';

export const GlobalHooksWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useInactivityTimer();
    return <>{children}</>;
};
