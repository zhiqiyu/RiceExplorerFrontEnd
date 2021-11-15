import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selected: null,
  geojson: {
    type: "FeatureCollection",
    features: [],
  },
  classProperty: {
    name: null,
    positiveValue: null,
  }
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
      state.selected = action.payload
    },
    setClassProperty: (state, action) => {
      state.classProperty = {...state.classProperty, ...action.payload}
    }
  },
});

export const { replace, addFeatures, selectFeature, setClassProperty } = sampleSlice.actions

export default sampleSlice.reducer
