import axios from "axios";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet"
import { useSelector } from "react-redux";
import { BASEMAPS } from "../utils/constants";
import _ from "lodash"

let smallMaps = []

const SmallMap = (props) => {

  const { data, center } = props

  return (
    <MapContainer
      center={[28.5973518, 83.54495724]}
      zoom={8}
      className="small-map"
      zoomControl={false}
      whenCreated={(m) => smallMaps.push(m)}
    >
      <TileLayer url={BASEMAPS["Google Satellite"].url} attribution={BASEMAPS["Google Satellite"].attribution} />
    </MapContainer>
  )
}

export const MapCarousel = (props) => {

  const sampleSlice = useSelector(state => state.samples)
  let selectedSample = sampleSlice.geojson.features[sampleSlice.selected]
  let coord = selectedSample && selectedSample.geometry.coordinates

  const { date_start, date_end } = props 

  const [results, setResults] = useState([])

  useEffect(() => {
    axios.get("phenology/query", {
      baseURL: process.env.PUBLIC_URL,
      params: {
        date_start: "2019-06-01",
        date_end: "2019-07-31"
      }
    }).then(res => {
      let body = res.data
      setResults(body)
    })
    smallMaps.forEach(m => {
      m.panTo([selectedSample.geometry.coordinates[1], selectedSample.geometry.coordinates[0]])
    })
  }, [sampleSlice.selected])

  return (
    <div className="map-carousel h-100 d-flex overflow-auto">
      {Array.from('x'.repeat(10)).map(a => (

        <div className="p-1" style={{width:200, flex: "0 0 auto"}}>
          <SmallMap data={null}/>
        </div>
      ))}
    </div>
  )
}