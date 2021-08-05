import { useEffect } from "react"
import { useReducer, useState } from "react"
import Map from "../components/LeafletMap"
import Sidebar from "../components/Sidebar"
import SplitPanel from "../components/SplitPanel"
import { EmpiricalFormProvider } from "../context/EmpiricalFormContext"
import { getCookie } from "../utils/csrfToken"

const initialFilters = {
  "on": true,
  "start": "",
  "end": "",
  "min": "-1",
  "max": "1"
}

const filterReducer = (state, action) => {

  let new_state = { ...state }
  new_state[`${action.type}`] = action.value

  return new_state
}

const initialDataFilters = {
  "name": "COPERNICUS/S1_GRD",
  "cloud": "10",
  "feature": "VH",
  "composite": "median",
  "ascd": false,
  "desc": true,
  "boundary": "CHITAWAN",
  "boundary_file": null,
}

const dataFilterReducer = (state, action) => {
  let new_state = { ...state }
  new_state[`${action.type}`] = action.value
  return new_state
}

export function EmpiricalApp() {

  const [csrfToken, setCsrfToken] = useState(null)

  const [dataFilters, dataFiltersDispatch] = useReducer(dataFilterReducer, initialDataFilters)

  const [sowingFilters, sowingDispatch] = useReducer(filterReducer, initialFilters)
  const [peakFilters, peakDispatch] = useReducer(filterReducer, initialFilters)
  const [harvestingFilters, harvestingDispatch] = useReducer(filterReducer, initialFilters)

  const [map, setMap] = useState(null)
  const [overlays, setOverlays] = useState([])
  const [layerControl, setLayerControl] = useState(null)



  useEffect(() => {
    let csrf = getCookie('csrftoken')
    setCsrfToken(csrf)

    // axios.defaults.baseURL = process.env.PUBLIC_URL
    // axios.defaults.headers

  }, [])

  return (
    <EmpiricalFormProvider value={{
      dataset: {
        filters: dataFilters,
        dispatch: dataFiltersDispatch,
      },
      sowing: {
        filters: sowingFilters,
        dispatch: sowingDispatch,
      },
      peak: {
        filters: peakFilters,
        dispatch: peakDispatch,
      },
      harvesting: {
        filters: harvestingFilters,
        dispatch: harvestingDispatch,
      },
      csrfToken: csrfToken,
      map: map,
      setMap: setMap,

      overlays: overlays,
      setOverlays: setOverlays,

      layerControl: layerControl,
      setLayerControl: setLayerControl
    }}>
      <SplitPanel 
        leftPanel={<Sidebar />} 
        rightPanel={<Map setMap={setMap} setLayerControl={setLayerControl}/>} 
      />
    </EmpiricalFormProvider>
  )
}

export default EmpiricalApp;