import { createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/get',
  async () => {
    const data = await getIngredientsApi();
    return data; // должно возвращать массив ингредиентов
  }
);
