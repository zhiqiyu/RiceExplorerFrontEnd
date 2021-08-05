import { useContext } from "react";
import { Button, Col, Form, Nav, Row, Spinner, TabContainer, TabContent, TabPane } from "react-bootstrap";
import PhenologyContext from "../context/PhenologyContext";
import DataFilterGroup from "./DataFilterGroup";
import { filterNames } from '../utils/constants'
import { SeasonFilterGroup } from "./SeasonFIlterGroup";
import { useState } from "react";
import axios from "axios";

const tabNames = {
  tab1: "Datasets",
  tab2: "Seasons"
}


export default function SettingsPanel(props) {

  const ctx = useContext(PhenologyContext)

  const [loading, setLoading] = useState(false)
  const [validated, setValidated] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true)
      // setSuccess(false)
      return
    } 

    setValidated(false)

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

    
    axios.post("phenology/", formData, {
      baseURL: process.env.PUBLIC_URL,
      headers: {
        "X-CSRFToken": ctx.csrfToken,
      },
      
    }).then(response => {
      let res_body = response.data
      let layerControl = ctx.layerControl.current

      // add all new overlays
      // Object.keys(res_body).map(key => {
      //   let layer = new L.TileLayer(res_body[key].tile_url).addTo(map)
      //   ctx.overlays.push(layer)
      //   layerControl.addOverlay(layer, key)

      //   downloadUrl[key] = res_body[key].download_url
      // })
      
      // setDownLoadUrl(downloadUrl)

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
      ctx.map.removeLayer(layer)
    })
    ctx.setOverlays(ctx.overlays)
  }
  
  return (
    <div className="sidebar h-100 flex-column">
      <Form method="POST" noValidate validated={validated} onSubmit={handleSubmit}>
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
                  <DataFilterGroup disabled={ctx.editing} filters={ctx.dataset.filters} dispatch={ctx.dataset.dispatch} />
                </TabPane>

                <TabPane eventKey={tabNames.tab2} >

                  {filterNames.map(name => (
                    <SeasonFilterGroup key={name} name={name} inputThres={false} readOnly={ctx.editing} filters={ctx[name].filters} dispatch={ctx[name].dispatch} />
                  ))}

                  <div className="d-grid gap-2">
                    <Button type="submit" variant={ loading ? "secondary" : "primary" } disabled={loading}>
                      {loading ? (
                        <div>
                          Running...
                          <Spinner as="span" animation="border" size="sm" role="status" ></Spinner>
                        </div> 
                        ) 
                        : 
                        "Save settings"
                      }
                    </Button>

                    {/* <DropdownButton id="export-dropdown" title="Export" onSelect={(key, e) => handleExport(key)}>
                      <Dropdown.Item eventKey="season">Export each season</Dropdown.Item>
                      <Dropdown.Item eventKey="combined">Export combined</Dropdown.Item>
                    </DropdownButton> */}
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