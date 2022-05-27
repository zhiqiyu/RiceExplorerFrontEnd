import { useState } from "react"
import { Form, TabContainer, Row, Col, Nav, TabContent, TabPane, Button, Spinner, Dropdown, DropdownButton } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios";
import _ from "lodash";
import L from 'leaflet'
import { map, layerControlRef, addTileOverlays, removeAllOverlays } from "../components/LeafletMap"
import { SatelliteDataFilters, AuxDataFilters } from "../components/DataFilterGroup";
import { SeasonFilterGroup } from "../components/SeasonFilterGroup";

import {setInfo} from "../features/appStatusSlice"

const tabNames = {
  tab1: "Datasets",
  tab2: "Seasons"
}

export const FilterPanel = (props) => {

  // const { setInfo } = props;

  // state from redux store
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
    Object.keys(seasonFilters).forEach(name => {
      if (seasonFilters[name]['on']) {
        jsonData[name] = _.cloneDeep(seasonFilters[name])
        delete jsonData[name].on
      }
    })

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

    // set loading state
    setLoading(true)

    // remove all overlays
    removeAllOverlays()
  }

  const handleExport = (key) => {
    if (key === 'season') {
      // Object.keys(downloadUrl).map(key => {
      //   if (key !== "combined") {

      //   }
      // })
    } else {

    }
  }
  
  return (
    <div className="sidebar h-100 flex-column">
      <Form method="POST" onSubmit={handleSubmit} noValidate validated={validated}>
        <TabContainer defaultActiveKey={tabNames.tab1} unmountOnExit={false}>
          <Row className="bg-white g-0 flex-wrap">
            <Nav variant="pills" className="h-100">
              <Col className="h-100 align-items-center p-1">
                <Nav.Link className="tab-title align-middle w-100 h-100 h6 mb-0" eventKey={tabNames.tab1} >{tabNames.tab1}</Nav.Link>
              </Col>
              <Col className="h-100 align-items-center p-1">
                <Nav.Link className="tab-title align-middle h-100 w-100 h6 mb-0" eventKey={tabNames.tab2} >{tabNames.tab2}</Nav.Link>
              </Col>
            </Nav>
          </Row>
          <Row className="tabs-content g-0 p-2">
            <Col>
              <TabContent>
                <TabPane eventKey={tabNames.tab1} >
                  <fieldset >
                    <SatelliteDataFilters />
                    {/* {appName === "empirical" && <AuxDataFilters />} */}
                    <AuxDataFilters />
                  </fieldset>
                </TabPane>
                <TabPane eventKey={tabNames.tab2}>
                  
                  {Object.keys(seasonFilters).map(name => (
                    <SeasonFilterGroup name={name} key={name} inputThres={true} readOnly={loading} />
                  ))}

                  <div className="d-grid gap-2">
                    <Button type="submit" variant={ loading ? "secondary" : "primary"} disabled={loading}>
                      {loading ? (
                        <div>
                          Running...
                          <Spinner as="span" animation="border" size="sm" role="status" ></Spinner>
                        </div> 
                        ) 
                        : 
                        "Run"}
                    </Button>

                    <DropdownButton id="export-dropdown" title="Export" onSelect={(key, e) => handleExport(key)}>
                      <Dropdown.Item eventKey="season">Export each season</Dropdown.Item>
                      <Dropdown.Item eventKey="combined">Export combined</Dropdown.Item>
                    </DropdownButton>
                  </div>
                  

                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </TabContainer>
      </Form>
    </div>
  )
}