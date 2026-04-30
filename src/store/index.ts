import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import financialsReducer from './slices/financialsSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import tenantReducer from './slices/tenantSlice';
import { baseApi } from './api/baseApi';
import { rtkQueryErrorLogger } from './middleware/errorMiddleware';

export const rootReducer = combineReducers({
  financials: financialsReducer,
  ui: uiReducer,
  auth: authReducer,
  tenant: tenantReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, rtkQueryErrorLogger),
  devTools: import.meta.env.DEV,
});

export type AppStore = typeof store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
