import { ingredientsSlice, fetchIngredients } from '../store';

const initialState = {
  list: [],
  selectedIngredient: null,
  isLoading: false,
  error: null
};

const testIngredients = [
  { _id: 'id1', name: 'Ингредиент 1', type: 'main', proteins: 10, fat: 5, carbohydrates: 2, calories: 100, price: 50, image: '', image_large: '', image_mobile: '' },
  { _id: 'id2', name: 'Ингредиент 2', type: 'bun', proteins: 8, fat: 3, carbohydrates: 1, calories: 80, price: 30, image: '', image_large: '', image_mobile: '' }
];

describe('ingredientsSlice reducer', () => {
  it('pending: isLoading становится true', () => {
    const state = ingredientsSlice.reducer(
      initialState,
      { type: fetchIngredients.pending.type }
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fulfilled: данные записываются, isLoading false', () => {
    const state = ingredientsSlice.reducer(
      { ...initialState, isLoading: true },
      { type: fetchIngredients.fulfilled.type, payload: testIngredients }
    );
    expect(state.isLoading).toBe(false);
    expect(state.list).toEqual(testIngredients);
  });

  it('rejected: ошибка записывается, isLoading false', () => {
    const errorMsg = 'Ошибка загрузки';
    const state = ingredientsSlice.reducer(
      { ...initialState, isLoading: true },
      { type: fetchIngredients.rejected.type, payload: errorMsg }
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });
}); 