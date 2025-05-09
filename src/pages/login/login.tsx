import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCookie } from '../../utils/cookie';
import { useDispatch } from '../../services/store';
import { fetchUser } from '../../services/store';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      const response = await fetch(
        'https://norma.nomoreparties.space/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка авторизации');
      }

      localStorage.setItem('refreshToken', data.refreshToken);
      setCookie('accessToken', data.accessToken.replace('Bearer ', ''));

      await dispatch(fetchUser());
      navigate(from, { replace: true });
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при авторизации'
      );
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
