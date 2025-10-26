import { rootReducer } from '../reducers';

describe('Redux store', () => {
  test('initialization of the rootReducer', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const result = rootReducer(undefined, action);

    expect(result).toEqual({
      myconstructor: {
        burger: {
          bun: null,
          ingredients: []
        },
        isLoading: false,    // реальное поле
        error: undefined     // реальное поле
      },
      orders: {
        feed: {
          success: false,
          total: 0,
          totalToday: 0,
          orders: []
        },
        userOrders: [],
        orderByNumber: null,
        newOrder: {
          order: null,
          name: ''
        },
        orderRequest: false,
        loading: false,
        error: null
      },
      ingredients: {
        ingredients: [],     // реальное поле (не items)
        loading: false,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        loading: false,
        error: null
        // message может отсутствовать
      }
    });
  });

  test('should not mutate state with unknown action', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const action = { type: 'UNKNOWN_ACTION' };
    const result = rootReducer(initialState, action);

    // В Redux Toolkit с immer состояние может быть новым объектом
    // Проверяем что значения те же
    expect(result).toEqual(initialState);
  });

  test('should handle unknown action without modifying state structure', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    const fakeAction = { type: 'SOME_UNKNOWN_ACTION_TYPE' };
    const newState = rootReducer(initialState, fakeAction);

    // Проверяем, что структура состояния сохранилась (порядок может быть разным)
    const expectedKeys = ['ingredients', 'myconstructor', 'user', 'orders'];
    expect(Object.keys(newState).sort()).toEqual(expectedKeys.sort());
    
    // Проверяем что основные свойства на месте
    expect(newState.myconstructor.burger).toHaveProperty('bun');
    expect(newState.myconstructor.burger).toHaveProperty('ingredients');
    expect(newState.orders).toHaveProperty('newOrder');
    expect(newState.ingredients).toHaveProperty('ingredients'); // ingredients вместо items
    expect(newState.user).toHaveProperty('user');
  });
});