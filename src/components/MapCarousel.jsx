import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import { useSelector } from "react-redux";
import { BASEMAPS } from "../utils/constants";
import _ from "lodash"

import { idField } from "./panels/SamplePanel"
import { addTileOverlays } from "./LeafletMap";
import L from "leaflet"

const smallMaps = []

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const SmallMap = (props) => {

  const { point } = props

  return (
    <MapContainer
      center={point || [28.5973518, 83.54495724]}
      zoom={15}
      className="small-map"
      zoomControl={false}
      whenCreated={(m) => smallMaps.push(m)}
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
      for (let i = 0; i < body.length; i++) {
        const url = body[i];
        
        let layer = new L.TileLayer(url)
        layer.addTo(smallMaps[i])
      }
    })
  }, [])

  // move 
  useEffect(() => {
    if (sampleSlice.selected) {
      smallMaps.forEach(m => {
        m.panTo([selectedSample.geometry.coordinates[1], selectedSample.geometry.coordinates[0]])
      })
    }
  }, [sampleSlice.selected])

  return (
    <div className="map-carousel h-100 d-flex overflow-auto">
      {months.map(month => (
        <div className="p-1 d-flex flex-column" style={{width:200, flex: "0 0 auto"}}>
          <div>{month}</div>
          <SmallMap point={selectedSample && [...selectedSample.geometry.coordinates].reverse()}/>
        </div>
      ))}
    </div>
  )
}