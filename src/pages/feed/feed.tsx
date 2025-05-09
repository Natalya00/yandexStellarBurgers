import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  feedWsStart,
  feedWsSuccess,
  feedWsError,
  feedWsClosed,
  feedWsGetOrders
} from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, wsConnected, wsError } = useSelector((store) => store.feed);
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('wss://norma.nomoreparties.space/orders/all');

    ws.onopen = () => {
      dispatch(feedWsSuccess());
    };

    ws.onerror = (event) => {
      dispatch(feedWsError('WebSocket error'));
      setTimeout(() => {
        dispatch(feedWsStart());
        wsRef.current = connectWebSocket();
      }, 3000);
    };

    ws.onclose = () => {
      dispatch(feedWsClosed());
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.success) {
          dispatch(feedWsGetOrders(data));
        } else {
          dispatch(feedWsError('Invalid data format'));
        }
      } catch (error) {
        dispatch(feedWsError('Failed to parse WebSocket message'));
      }
    };

    return ws;
  }, [dispatch]);

  useEffect(() => {
    dispatch(feedWsStart());
    wsRef.current = connectWebSocket();
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [dispatch, connectWebSocket]);

  const handleGetFeeds = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }
    dispatch(feedWsStart());
    wsRef.current = connectWebSocket();
  }, [connectWebSocket, dispatch]);

  if (wsError) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        Ошибка подключения: {wsError}
        <button onClick={handleGetFeeds} style={{ marginLeft: '10px' }}>
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!wsConnected) {
    return <Preloader />;
  }

  if (!orders || orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        Заказов пока нет
      </div>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
