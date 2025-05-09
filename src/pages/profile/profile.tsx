import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { fetchUser, updateUser } from '../../services/store';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const [formValue, setFormValue] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [initialValue, setInitialValue] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user.name || '',
      email: user.email || ''
    }));
    setInitialValue({
      name: user.name || '',
      email: user.email || ''
    });
  }, [user.name, user.email]);

  const isFormChanged =
    formValue.name !== initialValue.name ||
    formValue.email !== initialValue.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        ...(formValue.password ? { password: formValue.password } : {})
      })
    );
    setFormValue((prevState) => ({ ...prevState, password: '' }));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: initialValue.name,
      email: initialValue.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
