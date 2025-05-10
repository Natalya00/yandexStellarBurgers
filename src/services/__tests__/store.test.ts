import { rootReducer } from '../store';

describe('rootReducer', () => {
  it('должен возвращать начальное состояние при инициализации', () => {
    const initialState = rootReducer(undefined, { type: '' });
    expect(initialState).toBeDefined();
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('constructor');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('profileOrders');
    expect(initialState).toHaveProperty('orders');
    expect(initialState).toHaveProperty('user');
  });
}); 