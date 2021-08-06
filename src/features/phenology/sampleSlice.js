import { createSlice } from "@reduxjs/toolkit";

const initialSampleGeoJson = {
  type: "FeatureCollection",
  features: [],
};

export const sampleSlice = createSlice({
  name: "samples",
  initialState: initialSampleGeoJson,
  reducers: {
    addOne: (state, action) => {
      state.features.push(action.payload);
      return state;
    },
    addMany: (state, action) => {
      state.features = state.features.concat(action.payload);
      return state;
    },
  },
});

export const { addOne, addMany } = sampleSlice.actions;

export default sampleSlice.reducer;
