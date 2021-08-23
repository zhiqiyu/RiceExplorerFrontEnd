import { createSlice } from "@reduxjs/toolkit";
import { dataList, featureList } from "../../utils/constants";

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
      if (name in dataList.radar) {
        state.feature = 'VH'
      } else if (name in dataList.optical) {
        state.feature = 'NDVI'
        state.cloud = "15"
      }
      return state
    }
  },
});

export const { update, changeDataSource } = datasetSlice.actions;

export default datasetSlice.reducer;
