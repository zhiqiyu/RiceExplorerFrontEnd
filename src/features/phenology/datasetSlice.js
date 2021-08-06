import { createSlice } from "@reduxjs/toolkit";
import { featureList } from "../../utils/constants";

const initialDatasetState = {
  name: "COPERNICUS/S1_GRD",
  cloud: "15",
  feature: "VH",
  composite: "median",
  ascd: false,
  desc: true,
  boundary: "CHITAWAN",
  boundary_file: null,
};

export const datasetSlice = createSlice({
  name: "dataset",
  initialState: initialDatasetState,
  reducers: {
    update: (state, action) => ({ ...state, ...action.payload }),
    changeDataSource: (state, action) => {
      let name = action.payload
      state.name = name
      if (name in featureList.radar) {
        state.feature = featureList.radar.VH
      } else if (name in featureList.optical) {
        state.feature = featureList.optical.NDVI
        state.cloud = "15"
      }
      return state
    }
  },
});

export const { update, changeDataSource } = datasetSlice.actions;

export default datasetSlice.reducer;
