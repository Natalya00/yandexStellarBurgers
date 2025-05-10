import { FC, useCallback } from 'react';
import { useDispatch } from '../../services/store';
import { useLocation } from 'react-router-dom';
import { TIngredient, TConstructorIngredient } from '../../utils/types';
import { BurgerIngredientUI } from '@ui';
import { addIngredient, setBun } from '../../services/store';

interface BurgerIngredientProps {
  ingredient: TIngredient;
  count?: number;
}

export const BurgerIngredient: FC<BurgerIngredientProps> = ({
  ingredient,
  count = 0
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const handleAdd = useCallback(() => {
    const newIngredient: TConstructorIngredient = {
      ...ingredient,
      id: crypto.randomUUID()
    };

    if (ingredient.type === 'bun') {
      dispatch(setBun(newIngredient));
    } else {
      dispatch(addIngredient(newIngredient));
    }
  }, [dispatch, ingredient]);

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      handleAdd={handleAdd}
      locationState={{ background: location }}
    />
  );
};
