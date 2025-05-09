import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { useParams } from 'react-router-dom';
import { fetchIngredients } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { TIngredient } from '../../utils/types';

export const IngredientDetails: FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const ingredients: TIngredient[] = useSelector(
    (store) => store.ingredients.list
  );
  const isLoading = useSelector((store) => store.ingredients.isLoading);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const ingredientData = id
    ? ingredients.find((item) => item._id === id)
    : null;

  if (isLoading || !ingredients.length) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        Ингредиент не найден
      </div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
