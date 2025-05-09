import { FC } from 'react';
import styles from './order-status.module.css';

type OrderStatusProps = {
  status: string;
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const getStatusText = () => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
        return 'Готовится';
      case 'created':
        return 'Создан';
      default:
        return 'Отменён';
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case 'done':
        return styles.done;
      case 'pending':
        return styles.pending;
      case 'created':
        return styles.created;
      default:
        return styles.cancelled;
    }
  };

  return (
    <p className={`text text_type_main-default ${getStatusClass()}`}>
      {getStatusText()}
    </p>
  );
};
