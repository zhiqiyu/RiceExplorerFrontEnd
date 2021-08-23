import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selected: null,
  geojson: {
    type: "FeatureCollection",
    features: [],
  },
  results: null
};

export const sampleSlice = createSlice({
  name: "samples",
  initialState,
  reducers: {
    replace: (state, action) => {
      state.geojson = action.payload
      state.selected = null
      return state
    },
    addFeatures: (state, action) => {
      state.geojson.features.push(action.payload)
      return state
    },
    selectFeature: (state, action) => {
      state.selected = state.geojson.features[action.payload]
    },

    setResult: (state, action) => {
      state.results = action.payload
      return state
    }
  },
});

export const { replace, addFeatures, selectFeature, setResult } = sampleSlice.actions

export default sampleSlice.reducer
