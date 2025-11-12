import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from './Loader.jsx';
import { useAuth } from '../../hooks/useAuth.js';

const ProtectedRoute = ({ roles }) => {
  const location = useLocation();
  const { isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    return <Loader label="Checking authentication" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
