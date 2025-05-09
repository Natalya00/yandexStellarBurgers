import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCookie } from '../../utils/cookie';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const accessToken = getCookie('accessToken');

  if (!accessToken) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
