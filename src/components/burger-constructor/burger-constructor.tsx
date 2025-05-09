import { FC, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { TConstructorIngredient, TOrder } from '../../utils/types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { orderBurgerApi } from '../../utils/burger-api';
import {
  setOrderRequest,
  setOrderModalData,
  resetConstructor
} from '../../services/store';
import { getCookie } from '../../utils/cookie';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useSelector((store) => store.constructor.bun);
  const ingredients = useSelector((store) => {
    const items = store.constructor.ingredients;
    return Array.isArray(items) ? items : [];
  });
  const orderRequest = useSelector((store) => store.constructor.orderRequest);
  const orderModalData = useSelector(
    (store) => store.constructor.orderModalData
  );

  const constructorItems = useMemo(
    () => ({
      bun,
      ingredients
    }),
    [bun, ingredients]
  );

  const onOrderClick = useCallback(async () => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;

    dispatch(setOrderRequest(true));
    try {
      const ingredientIds = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((item) => item._id),
        constructorItems.bun._id
      ];
      const data = await orderBurgerApi(ingredientIds);
      dispatch(setOrderModalData(data.order));
      dispatch(resetConstructor());
    } catch (e) {
      console.error('Ошибка при оформлении заказа:', e);
    } finally {
      dispatch(setOrderRequest(false));
    }
  }, [constructorItems, orderRequest, dispatch, navigate]);

  const closeOrderModal = useCallback(() => {
    dispatch(setOrderModalData(null));
  }, [dispatch]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
