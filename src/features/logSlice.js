import { createSlice } from "@reduxjs/toolkit"


export const logSlice = createSlice({
  name: "log",
  initialState: "",
  reducers: {
    appendLog: (state, action) => {
      const d = new Date()
      let time = d.toLocaleString()
      state += `<p><b>[${time}]</b> ${action.payload}<br></p>`
      return state
    },
  }
})

export const { appendLog } = logSlice.actions
export default logSlice.reducer