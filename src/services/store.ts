import {
  configureStore,
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createAction
} from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import {
  TIngredient,
  TConstructorIngredient,
  TOrder,
  TUser
} from '../utils/types';
import {
  getIngredientsApi,
  getUserApi,
  updateUserApi,
  getOrderByNumberApi
} from '../utils/burger-api';

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  wsConnected: boolean;
  wsError: string | null;
};

export type TProfileOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  wsConnected: boolean;
  wsError: string | null;
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (error) {
      return rejectWithValue('Ошибка загрузки ингредиентов');
    }
  }
);

export const fetchUser = createAsyncThunk<TUser>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserApi();
      return data.user;
    } catch (error) {
      return rejectWithValue('Ошибка загрузки пользователя');
    }
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TUser>>(
  'user/updateUser',
  async (user, { rejectWithValue }) => {
    try {
      const data = await updateUserApi(user);
      return data.user;
    } catch (error) {
      return rejectWithValue('Ошибка обновления пользователя');
    }
  }
);

const initialIngredientsState: {
  list: TIngredient[];
  selectedIngredient: TIngredient | null;
  isLoading: boolean;
  error: string | null;
} = {
  list: [],
  selectedIngredient: null,
  isLoading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: initialIngredientsState,
  reducers: {
    setIngredients: (state, action: PayloadAction<TIngredient[]>) => {
      state.list = action.payload;
    },
    setSelectedIngredient: (
      state,
      action: PayloadAction<TIngredient | null>
    ) => {
      state.selectedIngredient = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

const initialConstructorState = {
  bun: null as TConstructorIngredient | null,
  ingredients: [] as TConstructorIngredient[],
  orderRequest: false,
  orderModalData: null as TOrder | null
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState: initialConstructorState,
  reducers: {
    setBun: (state, action: PayloadAction<TConstructorIngredient | null>) => ({
      ...state,
      bun: action.payload
    }),
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      const newIngredients = Array.isArray(state.ingredients)
        ? [...state.ingredients, action.payload]
        : [action.payload];

      return {
        ...state,
        ingredients: newIngredients
      };
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      const newIngredients = Array.isArray(state.ingredients)
        ? state.ingredients.filter(
            (ingredient) => ingredient.id !== action.payload
          )
        : [];

      return {
        ...state,
        ingredients: newIngredients
      };
    },
    setConstructorIngredients: (
      state,
      action: PayloadAction<TConstructorIngredient[]>
    ) => ({
      ...state,
      ingredients: Array.isArray(action.payload) ? action.payload : []
    }),
    setOrderRequest: (state, action: PayloadAction<boolean>) => ({
      ...state,
      orderRequest: action.payload
    }),
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => ({
      ...state,
      orderModalData: action.payload
    }),
    resetConstructor: (state) => ({
      ...state,
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderModalData: null
    }),
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const ingredients = [...state.ingredients];
      const [removed] = ingredients.splice(from, 1);
      ingredients.splice(to, 0, removed);
      state.ingredients = ingredients;
    }
  }
});

const initialFeedState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  wsConnected: false,
  wsError: null
};

const initialProfileOrdersState: TProfileOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  wsConnected: false,
  wsError: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState: initialFeedState,
  reducers: {
    start: (state) => {
      state.wsConnected = false;
      state.wsError = null;
    },
    success: (state) => {
      state.wsConnected = true;
      state.wsError = null;
    },
    error: (state, action: PayloadAction<string>) => {
      state.wsConnected = false;
      state.wsError = action.payload;
    },
    closed: (state) => {
      state.wsConnected = false;
      state.wsError = null;
    },
    getOrders: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  }
});

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState: initialProfileOrdersState,
  reducers: {
    start: (state) => {
      state.wsConnected = false;
      state.wsError = null;
    },
    success: (state) => {
      state.wsConnected = true;
      state.wsError = null;
    },
    error: (state, action: PayloadAction<string>) => {
      state.wsConnected = false;
      state.wsError = action.payload;
    },
    closed: (state) => {
      state.wsConnected = false;
      state.wsError = null;
    },
    getOrders: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  }
});

const initialOrdersState = {
  currentOrder: {
    createdAt: new Date().toISOString(),
    ingredients: ['1', '2', '3'],
    _id: 'order1',
    status: 'done',
    name: 'Тестовый заказ',
    updatedAt: new Date().toISOString(),
    number: 123
  } as TOrder
};

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const data = await getOrderByNumberApi(number);
      if (data && data.orders && data.orders.length > 0) {
        return data.orders[0];
      }
      return rejectWithValue('Заказ не найден');
    } catch (error) {
      return rejectWithValue('Ошибка загрузки заказа');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: initialOrdersState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrderByNumber.fulfilled, (state, action) => {
      state.currentOrder = action.payload;
    });
  }
});

const initialUserState: {
  name: string;
  email: string;
  isLoading: boolean;
  error: string | null;
} = {
  name: '',
  email: '',
  isLoading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    resetUser: (state) => {
      state.name = '';
      state.email = '';
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload.name;
        state.email = action.payload.email;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload.name;
        state.email = action.payload.email;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  constructor: constructorSlice.reducer,
  feed: feedSlice.reducer,
  profileOrders: profileOrdersSlice.reducer,
  orders: ordersSlice.reducer,
  user: userSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
export const { setIngredients, setSelectedIngredient } =
  ingredientsSlice.actions;
export const {
  setBun,
  addIngredient,
  removeIngredient,
  setConstructorIngredients,
  setOrderRequest,
  setOrderModalData,
  resetConstructor,
  moveIngredient
} = constructorSlice.actions;
export const {
  start: feedWsStart,
  success: feedWsSuccess,
  error: feedWsError,
  closed: feedWsClosed,
  getOrders: feedWsGetOrders
} = feedSlice.actions;

export const {
  start: profileWsStart,
  success: profileWsSuccess,
  error: profileWsError,
  closed: profileWsClosed,
  getOrders: profileWsGetOrders
} = profileOrdersSlice.actions;

export const { resetUser } = userSlice.actions;

export default store;

export { rootReducer };

export { constructorSlice };

export { ingredientsSlice };
