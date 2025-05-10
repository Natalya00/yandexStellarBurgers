import { FC } from 'react';
import { useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';
import { getOrders } from '../../utils';

export const FeedInfo: FC = () => {
  const orders = useSelector((store) => store.feed.orders);
  const total = useSelector((store) => store.feed.total);
  const totalToday = useSelector((store) => store.feed.totalToday);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      total={total}
      totalToday={totalToday}
    />
  );
};
