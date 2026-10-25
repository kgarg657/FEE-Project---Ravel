// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import casesReducer from './casesSlice';
import authReducer from './authSlice';
import settingsReducer from './settingsSlice';
import graphReducer from './graphSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cases: casesReducer,
    settings: settingsReducer,
    graph: graphReducer,
  },
});

export default store;