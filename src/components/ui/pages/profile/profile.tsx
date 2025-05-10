import { FC, useState } from 'react';

import { Button, Input } from '@zlden/react-developer-burger-ui-components';
import styles from './profile.module.css';
import commonStyles from '../common.module.css';

import { ProfileUIProps } from './type';
import { ProfileMenu } from '@components';

export const ProfileUI: FC<ProfileUIProps> = ({
  formValue,
  isFormChanged,
  updateUserError,
  handleSubmit,
  handleCancel,
  handleInputChange
}) => {
  const [editableField, setEditableField] = useState<string | null>(null);

  const handleEditClick = (fieldName: string) => {
    setEditableField(fieldName);
  };

  const handleInputBlur = () => {
    setEditableField(null);
  };

  return (
    <main className={`${commonStyles.container}`}>
      <div className={`mt-30 mr-15 ${styles.menu}`}>
        <ProfileMenu />
      </div>
      <form
        className={`mt-30 ${styles.form} ${commonStyles.form}`}
        onSubmit={handleSubmit}
      >
        <>
          <div className='pb-6'>
            <Input
              type={'text'}
              placeholder={'Имя'}
              onChange={handleInputChange}
              value={formValue.name}
              name={'name'}
              error={false}
              errorText={''}
              size={'default'}
              icon={'EditIcon'}
              disabled={editableField !== 'name'}
              onIconClick={() => handleEditClick('name')}
              onBlur={handleInputBlur}
            />
          </div>
          <div className='pb-6'>
            <Input
              type={'email'}
              placeholder={'E-mail'}
              onChange={handleInputChange}
              value={formValue.email}
              name={'email'}
              error={false}
              errorText={''}
              size={'default'}
              icon={'EditIcon'}
              disabled={editableField !== 'email'}
              onIconClick={() => handleEditClick('email')}
              onBlur={handleInputBlur}
            />
          </div>
          <div className='pb-6'>
            <Input
              type={'password'}
              placeholder={'Пароль'}
              onChange={handleInputChange}
              value={
                editableField === 'password'
                  ? formValue.password.length > 0
                    ? '*'.repeat(formValue.password.length)
                    : ''
                  : formValue.password.length > 0
                    ? '*'.repeat(formValue.password.length)
                    : '******'
              }
              name={'password'}
              error={false}
              errorText={''}
              size={'default'}
              icon={'EditIcon'}
              disabled={editableField !== 'password'}
              onIconClick={() => handleEditClick('password')}
              onBlur={handleInputBlur}
            />
          </div>
          {isFormChanged && (
            <div className={styles.button}>
              <Button
                type='secondary'
                htmlType='button'
                size='medium'
                onClick={handleCancel}
              >
                Отменить
              </Button>
              <Button type='primary' size='medium' htmlType='submit'>
                Сохранить
              </Button>
            </div>
          )}
          {updateUserError && (
            <p
              className={`${commonStyles.error} pt-5 text text_type_main-default`}
            >
              {updateUserError}
            </p>
          )}
        </>
      </form>
    </main>
  );
};
