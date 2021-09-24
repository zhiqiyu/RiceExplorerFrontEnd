import { createSlice } from "@reduxjs/toolkit";

export const APP_STATUS = {
  ready: "Ready",
  running: "Running...",
  finished: "Finished",
}

export const appStatusSlice = createSlice({
  name: "appStatus",
  initialState: APP_STATUS.ready,
  reducers: {
    setStatus: (state, action) => action.payload
  }
})

export const { setStatus } = appStatusSlice.actions

export default appStatusSlice.reducer