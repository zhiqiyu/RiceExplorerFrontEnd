import { createSlice } from "@reduxjs/toolkit";

const seasons = ["sowing", "peak", "harvesting"];

const initialState = Object.fromEntries(
  seasons.map((season) => [
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
  seasons.map((season) => [
    season,
    (state, action) => {
      state[season] = { ...state[season], ...action.payload }
      return state
    },
  ])
);

export const seasonSlice = createSlice({
  name: "seasons",
  initialState,
  reducers,
});

export const actions = seasonSlice.actions;

export default seasonSlice.reducer;
