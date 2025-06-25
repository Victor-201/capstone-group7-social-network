import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../loader';
import './style.scss';

const PrivateRoute = ({ children, roles = [] }) => {
  const { auth, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="auth-loading">
      <Loader />
    </div>; 
  }

  if (!auth.token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !roles.includes(auth.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default PrivateRoute;
