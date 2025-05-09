import { FC, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import {
  profileWsStart,
  profileWsSuccess,
  profileWsError,
  profileWsClosed,
  profileWsGetOrders
} from '../../services/store';
import { getCookie } from '../../utils/cookie';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, wsConnected, wsError } = useSelector(
    (store) => store.profileOrders
  );
  const accessToken = getCookie('accessToken');
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    if (!accessToken) return null;

    const ws = new WebSocket(
      `wss://norma.nomoreparties.space/orders?token=${accessToken}`
    );

    ws.onopen = () => {
      dispatch(profileWsSuccess());
    };

    ws.onerror = (event) => {
      dispatch(profileWsError('WebSocket error'));
      setTimeout(() => {
        dispatch(profileWsStart());
      }, 3000);
    };

    ws.onclose = () => {
      dispatch(profileWsClosed());
      setTimeout(() => {
        dispatch(profileWsStart());
      }, 3000);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.success) {
          dispatch(profileWsGetOrders(data));
        } else {
          dispatch(profileWsError('Invalid data format'));
        }
      } catch (error) {
        dispatch(profileWsError('Failed to parse WebSocket message'));
      }
    };

    return ws;
  }, [dispatch, accessToken]);

  useEffect(() => {
    if (accessToken) {
      dispatch(profileWsStart());
      wsRef.current = connectWebSocket();
      return () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close();
        }
      };
    }
  }, [dispatch, accessToken, connectWebSocket]);

  const handleGetOrders = useCallback(() => {
    if (accessToken) {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      dispatch(profileWsStart());
      wsRef.current = connectWebSocket();
    }
  }, [accessToken, connectWebSocket, dispatch]);

  if (!accessToken) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        Необходима авторизация
      </div>
    );
  }

  if (wsError) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        Ошибка подключения: {wsError}
        <button onClick={handleGetOrders} style={{ marginLeft: '10px' }}>
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
        У вас пока нет заказов
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} handleGetOrders={handleGetOrders} />;
};
