import { createSlice } from "@reduxjs/toolkit";

export const APP_NAME = {
  home: "home",
  empirical: "empirical",
  phenology: "phenology",
  classification: "classification"
}

export const appNameSlice = createSlice({
  name: "appName",
  initialState: null,
  reducers: {
    setAppName: (state, action) => action.payload
  }
})

export const { setAppName } = appNameSlice.actions

export default appNameSlice.reducer