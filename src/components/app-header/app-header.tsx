import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const navigate = useNavigate();
  const userName = useSelector((store) => store.user.name);

  const handleProfileClick = () => {
    const isAuth = Boolean(localStorage.getItem('accessToken'));
    if (!isAuth) {
      navigate('/login');
      return;
    }
    navigate('/profile');
  };

  const handleConstructorClick = () => {
    navigate('/');
  };

  const handleFeedClick = () => {
    navigate('/feed');
  };

  return (
    <AppHeaderUI
      userName={userName}
      onProfileClick={handleProfileClick}
      onConstructorClick={handleConstructorClick}
      onFeedClick={handleFeedClick}
    />
  );
};
