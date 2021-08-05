import { LayersControl, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";

import "leaflet/dist/leaflet.css"
import { useMemo, useRef } from "react";
// import { useContext } from "react";
// import EmpiricalFormContext from "../context/EmpiricalFormContext";
import { useEffect } from "react";
import _ from "lodash";


const BASEMAPS = {
  "Google Maps": {
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution: "Google"
  },
  "Google Satellite": {
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    attribution: "Google"
  },
  "Google Terrain": {
    url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
    attribution: "Google",
  },
  "ESRI World Imagery": {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }
}

let defaultBaseMap = "Google Maps"



export function Map(props) {

  const { setMap, setLayerControl } = props

  const lcRef = useRef()

  useEffect(() => {
    setLayerControl(lcRef)
  }, [])

  const displayMap = useMemo(() => (
    <MapContainer center={[28.5973518, 83.54495724]} zoom={8} id="map" whenCreated={setMap}>
      <LayersControl ref={lcRef}>
        {Object.entries(BASEMAPS).map(([name, basemap]) => (
          <LayersControl.BaseLayer name={name} checked={name === defaultBaseMap} key={name}>
            <TileLayer url={basemap.url} attribution={basemap.attribution} />
          </LayersControl.BaseLayer>
        ))}
      </LayersControl>
    </MapContainer>
  ), [])

  return displayMap
}


export default Map;