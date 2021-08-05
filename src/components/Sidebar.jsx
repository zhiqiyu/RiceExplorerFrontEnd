import axios from "axios";
import _ from "lodash";
import { useContext, useState } from "react";
import { Button, Col, Dropdown, DropdownButton, Form, Nav, Row, Spinner, Tab, TabContainer, TabContent, TabPane, Tabs } from "react-bootstrap";
import EmpiricalFormContext from "../context/EmpiricalFormContext";
import { SeasonFilterGroup } from "./SeasonFIlterGroup";
import { DataFilterGroup } from "./DataFilterGroup";
import L from 'leaflet'
import { filterNames } from '../utils/constants'
import { useCallback } from "react";


const tabNames = {
  "Datasets": "Datasets",
  "Filters": "Filters"
}

export function Sidebar(props) {

  const ctx = useContext(EmpiricalFormContext)

  let map = ctx.map;
  // let map = useMap()
  
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
    filterNames.forEach(name => {
      if (ctx[name].filters['on']) {
        jsonData[name] = {...ctx[name].filters}
        delete jsonData[name].on
      }
    })

    jsonData['dataset'] = {...ctx['dataset'].filters}
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
        "X-CSRFToken": ctx.csrfToken,
      },
      
    }).then(response => {
      let res_body = response.data
      let layerControl = ctx.layerControl.current

      // add all new overlays
      Object.keys(res_body).map(key => {
        let layer = new L.TileLayer(res_body[key].tile_url).addTo(map)
        ctx.overlays.push(layer)
        layerControl.addOverlay(layer, key)

        downloadUrl[key] = res_body[key].download_url
      })
      
      setDownLoadUrl(downloadUrl)

      ctx.setOverlays(ctx.overlays)

      setLoading(false)

    }).catch(reason => {
      setLoading(false)
      alert(reason)
    })

    // set loading state
    setLoading(true)

    // remove all overlays
    let layerControl = ctx.layerControl.current
    ctx.overlays.forEach(layer => {
      layerControl.removeLayer(layer)
      map.removeLayer(layer)
    })
    ctx.setOverlays(ctx.overlays)
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
      <TabContainer defaultActiveKey={tabNames.Datasets} unmountOnExit={false}>
        <Row className="tabs-nav g-0">
          <Nav variant="pills" className="h-100">
            <Col className="h-100 align-items-center p-1">
              <Nav.Link className="tab-title align-middle w-100 h-100 h6" eventKey={tabNames.Datasets} >{tabNames.Datasets}</Nav.Link>
            </Col>
            <Col className="h-100 align-items-center p-1">
              <Nav.Link className="tab-title align-middle h-100 w-100 h6" eventKey={tabNames.Filters} >{tabNames.Filters}</Nav.Link>
            </Col>
          </Nav>
        </Row>
        <Row className="tabs-content g-0 p-2">
          <Col>
            <TabContent>
              <TabPane eventKey={tabNames.Datasets} >
                <DataFilterGroup filters={ctx.dataset.filters} dispatch={ctx.dataset.dispatch} />
              </TabPane>
              <TabPane eventKey={tabNames.Filters}>
                
                {filterNames.map(name => (
                  <SeasonFilterGroup name={name} key={name} inputThres={true} readOnly={loading} filters={ctx[name].filters} dispatch={ctx[name].dispatch}/>
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