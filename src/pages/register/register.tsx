import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../../utils/cookie';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');
    try {
      const response = await fetch(
        'https://norma.nomoreparties.space/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, name: userName })
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка регистрации');
      }
      localStorage.setItem('refreshToken', data.refreshToken);
      setCookie('accessToken', data.accessToken.replace('Bearer ', ''));
      navigate('/');
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при регистрации'
      );
    }
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
