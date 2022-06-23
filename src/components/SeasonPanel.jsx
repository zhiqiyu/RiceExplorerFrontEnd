import { Fragment, useContext, useState } from "react";
import { Button, ButtonGroup, Card, Col, Container, Form, ListGroup, Modal, Nav, Row, TabContainer, TabContent, Table, TabPane } from "react-bootstrap";
import shp from "shpjs";
import L from "leaflet";
import { map, layerControlRef, addTileOverlays, panToLatLng, geojsonLayer, setGeojsonLayer, addGeoJsonOverlay } from "../components/LeafletMap";
import { useDispatch, useSelector } from "react-redux";
import _, { sample } from 'lodash'

import { SeasonFilterGroup } from "../components/SeasonFilterGroup";
import * as d3 from "d3"
import { addSeason, changeOp, deleteSeason, modifySeason } from "../features/seasonSlice"
import { SampleContainer, idField } from "../components/SampleContainer";
import { Plus, PlusLg, PlusSquare } from "react-bootstrap-icons";





export const SeasonPanel = () => {

  const appName = useSelector(state => state.appName)
  const sampleState = useSelector((state) => state.samples);

  const seasonFilters = useSelector(state => state.seasons)

  const dispatch = useDispatch();


  

  const handleAddSeason = () => {
    dispatch(addSeason())
  }


  return (
    <Fragment>
      
      {seasonFilters.seasons.map((seasonFilter, i) => (
        <SeasonFilterGroup 
          key={i} 
          idx={i} 
          readOnly={false}
          inputThres={appName !== "phenology"} 
        />
      ))}

      <div className="mb-2">
        <Button variant="secondary" className="w-100" onClick={handleAddSeason}>
          <PlusSquare /> {" "}
          Add phenology phase
        </Button>
      </div>
      
    </Fragment>
  )
}

export default SeasonPanel