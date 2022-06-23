import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import { Form, Row, Col, Button, Card } from "react-bootstrap"
import { useSelector } from "react-redux";
import { BASEMAPS } from "../utils/constants";
import _, { sample } from "lodash"


import { addTileOverlays } from "./LeafletMap";
import L from "leaflet"
import { useDispatch } from "react-redux";
import { changePhenologyDate } from "../features/sampleSlice";
import { idField } from "./SampleContainer";

// let smallMapObjs = {
  
// }

const SmallMap = (props) => {

  const { date, point, setMapObj } = props

  return (
    <MapContainer
      center={point || [28.5973518, 83.54495724]}
      zoom={15}
      className="small-map"
      zoomControl={false}
      whenCreated={(m) => {
        setMapObj(state => {
          let new_state = {...state, [date]: m}
          return new_state
        })
      }}
    >
      <TileLayer 
        url={BASEMAPS["Google Satellite"].url} 
        attribution={BASEMAPS["Google Satellite"].attribution} 
      />
      
      {point && <Marker position={point}/>}
      
    </MapContainer>
  )
}

export const MapCarousel = (props) => {

  const sampleSlice = useSelector(state => state.samples)
  let selectedSample = sampleSlice.geojson.features.filter(f => f.properties[idField] === sampleSlice.selected)[0]

  const dispatch = useDispatch()

  const [smallMapObjs, setSmallMapObjs] = useState({})


  // move 
  useEffect(() => {
    if (sampleSlice.selected) {
      Object.values(smallMapObjs).forEach(m => {
        m.panTo([selectedSample.geometry.coordinates[1], selectedSample.geometry.coordinates[0]])
      })
    }
  }, [sampleSlice.selected])

  useEffect(() => {
    let newSmallMapObj = {}
    let { start_date, end_date } = sampleSlice.phenology
    start_date = new Date(start_date)
    end_date = new Date(end_date)
    let temp_date = start_date
    while (temp_date <= end_date) {
      let key = `${temp_date.getUTCFullYear()}-${temp_date.getUTCMonth()+1}`
      newSmallMapObj[key] = smallMapObjs[key] 
      temp_date.setUTCMonth(temp_date.getUTCMonth() + 1)
    }
    setSmallMapObjs(newSmallMapObj)
  }, [sampleSlice.phenology])

  const handleClick = (e) => {
    axios.get("phenology/monthly_composite", {
      baseURL: process.env.PUBLIC_URL,
      params: {
        start_date: sampleSlice.phenology.start_date,
        end_date: sampleSlice.phenology.end_date
      }
    }).then(res => {
      let body = res.data
      Object.keys(smallMapObjs).forEach(date => {
        const url = body[date]
        let layer = new L.TileLayer(url)
        layer.addTo(smallMapObjs[date])
      })
    })
  }

  return (
    <div className="map-carousel h-100 d-flex overflow-auto">
      <div className="ps-2 py-2 pe-1" style={{width:280, flexShrink: 0}}>
        <Card className="w-100 h-100">
          <Card.Body className="p-2">
            <Form.Group
              as={Row}
              controlId={"phenology_start_date"}
              className="mb-2"
            >
              
              <Form.Label column sm="3"> 
                From
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  type="month"
                  name={`phenology_start_date`}
                  value={sampleSlice.phenology.start_date}
                  onChange={(e) => dispatch(changePhenologyDate({
                    start_date: e.target.value
                  }))}
                  className="w-100"
                />
              </Col>
            </Form.Group>
            <Form.Group
              as={Row}
              controlId={"phenology_end_date"}
            >
              <Form.Label column sm={"3"}>
                To
              </Form.Label>
              <Col sm={"9"}>
                <Form.Control
                  type="month"
                  name={`phenology_end_date`}
                  value={sampleSlice.phenology.end_date}
                  onChange={(e) => dispatch(changePhenologyDate({
                    end_date: e.target.value
                  }))}
                />
              </Col>
              
            </Form.Group>
            <Row className="pt-2 justify-content-center">
              <Col sm="auto">
                <Button onClick={handleClick}>Load Composites</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>

      {Object.keys(smallMapObjs).map(date => (
        <div className="px-1 py-2" style={{width:250, flexShrink: 0}}>
          <Card className="w-100 h-100" key={date}>
            <Card.Header className="py-0 text-center">{date}</Card.Header>
            <Card.Body className="p-0">
              <SmallMap 
                point={selectedSample && [...selectedSample.geometry.coordinates].reverse()} 
                date={date}
                setMapObj={setSmallMapObjs}
              />
            </Card.Body>
          </Card>
        </div>
      ))}

    </div>
  )
}