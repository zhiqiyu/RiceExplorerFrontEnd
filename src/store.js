import { configureStore } from "@reduxjs/toolkit";
import csrfTokenReducer from "./features/csrfTokenSlice";
import datasetReducer from './features/datasetSlice'
import sampleReducer from "./features/sampleSlice";
import seasonReducer from "./features/seasonSlice";
import editingReducer from "./features/editingSlice";
import appStatusReducer from "./features/appStatusSlice";
import appNameReducer from "./features/appNameSlice";
import classificationReducer from "./features/classificationSlice";

export default configureStore({
    reducer: {
        csrfToken: csrfTokenReducer,
        dataset: datasetReducer,
        seasons: seasonReducer,
        samples: sampleReducer,
        editing: editingReducer,
        appStatus: appStatusReducer,
        appName: appNameReducer,
        classification: classificationReducer,
    }
})