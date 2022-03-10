import { createSlice } from "@reduxjs/toolkit";


export const editingSlice = createSlice({
  name: "editing",
  initialState: false,
  reducers: {
    toggle: (state) => !state
  }
})

export const { toggle } = editingSlice.actions

export default editingSlice.reducer