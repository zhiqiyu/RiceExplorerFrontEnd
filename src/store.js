import { configureStore } from "@reduxjs/toolkit";
import csrfTokenReducer from "./features/phenology/csrfTokenSlice";
import datasetReducer from './features/phenology/datasetSlice'
import sampleReducer from "./features/phenology/sampleSlice";
import seasonReducer from "./features/phenology/seasonSlice";
import editingReducer from "./features/phenology/editingSlice";
import appStatusReducer from "./features/phenology/appStatusSlice";

export default configureStore({
    reducer: {
        csrfToken: csrfTokenReducer,
        dataset: datasetReducer,
        seasons: seasonReducer,
        samples: sampleReducer,
        editing: editingReducer,
        appStatus: appStatusReducer,
    }
})