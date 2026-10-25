import { configureStore, createSlice } from '@reduxjs/toolkit';
import graphReducer from './graphSlice';
import { initialAppState } from './sharedBlueprint';

// Graceful fallback slices for teammate's package until teammate plugs in their own slices
const casesSlice = createSlice({
  name: 'cases',
  initialState: initialAppState.cases,
  reducers: {},
});

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAppState.userSession,
  reducers: {},
});

export const store = configureStore({
  reducer: {
    graph: graphReducer,
    cases: casesSlice.reducer,
    auth: authSlice.reducer,
  },
});