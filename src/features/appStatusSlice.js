import { createSlice } from "@reduxjs/toolkit";

export const APP_STATUS = {
  ready: "Ready",
  running: "Running...",
  finished: "Finished",
}

export const appStatusSlice = createSlice({
  name: "appStatus",
  initialState: {
    status: APP_STATUS.ready,
    info: "Please run the app to show area of rice."
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload
      return state
    },
    setInfo: (state, action) => {
      state.info = action.payload
      return state
    }
  }
})

export const { setStatus, setInfo } = appStatusSlice.actions

export default appStatusSlice.reducer