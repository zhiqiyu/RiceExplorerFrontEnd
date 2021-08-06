import { LayersControl, MapContainer, TileLayer, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css"
import { useMemo, useRef } from "react";
import { useEffect } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { useContext } from "react";
import { BASEMAPS } from "../utils/constants"
import { toggle } from "../features/phenology/editingSlice"

const defaultBaseMap = "Google Maps"

// global variable to hold Leaflet-related variables and methods
export let map = null
export let layerControlRef = null
export let overlayLayers = []


export const addOverlays = (overlays) => {
  overlays.forEach(overlay => {
    overlay.layer.addTo(map)
    layerControlRef.current.addOverlay(overlay.layer, overlay.name)
    overlayLayers.push(overlay.layer)
  })
}

// export const replaceOverlays = (overlays) => {
//   overlayLayers.forEach(layer => {
//     layerControl.removeLayer(layer)
//     map.removeLayer(layer)
//   })

//   overlays = action.payload
//   return state
// }

export const removeAllOverlays = (state) => {
  overlayLayers.forEach(layer => {
    layerControlRef.current.removeLayer(layer)
    map.removeLayer(layer)
  })
}

export function Map(props) {

  const { showEditControl } = props

  const lcRef = useRef()

  useEffect(() => {
    layerControlRef = lcRef
  }, [])

  const displayMap = useMemo(() => (
    <MapContainer center={[28.5973518, 83.54495724]} zoom={8} id="map" whenCreated={m => {map = m}}>
      <LayersControl ref={lcRef}>
        {Object.entries(BASEMAPS).map(([name, basemap]) => (
          <LayersControl.BaseLayer name={name} checked={name === defaultBaseMap} key={name}>
            <TileLayer url={basemap.url} attribution={basemap.attribution} />
          </LayersControl.BaseLayer>
        ))}
      </LayersControl>
      
      {showEditControl ? <EditingControl /> : null}
      
    </MapContainer>
  ), [])

  return displayMap
}

const EditingControl = (props) => {

  const editing = useSelector(state => state.editing)
  const dispatch = useDispatch()

  const handleChangeEditing = (e) => {
    dispatch(toggle())
  }

  const displayControl = useMemo(
    () => (
      <Button variant={editing ? "warning" : "light"} size="sm" onClick={handleChangeEditing}>Start Editing</Button>
    ),
    [editing]
  )

  return (
    <div className="leaflet-top start-50 top-0">
      <div className="leaflet-control leaflet-bar">{displayControl}</div>
    </div>
  )
}


export default Map;