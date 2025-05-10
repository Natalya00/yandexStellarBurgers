import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  userName,
  onProfileClick,
  onConstructorClick,
  onFeedClick
}) => {
  const location = useLocation();
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `${styles.menu_item} ${isActive ? styles.link_active : styles.link}`
            }
            end
          >
            <BurgerIcon
              type={location.pathname === '/' ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `${styles.menu_item} ${isActive ? styles.link_active : styles.link}`
            }
          >
            <ListIcon
              type={
                location.pathname.startsWith('/feed') ? 'primary' : 'secondary'
              }
            />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            `${styles.link_position_last} ${isActive ? styles.link_active : styles.link}`
          }
        >
          <ProfileIcon
            type={
              location.pathname.startsWith('/profile') ? 'primary' : 'secondary'
            }
          />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};
