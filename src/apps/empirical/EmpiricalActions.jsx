import { Button, ButtonGroup, Spinner, Stack } from "react-bootstrap"
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux"
import axios from "axios";
import _ from "lodash";
import L from 'leaflet'
import { addTileOverlays, removeAllOverlays } from "../../components/LeafletMap"

import {setInfo} from "../../features/appStatusSlice"
import { ExportImages } from "../../components/ExportImages";
import { appendLog } from "../../features/logSlice";



export const EmpiricalActions = () => {

  const csrfToken = useSelector(state => state.csrfToken)
  const datasetFilters = useSelector(state => state.dataset)
  const seasonFilters = useSelector(state => state.seasons)
  const dispatch = useDispatch()

  // local state
  const [validated, setValidated] = useState(false)
  // const [success, setSuccess] = useState(undefined); // undefined - normal; false - invalid; true - 
  const [loading, setLoading] = useState(false)

  const [downloadUrl, setDownLoadUrl] = useState("")

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
    jsonData['op'] = seasonFilters.op
    jsonData['seasons'] = seasonFilters.seasons


    jsonData['dataset'] = _.cloneDeep(datasetFilters)
    if (jsonData['dataset'].boundary_file) {
      formData.append('boundary_file', jsonData['dataset'].boundary_file)
      delete jsonData['dataset'].boundary_file
    } 

    formData.append('json', new Blob([JSON.stringify(jsonData)], {
      type: 'application/json'
    }));

    
    axios.post("empirical/", formData, {
      baseURL: process.env.PUBLIC_URL,
      headers: {
        "X-CSRFToken": csrfToken,
      },
      
    }).then(response => {
      let res_body = response.data
      setDownLoadUrl(res_body['combined'].download_url)
      // add all new overlays
      let overlays = []
      Object.keys(res_body).forEach(key => {
        let layer = new L.TileLayer(res_body[key].tile_url)
        let overlay = {
          layer: layer,
          name: key,
          url: res_body[key].download_url
        }
        overlays.push(overlay)

        if (res_body[key].area) {
          dispatch(appendLog("Rice area: <b>" + res_body[key].area.toFixed(3) + " ha</b>\n"))
        }
      })
      addTileOverlays(overlays)

      setLoading(false)

    }).catch(error => {
      setLoading(false)
      dispatch(appendLog("<b>Failed</b> with the reason: " + error.response.data))
    })

    dispatch(appendLog("Run threshold-based classification with the following parameters: <br>" + JSON.stringify(jsonData)))

    // set loading state
    setLoading(true)

    // remove all overlays
    removeAllOverlays()
  }

  return (
    <Stack direction="horizontal" gap={2}>
      <Button 
        size="sm"
        variant={ loading ? "secondary" : "primary"} 
        disabled={loading}
        onClick={handleSubmit}
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