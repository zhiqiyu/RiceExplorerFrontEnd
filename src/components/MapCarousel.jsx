import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import { useSelector } from "react-redux";
import { BASEMAPS } from "../utils/constants";
import _ from "lodash"

import { idField } from "./panels/SamplePanel"
import { addTileOverlays } from "./LeafletMap";
import L from "leaflet"

const smallMapObjs = {
  "Jan": null, 
  "Feb": null, 
  "Mar": null, 
  "Apr": null, 
  "May": null, 
  "Jun": null, 
  "Jul": null, 
  "Aug": null, 
  "Sep": null, 
  "Oct": null, 
  "Nov": null, 
  "Dec": null
}

const SmallMap = (props) => {

  const { month, point } = props
  console.log(point)
  return (
    <MapContainer
      center={point || [28.5973518, 83.54495724]}
      zoom={15}
      className="small-map"
      zoomControl={false}
      whenCreated={(m) => smallMapObjs[month] = m}
    >
      <TileLayer url={BASEMAPS["Google Satellite"].url} attribution={BASEMAPS["Google Satellite"].attribution} />
      
      {point && <Marker position={point}/>}
    </MapContainer>
  )
}

export const MapCarousel = (props) => {

  const sampleSlice = useSelector(state => state.samples)
  let selectedSample = sampleSlice.geojson.features.filter(f => f.properties[idField] === sampleSlice.selected)[0]

  const { date_start, date_end } = props 

  // load false color basemaps for small maps
  useEffect(() => {
    // TODO: change year to reflect the true year
    let year = 2019 
    axios.get("phenology/monthly_composite", {
      baseURL: process.env.PUBLIC_URL,
      params: {
        year: year,
      }
    }).then(res => {
      let body = res.data
      Object.keys(smallMapObjs).forEach(month => {
        const url = body[month]
        let layer = new L.TileLayer(url)
        layer.addTo(smallMapObjs[month])
      })
    })
  }, [])

  // move 
  useEffect(() => {
    if (sampleSlice.selected) {
      Object.values(smallMapObjs).forEach(m => {
        m.panTo([selectedSample.geometry.coordinates[1], selectedSample.geometry.coordinates[0]])
      })
    }
  }, [sampleSlice.selected])

  return (
    <div className="map-carousel h-100 d-flex overflow-auto">
      {Object.keys(smallMapObjs).map(month => (
        <div className="p-1 d-flex flex-column" style={{width:250, flex: "0 0 auto"}}>
          <div>{month}</div>
          <SmallMap point={selectedSample && [...selectedSample.geometry.coordinates].reverse()} month={month}/>
        </div>
      ))}
    </div>
  )
}