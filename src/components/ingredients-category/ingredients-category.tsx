import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { TIngredientsCategoryProps } from './type';
import { TIngredient, TConstructorIngredient } from '../../utils/types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const burgerConstructor = useSelector((store) => store.constructor);

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};

    if (Array.isArray(ingredients)) {
      ingredients.forEach((ingredient) => {
        if (!counters[ingredient._id]) counters[ingredient._id] = 0;
        counters[ingredient._id]++;
      });
    }

    if (bun) counters[bun._id] = 2;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
