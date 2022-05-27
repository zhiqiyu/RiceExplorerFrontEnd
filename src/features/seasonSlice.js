import { createSlice } from "@reduxjs/toolkit";

export const INITIAL_SEASONS = {
  transplant: "transplant", 
};

const initialState = {
  op: "and",
  seasons: [
    {
      name: "transplant",
      start: "",
      end: "",
      min: "",
      max: "",
    },
  ]
}

const reducers = {
  changeOp: (state, action) => {
    state.op = action.payload
  },
  changeSeasonName: (state, action) => {
    let {oldName, newName} = action.payload
    let i = state.seasons.findIndex(v => v.name === oldName)
    if (i !== -1) {
      state.seasons[i].name = newName
    }
    return state
  },
  addSeason: (state, action) => {
    let newSeason = {
      "name": "None",
      start: "",
      end: "",
      min: "",
      max: "",
    }
    state.seasons.push(newSeason)
    return state
  },
  deleteSeason: (state, action) => {
    let i = state.seasons.findIndex(v => v.name === action.payload)
    if (i !== -1) {
      state.seasons.splice(i, 1)
    }
    return state
  },
  modifySeason: (state, action) => {
    let i = state.seasons.findIndex(v => v.name === action.payload.name)
    if (i !== -1) {
      state.seasons[i] = {...state.seasons[i], ...action.payload}
    }
    return state
  }
}

// const initialState = Object.fromEntries(
//   Object.keys(INITIAL_SEASONS).map((season) => [
//     season,
//     {
//       on: true,
//       start: "",
//       end: "",
//       min: "",
//       max: "",
//     },
//   ])
// );

// const reducers = Object.fromEntries(
//   Object.keys(INITIAL_SEASONS).map((season) => [
//     season,
//     (state, action) => {
//       state[season] = { ...state[season], ...action.payload }
//       return state
//     },
//   ])
// );

export const SeasonSlice = createSlice({
  name: "seasons",
  initialState,
  reducers,
});

export const {changeOp, changeSeasonName, addSeason, deleteSeason, modifySeason} = SeasonSlice.actions;

export default SeasonSlice.reducer;
