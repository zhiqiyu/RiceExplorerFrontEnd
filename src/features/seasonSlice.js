import { createSlice } from "@reduxjs/toolkit";

export const SEASONS = {
  sowing: "sowing", 
  peak: "peak", 
  harvesting: "harvesting"
};

const initialState = Object.fromEntries(
  Object.keys(SEASONS).map((season) => [
    season,
    {
      on: true,
      start: "",
      end: "",
      min: "",
      max: "",
    },
  ])
);

const reducers = Object.fromEntries(
  Object.keys(SEASONS).map((season) => [
    season,
    (state, action) => {
      state[season] = { ...state[season], ...action.payload }
      return state
    },
  ])
);

export const SEASONSlice = createSlice({
  name: "seasons",
  initialState,
  reducers,
});

export const actions = SEASONSlice.actions;

export default SEASONSlice.reducer;
