import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';
import {
  TypedUseSelectorHook,
  useSelector as useReduxSelector
} from 'react-redux';

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
