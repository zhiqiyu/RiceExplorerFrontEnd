import { useEffect, useReducer, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import Map from "../components/LeafletMap"
import MapPanel from "../components/MapPanel"
import SamplePanel from "../components/SamplePanel"
import SettingsPanel from "../components/SettingsPanel"
import Sidebar from "../components/Sidebar"
import { TriplePanel } from "../components/TriplePanel"
import { PhenologyContextProvider } from "../context/PhenologyContext"
import { getCookie } from "../utils/csrfToken"

const initialFilters = {
  "on": true,
  "start": "",
  "end": "",
  "min": "",
  "max": ""
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

const initialSampleGeoJson = {
  "type": "FeatureCollection",
  "features": []
}

const sampleGeoJsonReducer = (state, action) => {
  let new_state = JSON.parse(JSON.stringify(state))
  if (action.type === "addOne") {
    new_state.features.append(action.payload)
  }
  return new_state
}

export default function PhenologyApp() {

  const [csrfToken, setCsrfToken] = useState(null)

  const [editing, setEditing] = useState(false)

  const [dataFilters, dataFiltersDispatch] = useReducer(dataFilterReducer, initialDataFilters)

  const [sowingFilters, sowingDispatch] = useReducer(filterReducer, initialFilters)
  const [peakFilters, peakDispatch] = useReducer(filterReducer, initialFilters)
  const [harvestingFilters, harvestingDispatch] = useReducer(filterReducer, initialFilters)

  const [sampleGeoJson, sampleGeoJsonDispatch] = useReducer(initialSampleGeoJson, sampleGeoJsonReducer)

  const [map, setMap] = useState(null)
  const [overlays, setOverlays] = useState([])
  const [layerControl, setLayerControl] = useState(null)

  useEffect(() => {
    let csrf = getCookie('csrftoken')
    setCsrfToken(csrf)
  }, [])

  return (
    <PhenologyContextProvider value={{

      csrfToken: csrfToken,

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

      map: map,
      setMap: setMap,

      overlays: overlays,
      setOverlays: setOverlays,

      layerControl: layerControl,
      setLayerControl: setLayerControl,

      editing: editing,
      setEditing: setEditing,

      sampleGeoJson: sampleGeoJson,
      sampleGeoJsonDispatch: sampleGeoJsonDispatch,
      
    }} >
      <Container fluid className="h-100 p-0" >
        <Row className="h-100 gx-0">
          <Col xs={2} >
            <SettingsPanel />
          </Col>
          <Col xs={8} >
            <MapPanel />
          </Col>
          <Col xs={2}>
            <SamplePanel />
          </Col>
        </Row>
      </Container>
    </PhenologyContextProvider>
  )
}
