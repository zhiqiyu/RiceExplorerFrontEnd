import { createSlice } from "@reduxjs/toolkit";

export const csrfTokenSlice = createSlice({
  name: "csrfToken",
  initialState: null,
  reducers: {
    setToken: (state, action) => action.payload
  }
})

export const { setToken } = csrfTokenSlice.actions

export default csrfTokenSlice.reducer