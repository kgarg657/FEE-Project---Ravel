import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cases: [],
};

export const casesSlice = createSlice({
  name: 'cases',
  initialState,
  reducers: {
    setCases: (state, action) => {
      state.cases = action.payload;
    },
    addCase: (state, action) => {
      state.cases.unshift(action.payload);
    },
  },
});

export const { setCases, addCase } = casesSlice.actions;
export default casesSlice.reducer;
