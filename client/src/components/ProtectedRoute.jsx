import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if this is an admin route and user is not an admin
  const isAdminRoute = location.pathname.includes('admin-dashboard');
  if (isAdminRoute && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if this is a user route and user is an admin
  const isUserRoute = location.pathname === '/dashboard';
  if (isUserRoute && user?.role === 'admin') {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
