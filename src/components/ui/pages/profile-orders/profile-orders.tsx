import { FC, memo } from 'react';
import styles from './profile-orders.module.css';
import { ProfileOrdersUIProps } from './type';
import { OrdersList } from '@components';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';
import { TOrder } from '@utils-types';
import { ProfileMenu } from '@components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = memo(
  ({ orders, handleGetOrders }) => (
    <main className={styles.containerMain}>
      <div className={`${styles.titleBox} mt-10 mb-5`}>
        <h1 className={`${styles.title} text text_type_main-large`}>
          История заказов
        </h1>
        <RefreshButton
          text='Обновить'
          onClick={handleGetOrders}
          extraClass={'ml-30'}
        />
      </div>
      <div className={styles.main}>
        <div className={styles.menu}>
          <ProfileMenu />
        </div>
        <div className={styles.columnOrders}>
          <OrdersList orders={orders} />
        </div>
      </div>
    </main>
  )
);
