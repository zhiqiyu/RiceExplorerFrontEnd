import { useContext } from "react";
import { Button, Col, Form, Nav, Row, Spinner, TabContainer, TabContent, TabPane } from "react-bootstrap";
import DataFilterGroup from "./DataFilterGroup";
import { seasonNames } from '../utils/constants'
import { SeasonFilterGroup } from "./SeasonFilterGroup";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash"
import { layerControlRef } from "./LeafletMap";
import { replace, setResult } from "../features/phenology/sampleSlice";

const tabNames = {
  tab1: "Datasets",
  tab2: "Seasons"
}


export default function SettingsPanel(props) {

  const csrfToken = useSelector(state => state.csrfToken)
  const datasetFilters = useSelector(state => state.dataset)
  const seasonFilters = useSelector(state => state.seasons)
  const samples = useSelector(state => state.samples)
  const editing = useSelector(state => state.editing)
  const dispatch = useDispatch()

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

    // const formData = new FormData()

    let jsonData = {}
    seasonNames.forEach(name => {
      if (seasonFilters[name]['on']) {
        jsonData[name] = _.cloneDeep(seasonFilters[name])
        delete jsonData[name].on
      }
    })

    jsonData['dataset'] = _.cloneDeep(datasetFilters)
    delete jsonData.dataset.boundary_file

    jsonData['samples'] = _.cloneDeep(samples.geojson)

    // formData.append('json', new Blob([JSON.stringify(jsonData)], {
    //   type: 'application/json'
    // }));
    console.log(jsonData)
    
    axios.post("phenology/", jsonData, {
      baseURL: process.env.PUBLIC_URL,
      headers: {
        "X-CSRFToken": csrfToken,
      },
      
    }).then(response => {
      let res_body = response.data
      
      console.log(res_body)

      dispatch(setResult(res_body))
      
      // add all new overlays
      // Object.keys(res_body).map(key => {
      //   let layer = new L.TileLayer(res_body[key].tile_url).addTo(map)
      //   ctx.overlays.push(layer)
      //   layerControl.addOverlay(layer, key)

      //   downloadUrl[key] = res_body[key].download_url
      // })
      
      // setDownLoadUrl(downloadUrl)

      setLoading(false)

    }).catch(reason => {
      setLoading(false)
      alert(reason)
    })

    // set loading state
    setLoading(true)

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
                  <DataFilterGroup disabled={editing} />
                </TabPane>

                <TabPane eventKey={tabNames.tab2} >

                  {seasonNames.map(name => (
                    <SeasonFilterGroup key={name} name={name} inputThres={false} readOnly={editing} />
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