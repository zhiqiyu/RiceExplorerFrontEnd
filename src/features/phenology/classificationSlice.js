import { createSlice } from "@reduxjs/toolkit";

export const MODEL_SPECS = {
  "Random Forest": {
    numberOfTrees: {
      type: "int",
      required: true,
      default: 200,
      description: "The number of decision trees to create."
    },
    variablesPerSplit: {
      type: "int",
      default: null,
      description: "The number of variables per split. If unspecified, uses the square root of the number of variables."
    },
    minLeafPopulation: {
      type: "int",
      default: 1,
      description: "Only create nodes whose training set contains at least this many points."
    },
    bagFraction: {
      type: "float",
      default: 0.5,
      description: "The fraction of input to bag per tree."
    },
    maxNodes: {
      type: "int",
      default: null,
      description: "The maximum number of leaf nodes in each tree. If unspecified, defaults to no limit."
    },
    seed: {
      type: "int",
      default: 0,
      description: "The randomization seed."
    }
  },
  "Gradient Tree Boost": {
  }
}

const initialState = {
  "start_date": null,
  "end_date": null,
  "model": "",
  "model_specs": {}
}

const classificationSlice = createSlice({
  name: "classification",
  initialState: initialState,
  reducers: {
    update: (state, action) => ({ ...state, ...action.payload }),
    updateModelSpecs: (state, action) => {
      return {...state, "model_specs": {...state.model_specs, ...action.payload}}
    },
    changeModel: (state, action) => {
      if (action.payload && action.payload !== state.model) {
        state.model_specs = {}
        Object.keys(MODEL_SPECS[action.payload]).forEach(key => {
          if ("default" in MODEL_SPECS[action.payload][key]) {
            state.model_specs[key] = MODEL_SPECS[action.payload][key]["default"]
          } else {
            state.model_specs[key] = null
          }
        })
        
      }

      state.model = action.payload
    }
  }
})

export const { update, updateModelSpecs, changeModel} = classificationSlice.actions

export default classificationSlice.reducer