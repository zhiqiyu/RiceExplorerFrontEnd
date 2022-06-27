import { ButtonGroup, Button, Spinner, Dropdown, DropdownButton, Card, OverlayTrigger, Popover, Stack } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios";
import _ from "lodash";
import L from 'leaflet'
import { map, layerControlRef, addTileOverlays, removeAllOverlays } from "../../components/LeafletMap"

import { setInfo } from "../../features/appStatusSlice";
import { useState } from "react";
import { ExportImages } from "../../components/ExportImages";
import { appendLog } from "../../features/logSlice";


export const ClassificationActions = () => {

  const csrfToken = useSelector(state => state.csrfToken)
  const datasetFilters = useSelector(state => state.dataset)
  // const seasonFilters = useSelector(state => state.seasons)
  const appName = useSelector(state => state.appName)
  const classificationState = useSelector(state => state.classification)
  const sampleState = useSelector(state => state.samples)
  const dispatch = useDispatch()

  // local state
  const [loading, setLoading] = useState(false)

  // const [success, setSuccess] = useState(undefined); // undefined - normal; false - invalid; true - 

  const [downloadUrl, setDownLoadUrl] = useState("")

  const handleSubmit = () => {

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

      setDownLoadUrl(res_body[key].download_url)

      let message = ""

      if (res_body.area) {
        message += "Rice area: <b>" + res_body.area.toFixed(3) + " ha</b><br>"
      }
      
      if (res_body.confusion_matrix) {
        let parsed = JSON.parse(res_body.confusion_matrix)
        let oa = res_body.oa
        let kappa = res_body.kappa
        message += 
        `Confusion matrix:
        <div>
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
          </div>

          <p>Overall Accuracy: <b>${oa}</b></p>
          <p>Kappa: <b>${kappa}</b></p>
          `
      }

      addTileOverlays(overlays)

      dispatch(appendLog(message))

      setLoading(false)

    }).catch(error => {
      setLoading(false)
      dispatch(appendLog("<b>Failed</b> with the reason: " + error.response.data))
    })

    dispatch(appendLog("Run supervised classification with the following parameters: <br>" + JSON.stringify(jsonData)))

    // set loading state
    setLoading(true)

    // remove all overlays before loading results
    removeAllOverlays()
  }

  return (
    <Stack direction="horizontal" gap={2}>
      <Button 
        size="sm" 
        onClick={handleSubmit}
        variant={ loading ? "secondary" : "primary"} 
        disabled={loading}
        style={{"width": "100px"}}
      >
        {loading ? (
          <div className="d-flex align-items-center">
            <Spinner as="span" animation="border" size="sm" role="status" ></Spinner>
            <div>Running </div>
          </div> 
          ) 
          : 
          "Run"}
      </Button>

      <ExportImages downloadUrl={downloadUrl} />

    </Stack>
  )
}