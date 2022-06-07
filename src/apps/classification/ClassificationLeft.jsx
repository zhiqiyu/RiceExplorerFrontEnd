import { useState } from "react"
import { Form, TabContainer, Row, Col, Nav, TabContent, TabPane, Button, Spinner, Dropdown, DropdownButton, Card, OverlayTrigger, Popover } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios";
import _ from "lodash";
import L from 'leaflet'
import { map, layerControlRef, addTileOverlays, removeAllOverlays } from "../../components/LeafletMap"
import { SatelliteDataFilters, AuxDataFilters } from "../../components/DataFilterGroup";

// import {update as updateDatasetFilters } from "../../features/datasetSlice"
import { update, changeModel, updateModelSpecs, MODEL_SPECS } from "../../features/classificationSlice"
import { InfoCircle, InfoCircleFill, InfoSquare, QuestionCircle } from "react-bootstrap-icons";

import { ClassificationFilters } from "../../components/ClassificationFilters";
import { setInfo } from "../../features/appStatusSlice";

// const tabNames = {
//   tab1: "Datasets",
//   tab2: "Samples",
//   tab3: "Classification",
// }

export const ClassificationLeft = (props) => {

  // state from redux store
  const csrfToken = useSelector(state => state.csrfToken)
  const datasetFilters = useSelector(state => state.dataset)
  // const seasonFilters = useSelector(state => state.seasons)
  const classificationState = useSelector(state => state.classification)
  const sampleState = useSelector(state => state.samples)
  const dispatch = useDispatch()

  // local state
  const [validated, setValidated] = useState(false)
  // const [success, setSuccess] = useState(undefined); // undefined - normal; false - invalid; true - 
  const [loading, setLoading] = useState(false)

  const [downloadUrl, setDownLoadUrl] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true)
      // setSuccess(false)
      return
    } 
    
    // validate passed
    setValidated(false)
    // setSuccess(true)
    // setTimeout(() => setSuccess(undefined), 2000)

    const formData = new FormData()

    let jsonData = {}

    jsonData['dataset'] = _.cloneDeep(datasetFilters)
    if (jsonData['dataset'].boundary_file) {
      formData.append('boundary_file', jsonData['dataset'].boundary_file)
      delete jsonData['dataset'].boundary_file
    } 
    jsonData['classification'] = _.cloneDeep(classificationState)
    jsonData['classification']['class_property'] = sampleState['classProperty']
    let model_specs = jsonData['classification']['model_specs']
    for (let key in model_specs) {
      if (model_specs[key] === null) {
        delete model_specs[key]
      }
    }


    formData.append('json', new Blob([JSON.stringify(jsonData)], {
      type: 'application/json'
    }));
    
    if (sampleState.geojson.features.length !== 0) {
      formData.append('samples', new Blob([JSON.stringify(sampleState.geojson)], {
        type: 'application/json'
      }));
    }
    
    axios.post("classification/", formData, {
      baseURL: process.env.PUBLIC_URL,
      headers: {
        "X-CSRFToken": csrfToken,
      },
      
    }).then(response => {
      let res_body = response.data

      // add all new overlays
      let overlays = []
      let key = "classification_result"
      let layer = new L.TileLayer(res_body[key].tile_url)
      let overlay = {
        layer: layer,
        name: key,
        url: res_body[key].download_url
      }
      overlays.push(overlay)

      let message = ""

      if (res_body.area) {
        message += "Rice area: <b>" + res_body.area.toFixed(3) + " ha</b>\n"
      }
      
      if (res_body.confusion_matrix) {
        let parsed = JSON.parse(res_body.confusion_matrix)
        message += 
        `Confusion matrix:
          <table class="table table-bordered table-sm">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">0</th>
              <th scope="col">1</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">0</td>
              <td >${parsed[0][0]}</td>
              <td >${parsed[0][1]}</td>
            </tr>
            <tr>
              <th scope="row">1</td>
              <td >${parsed[1][0]}</td>
              <td >${parsed[1][1]}</td>
            </tr>
          </tbody>
          </table>
          `
      }

      addTileOverlays(overlays)

      dispatch(setInfo(message))

      setLoading(false)

    }).catch(reason => {
      setLoading(false)
      alert(reason)
    })

    // set loading state
    setLoading(true)

    // remove all overlays before loading results
    removeAllOverlays()
  }

  
  return (
    <div className="sidebar h-100 flex-column p-2">
      <Form method="POST" onSubmit={handleSubmit} noValidate validated={validated}>
        <fieldset >
          <SatelliteDataFilters />
          <AuxDataFilters />
        </fieldset>

        <ClassificationFilters />

        <Button 
          className="w-100"
          type="submit" 
          variant={ loading ? "secondary" : "primary"} 
          disabled={loading}
        >
          {loading ? (
            <div>
              Running...
              <Spinner as="span" animation="border" size="sm" role="status" ></Spinner>
            </div> 
            ) 
            : 
            "Run"}
        </Button>


      </Form>
    </div>
  )
}

