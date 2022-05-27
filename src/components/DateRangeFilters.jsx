import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet"
import { Form, Row, Col, Button, Card } from "react-bootstrap"
import { useSelector } from "react-redux";
import { BASEMAPS } from "../utils/constants";
import _, { sample } from "lodash"

import { idField } from "../panels/SamplePanel"
import { addTileOverlays } from "./LeafletMap";
import L from "leaflet"
import { useDispatch } from "react-redux";
import { changePhenologyDate } from "../features/sampleSlice";


export const DateRangeFilters = () => {

  const sampleSlice = useSelector(state => state.samples)
  
  const dispatch = useDispatch()

  // const handleClick = (e) => {
  //   axios.get("phenology/monthly_composite", {
  //     baseURL: process.env.PUBLIC_URL,
  //     params: {
  //       start_date: sampleSlice.phenology.start_date,
  //       end_date: sampleSlice.phenology.end_date
  //     }
  //   }).then(res => {
  //     let body = res.data
  //     Object.keys(smallMapObjs).forEach(date => {
  //       const url = body[date]
  //       let layer = new L.TileLayer(url)
  //       layer.addTo(smallMapObjs[date])
  //     })
  //   })
  // }

  return (
    <div className="w-100 ">
      <Card className="w-100 mb-2 border-secondary">
        <Card.Header>
          <h6 className="mb-0">Date Range</h6>
        </Card.Header>
        <Card.Body >
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
          {/* <Row className="pt-2 justify-content-center">
            <Col sm="auto">
              <Button onClick={handleClick}>Load Composites</Button>
            </Col>
          </Row> */}
        </Card.Body>
      </Card>
    </div>
  )
}

export default DateRangeFilters