import { configureStore } from '@reduxjs/toolkit';
import graphReducer from './graphSlice';
import casesReducer from './casesSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    graph: graphReducer,
    cases: casesReducer,
    auth: authReducer,
  },
});