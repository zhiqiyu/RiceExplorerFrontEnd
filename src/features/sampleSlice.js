import { createSlice } from "@reduxjs/toolkit";
import { idField } from "../components/SampleContainer";

const initialState = {
  selected: null,
  geojson: {
    type: "FeatureCollection",
    features: [],
  },
  classProperty: {
    name: null,
    positiveValue: null,
  },

  phenology: {
    start_date: "2019-01",
    end_date: "2019-12",
  },
};

export const sampleSlice = createSlice({
  name: "samples",
  initialState,
  reducers: {
    replace: (state, action) => {
      state.geojson = action.payload;
      state.selected = null;
      return state;
    },
    addFeatures: (state, action) => {
      state.geojson.features.push(action.payload);
      return state;
    },
    deleteFeature: (state, action) => {
      let idx = state.geojson.features.findIndex((value, index) => {
        return value.properties[idField] === action.payload;
      });
      state.geojson.features.splice(idx, 1);
    },
    selectFeature: (state, action) => {
      state.selected = action.payload;
    },
    setClassProperty: (state, action) => {
      state.classProperty = { ...state.classProperty, ...action.payload };
    },
    changePhenologyDate: (state, action) => {
      state.phenology = { ...state.phenology, ...action.payload };
    },
  },
});

export const {
  replace,
  addFeatures,
  deleteFeature,
  selectFeature,
  setClassProperty,
  changePhenologyDate,
} = sampleSlice.actions;

export default sampleSlice.reducer;
