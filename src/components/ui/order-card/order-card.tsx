import React, { FC, memo, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';
import { useSelector } from '../../../services/store';
import styles from './order-card.module.css';
import { OrderCardUIProps } from './type';
import { OrderStatus } from '@components';
import { TIngredient } from '../../../utils/types';
import { RootState } from '../../../services/store';

export const OrderCardUI: FC<OrderCardUIProps> = memo(
  ({ orderInfo, maxIngredients, locationState }) => {
    const location = useLocation();
    const ingredients = useSelector(
      (store: RootState) => store.ingredients.list as TIngredient[]
    );

    const orderIngredients = useMemo(
      () =>
        orderInfo.ingredients
          .map((id) => ingredients.find((item: TIngredient) => item._id === id))
          .filter(Boolean),
      [orderInfo.ingredients, ingredients]
    );

    const orderPrice = useMemo(
      () => orderIngredients.reduce((acc, item) => acc + (item?.price || 0), 0),
      [orderIngredients]
    );

    return (
      <Link
        to={orderInfo.number.toString()}
        relative='path'
        state={locationState}
        className={`p-6 mb-4 mr-2 ${styles.order}`}
      >
        <div className={styles.order_info}>
          <span className={`text text_type_digits-default ${styles.number}`}>
            #{String(orderInfo.number).padStart(6, '0')}
          </span>
          <span className='text text_type_main-default text_color_inactive'>
            <FormattedDate date={orderInfo.date} />
          </span>
        </div>
        <h4 className={`pt-6 text text_type_main-medium ${styles.order_name}`}>
          {orderInfo.name}
        </h4>
        {location.pathname === '/profile/orders' && (
          <OrderStatus status={orderInfo.status} />
        )}
        <div className={`${styles.order_footer} pt-6`}>
          <div className={styles.order_price}>
            <span className='text text_type_digits-default mr-2'>
              {orderPrice}
            </span>
            <CurrencyIcon type='primary' />
          </div>
        </div>
        <div className={styles.ingredients}>
          {orderInfo.ingredientsToShow.map((ingredient, idx) => (
            <div
              className={styles.ingredient}
              style={{ zIndex: orderInfo.ingredientsToShow.length - idx }}
              key={ingredient._id + idx}
            >
              <img src={ingredient.image_mobile} alt={ingredient.name} />
              {idx === maxIngredients - 1 && orderInfo.remains > 0 && (
                <span className={styles.more}>+{orderInfo.remains}</span>
              )}
            </div>
          ))}
        </div>
      </Link>
    );
  }
);
