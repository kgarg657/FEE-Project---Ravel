// import { configureStore } from '@reduxjs/toolkit';
// import graphReducer from './graphSlice';
// import casesReducer from './casesSlice';
// import authReducer from './authSlice';

// export const store = configureStore({
//   reducer: {
//     graph: graphReducer,
//     cases: casesReducer,
//     auth: authReducer,
//   },
// });


// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import casesReducer from './casesSlice';
import authReducer from './authSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cases: casesReducer,
    settings: settingsReducer,
  },
});

export default store;