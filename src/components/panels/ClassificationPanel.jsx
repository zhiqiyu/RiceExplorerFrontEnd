import { useState } from "react"
import { Form, TabContainer, Row, Col, Nav, TabContent, TabPane, Button, Spinner, Dropdown, DropdownButton, Card, OverlayTrigger, Popover } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { seasonNames } from '../../utils/constants'
import axios from "axios";
import _ from "lodash";
import L from 'leaflet'
import { map, layerControlRef, addTileOverlays, removeAllOverlays } from "../LeafletMap"
import { SatelliteDataFilters, AuxDataFilters } from "../DataFilterGroup";

// import {update as updateDatasetFilters } from "../../features/phenology/datasetSlice"
import { update, changeModel, updateModelSpecs, MODEL_SPECS } from "../../features/phenology/classificationSlice"
import { InfoCircle, InfoCircleFill, InfoSquare, QuestionCircle } from "react-bootstrap-icons";
import { SampleContainer } from "./SamplePanel";

const tabNames = {
  tab1: "Datasets",
  tab2: "Samples",
  tab3: "Classification",
}

export const ClassificationPanel = (props) => {

  const { setInfo } = props;

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
      Object.keys(res_body).forEach(key => {
        let layer = new L.TileLayer(res_body[key].tile_url)
        let overlay = {
          layer: layer,
          name: key,
          url: res_body[key].download_url
        }
        overlays.push(overlay)

        if (res_body[key].area) {
          setInfo("Rice area: " + res_body[key].area.toFixed(3) + " ha")
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

  const handleChange = (field, value) => {
    if (field === "model") {
      dispatch(changeModel(value))
    } else if (field.startsWith("model")) {
      dispatch(updateModelSpecs({ [field.split('.')[1]]: value}))
    } else {
      dispatch(update({ [field]: value }))
    }
    
  }

  const handleRun = () => {

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
              <Col className="h-100 align-items-center p-1">
                <Nav.Link className="tab-title align-middle h-100 w-100 h6" eventKey={tabNames.tab3} >{tabNames.tab3}</Nav.Link>
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
                  <SampleContainer />
                </TabPane>

                <TabPane eventKey={tabNames.tab3} >
                  <Card className="mb-2 border-secondary">
                    <Card.Header>
                      <h6 className="m-0 p-0">
                        Image Date Range
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group
                        as={Row}
                        controlId={"date_start"}
                        className="mb-2 align-items-center"
                      >
                        <Form.Label column xs={4}>
                          Start Date:
                        </Form.Label>
                        <Col xs={8}>
                          <Form.Control
                            type="date"
                            value={classificationState["start_date"]}
                            onChange={(e) => handleChange("start_date", e.target.value)}
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group
                        as={Row}
                        controlId={"date_end"}
                        className="mb-2 align-items-center"
                      >
                        <Form.Label column xs={4}>
                          End Date:
                        </Form.Label>
                        <Col xs={8}>
                          <Form.Control
                            type="date"
                            value={classificationState["end_date"]}
                            onChange={(e) => handleChange("end_date", e.target.value)}
                          />
                        </Col>
                      </Form.Group>

                    </Card.Body>
                  </Card>

                  <Card className="mb-2 border-secondary">
                    <Card.Header>
                      <h6 className="m-0 p-0">
                        Model Specs
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group
                        as={Row}
                        controlId={"model"}
                        className="mb-2 align-items-center"
                      >
                        <Form.Label column xs={4}>
                          Model:
                        </Form.Label>
                        <Col xs={8}>
                          <Form.Select
                            value={classificationState["model"]}
                            onChange={(e) => handleChange("model", e.target.value)}
                          >
                            <option key=""></option>
                            {Object.keys(MODEL_SPECS).map(name => (
                              <option key={name}>{name}</option>
                            ))}
                            {/* <option key="random_forest">Random Forest</option>
                            <option key="gradient_tree_boost">Gradient Tree Boost</option> */}
                          </Form.Select>
                        </Col>
                      </Form.Group>

                      {classificationState["model"] && Object.keys(MODEL_SPECS[classificationState["model"]]).map(key => (
                        <Form.Group
                          as={Row}
                          controlId={key}
                          className="mb-2 align-items-center"
                        >
                          <Form.Label column xs={4}>
                            {key}
                            {"  "}
                            <OverlayTrigger
                              trigger="hover"
                              placement="right"
                              overlay={
                                <Popover>
                                  <Popover.Body>
                                    {MODEL_SPECS[classificationState["model"]][key]["description"]}
                                  </Popover.Body>
                                </Popover>
                              }
                            >
                              <InfoCircle />
                            </OverlayTrigger>

                          </Form.Label>
                          <Col xs={8}>
                            
                            <Form.Control
                              type="number"
                              placeholder="Use default"
                              step={MODEL_SPECS[classificationState["model"]][key]["type"] === "int" ? "1" : null}
                              value={classificationState["model_specs"][key]}
                              onChange={(e) => handleChange(`model.${key}`, e.target.value)}
                            />
                            
                            
                          </Col>
                        </Form.Group>
                      ))}

                    </Card.Body>
                  </Card>

                  <Button className="w-100" type="submit">Run</Button>
                  
                </TabPane>

              </TabContent>
            </Col>
          </Row>
        </TabContainer>
      </Form>
    </div>
  )
}

// const SampleContainer = () => {

//   const sampleState = useSelector((state) => state.samples);
//   const dispatch = useDispatch();

//   return (
//     <div className="sample-container px-2 pt-2">
//       <Card className="h-100">
//         <Card.Header>
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <h6 className="m-0 p-0">
//                 Samples { `(count: ${sampleState.geojson.features.length})`}
//               </h6>
//             </div>
//             <div>
//               <Button
//                 variant="light"
//                 size="sm"
//                 className="h-100 w-100 px-0"
//                 as="label"
//                 htmlFor="sample-upload"
//               >
//                 <FileEarmarkArrowUpFill />
//               </Button>
//               <input
//                 type="file"
//                 className="d-none"
//                 id="sample-upload"
//                 onChange={handleUploadFile}
//               />
//             </div>
//           </div>
//         </Card.Header>
//         <Card.Body className="p-2">
//           <div className="container card mb-2">
//             <div className="p-2">
//               <div className="row align-items-center mb-2">
//                 {/* <Form onSubmit={handleSaveClassProperty}> */}
//                 <div className="col-auto">Class field:</div>
//                 <div className="col">
//                   <Form.Select 
//                     className="w-100"
//                     value={sampleState.classProperty.name}
//                     onChange={e => handleSelectClassField(e.target.value)}
//                   >
//                     {sampleState.geojson.features.length !== 0 && Object.keys(sampleState.geojson.features[0].properties).map(k => (
//                       <option key={k}>{k}</option>
//                     ))}
//                   </Form.Select>
//                 </div>
//               </div>
//               <div className="row align-items-center">
//                 <div className="col-auto">Class value:</div>
//                 <div className="col"> 
//                   {/* <Form.Control 
//                     size="sm" 
//                     type="text" 
//                     value={positiveValueState}
//                     onChange={e => setPositiveValueState(e.target.value)}
//                   /> */}
//                   <Form.Select 
//                     value={sampleState.classProperty.positiveValue}
//                     onChange={e => handleChangeClassValue(e.target.value)}
//                   >
//                     <option selected></option>
//                     {sampleState.geojson.features.length !== 0 && [...new Set(sampleState.geojson.features.map(feature => feature.properties[sampleState.classProperty.name]))].map(v => {
//                       return (<option key={v}>{v}</option>)
//                     })
//                     }
//                   </Form.Select>
//                 </div>
//                 {/* <div><Button type="submit" >Save</Button></div>
//                 </Form> */}
//               </div>
//             </div>
//           </div>

//           <ListGroup className="sample-list">
//             {sampleState.geojson &&
//               sampleState.geojson.features.map((feature, idx) => (
//                 <SampleItem feature={feature} idx={idx} />
//                 // <ListGroup.Item
//                 //   action
//                 //   className="px-3 py-1"
//                 //   key={idx}
//                 //   onClick={() => handleSelectSample(feature.properties[idField])}
//                 //   active={feature.properties[idField] === sampleState.selected}
//                 //   style={{backgroundColor: feature.properties[sampleState.classProperty.name] === sampleState.classProperty.positiveValue ? "lightgreen" : null}}
//                 // >
//                 //   {`${feature.properties[idField]} - ${feature.properties[sampleState.classProperty.name]}`}
//                 // </ListGroup.Item>
//               ))}
//           </ListGroup>
//         </Card.Body>
//       </Card>
//     </div>
//   )
// }