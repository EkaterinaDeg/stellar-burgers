// src/services/slices/ingredientsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types'; // убедись, что тип TIngredient определён

// Асинхронный Thunk для загрузки ингредиентов
export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetch',
  async () => {
    const response = await getIngredientsApi();
    return response; // возвращаем массив ингредиентов напрямую
  }
);

// Тип состояния
interface IngredientsState {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null
};

// Слайс
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

// Именованный экспорт редьюсера
export const ingredientsReducer = ingredientsSlice.reducer;
