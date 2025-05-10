import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutApi } from '../../utils/burger-api';
import { useDispatch, resetUser } from '../../services/store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
    } finally {
      localStorage.removeItem('refreshToken');
      document.cookie = 'accessToken=; Max-Age=0; path=/;';
      dispatch(resetUser());
      navigate('/login', { replace: true });
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
