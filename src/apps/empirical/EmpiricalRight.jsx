import { Fragment, useContext, useState } from "react";

import { Form, TabContainer, Row, Col, Nav, TabContent, TabPane, Button, Spinner, Dropdown, DropdownButton, Card, Stack } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios";
import _ from "lodash";
import L from 'leaflet'
import { map, layerControlRef, addTileOverlays, removeAllOverlays } from "../../components/LeafletMap"
import { SeasonFilterGroup } from "../../components/SeasonFilterGroup";

import {setInfo} from "../../features/appStatusSlice"
import { PlusSquare } from "react-bootstrap-icons";
import { addSeason, changeOp } from "../../features/seasonSlice";
import SeasonPanel from "../../panels/SeasonPanel";

import {saveAs} from 'file-saver'

const tabNames = {
  tab1: "Samples",
  tab2: "Seasons"
}


// let geojsonLayer = null

export default function EmpiricalRight() {


  const csrfToken = useSelector(state => state.csrfToken)
  const appStatus = useSelector(state => state.appStatus)
  const datasetFilters = useSelector(state => state.dataset)
  const seasonFilters = useSelector(state => state.seasons)
  const editing = useSelector(state => state.editing)
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
    // Object.keys(seasonFilters.seasons).forEach(name => {
    //   if (seasonFilters[name]['on']) {
    //     jsonData[name] = _.cloneDeep(seasonFilters[name])
    //     delete jsonData[name].on
    //   }
    // })

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
          dispatch(setInfo("Rice area: <b>" + res_body[key].area.toFixed(3) + " ha</b>\n"))
        }
      })
      addTileOverlays(overlays)

      setLoading(false)

    }).catch(reason => {
      setLoading(false)
      alert(reason)
    })

    dispatch(setInfo("Running..."))

    // set loading state
    setLoading(true)

    // remove all overlays
    removeAllOverlays()
  }

  const handleExport = (key) => {
    if (key === 'toJpeg') {
      // export to jpeg
      saveAs(downloadUrl, 'result.jpg')
    } else {
      // export to google drive
      
    }
  }


  const handleChangeLogicalOperation = (op) => {
    dispatch(changeOp(op))
  }
  
  return (
    <div className="h-100 d-flex flex-column p-2">
      
      <Card className="mb-2">
        <Card.Body className="d-flex">
          <div className="px-2">
            Aggregate method
          </div>
          <div className="d-flex flex-grow-1 justify-content-around">
            <Form.Check 
              checked={seasonFilters.op === "and"}
              type={"radio"}
              label={"All"}
              onChange={() => handleChangeLogicalOperation("and")}
            />
            <Form.Check
              checked={seasonFilters.op === "or"}
              type={"radio"}
              label={"Any"}
              onChange={() => handleChangeLogicalOperation("or")}
            />
          </div>
        </Card.Body>
      </Card>

      <SeasonPanel />


      <Stack gap={2}>

        {/* <Button variant="secondary" className="w-100" onClick={handleAddSeason}>
          <PlusSquare /> {" "}
          Add Season
        </Button> */}

        <Button 
          type="submit" 
          variant={ loading ? "secondary" : "primary"} 
          disabled={loading}
          onClick={handleSubmit}
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

        <DropdownButton 
          id="export-dropdown" 
          className="w-100 h-100"
          title="Export" 
          onSelect={(key, e) => handleExport(key)}
        >
          <Dropdown.Item eventKey="toJpeg">Download as thumbnail</Dropdown.Item>
          <Dropdown.Item eventKey="toDrive">Export to Google Drive</Dropdown.Item>
        </DropdownButton>

      </Stack>
        

      
    </div>
  );
}
