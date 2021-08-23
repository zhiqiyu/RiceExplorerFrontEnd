import axios from "axios";
import _ from "lodash";
import { useContext, useState } from "react";
import { Button, Col, Dropdown, DropdownButton, Form, Nav, Row, Spinner, Tab, TabContainer, TabContent, TabPane, Tabs } from "react-bootstrap";
import { SeasonFilterGroup } from "./SeasonFilterGroup";
import { DataFilterGroup } from "./DataFilterGroup";
import L from 'leaflet'
import { seasonNames } from '../utils/constants'
import { useCallback } from "react";
import { map, layerControlRef, addTileOverlays, removeAllOverlays } from "./LeafletMap"
import { useDispatch, useSelector } from "react-redux";

const tabNames = {
  tab1: "Datasets",
  tab2: "Filters"
}

export function Sidebar(props) {


  const csrfToken = useSelector(state => state.csrfToken)
  const datasetFilters = useSelector(state => state.dataset)
  const seasonFilters = useSelector(state => state.seasons)
  const editing = useSelector(state => state.editing)
  const dispatch = useDispatch()
  
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
    seasonNames.forEach(name => {
      if (seasonFilters[name]['on']) {
        jsonData[name] = _.cloneDeep(seasonFilters[name])
        delete jsonData[name].on
      }
    })

    jsonData['dataset'] = _.cloneDeep(datasetFilters)
    if (jsonData['dataset'].boundary_file) {
      formData.append('file', jsonData['dataset'].boundary_file)
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
      let layerControl = layerControlRef.current

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
        <Row className="tabs-nav g-0">
          <Nav variant="pills" className="h-100">
            <Col className="h-100 align-items-center p-1">
              <Nav.Link className="tab-title align-middle w-100 h-100 h6" eventKey={tabNames.tab1} >{tabNames.tab1}</Nav.Link>
            </Col>
            <Col className="h-100 align-items-center p-1">
              <Nav.Link className="tab-title align-middle h-100 w-100 h6" eventKey={tabNames.tab2} >{tabNames.tab2}</Nav.Link>
            </Col>
          </Nav>
        </Row>
        <Row className="tabs-content g-0 p-2">
          <Col>
            <TabContent>
              <TabPane eventKey={tabNames.tab1} >
                <DataFilterGroup />
              </TabPane>
              <TabPane eventKey={tabNames.tab2}>
                
                {seasonNames.map(name => (
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

export default Sidebar;