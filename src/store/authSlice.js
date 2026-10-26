import { createSlice } from '@reduxjs/toolkit';
import { initialAppState } from './sharedBlueprint';

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAppState.userSession,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
      state.isLoggedIn = !!action.payload;
    },
    setSession: (state, action) => {
      state.session = action.payload;
      state.isLoggedIn = !!action.payload;
    },
    logout: (state) => {
      state.session = null;
      state.currentUser = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, setSession, logout } = authSlice.actions;
export default authSlice.reducer;
