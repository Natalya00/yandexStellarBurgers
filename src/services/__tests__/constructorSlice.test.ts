import { constructorSlice } from '../store';
import { addIngredient, removeIngredient, moveIngredient } from '../store';

const initialState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

const testIngredient1 = {
  _id: 'id1',
  name: 'Ингредиент 1',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 2,
  calories: 100,
  price: 50,
  image: '',
  image_large: '',
  image_mobile: '',
  id: 'unique1'
};
const testIngredient2 = { ...testIngredient1, _id: 'id2', name: 'Ингредиент 2', id: 'unique2' };
const testIngredient3 = { ...testIngredient1, _id: 'id3', name: 'Ингредиент 3', id: 'unique3' };

describe('constructorSlice reducer', () => {
  it('должен добавлять ингредиент', () => {
    const state = constructorSlice.reducer(
      initialState,
      addIngredient(testIngredient1)
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(testIngredient1);
  });

  it('должен удалять ингредиент по id', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [testIngredient1, testIngredient2]
    };
    const state = constructorSlice.reducer(
      stateWithIngredients,
      removeIngredient('unique1')
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(testIngredient2);
  });

  it('должен менять порядок ингредиентов', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: [testIngredient1, testIngredient2, testIngredient3]
    };
    const state = constructorSlice.reducer(
      stateWithIngredients,
      moveIngredient({ from: 0, to: 2 })
    );
    expect(state.ingredients[0]).toEqual(testIngredient2);
    expect(state.ingredients[1]).toEqual(testIngredient3);
    expect(state.ingredients[2]).toEqual(testIngredient1);
  });
}); 