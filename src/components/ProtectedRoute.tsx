import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const location = useLocation();

    console.log('[ProtectedRoute] Checking authentication:', { isAuthenticated, path: location.pathname });

    if (!isAuthenticated) {
        console.warn('[ProtectedRoute] Not authenticated, redirecting to /login');
        // Redirect to the login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
