import { Fragment, useState } from "react"
import { Form, TabContainer, Row, Col, Nav, TabContent, TabPane, Button, Spinner, Dropdown, DropdownButton, Card, OverlayTrigger, Popover } from "react-bootstrap"
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import L from 'leaflet'
import { map, layerControlRef, addTileOverlays, removeAllOverlays } from "./LeafletMap"
import { SatelliteDataFilters, AuxDataFilters } from "./DataFilterGroup";

// import {update as updateDatasetFilters } from "../../features/datasetSlice"
import { update, changeModel, updateModelSpecs, MODEL_SPECS } from "../features/classificationSlice"
import { InfoCircle, InfoCircleFill, InfoSquare, QuestionCircle } from "react-bootstrap-icons";


// import {update as updateDatasetFilters } from "../../features/datasetSlice"




export const ClassificationFilters = (props) => {


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

      setInfo(message)

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

  return (
    <Fragment>
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
            Classification Details
          </h6>
        </Card.Header>
        <Card.Body>

          <Form.Group
            as={Row}
            controlId={"train_test_ratio"}
            className="mb-2 align-items-center"
          >
            <Form.Label column xs={4}>
              Training Ratio: 
            </Form.Label>
            <Col xs={8}>
              <Form.Control
                type="number"
                step={"0.05"}
                value={classificationState["training_ratio"]}
                onChange={(e) => handleChange("training_ratio", e.target.value)}
              />
            </Col>

          </Form.Group>

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
            <ModelSpecItem specName={key} handleChange={handleChange}/>
          ))}

        </Card.Body>
      </Card>
    </Fragment>
  )
}

const ModelSpecItem = ({specName, handleChange}) => {

  const classificationState = useSelector(state => state.classification)

  let selectedModel = classificationState["model"]

  const handleModelSpecChange = (e) => {
    handleChange(`model.${specName}`, e.target.value)
  }

  let renderLabel = () => {
    return (
      <Form.Label column xs={4}>
        {specName}
        {"  "}
        <OverlayTrigger
          trigger="hover"
          placement="right"
          overlay={
            <Popover>
              <Popover.Body>
                {MODEL_SPECS[selectedModel][specName]["description"]}
              </Popover.Body>
            </Popover>
          }
        >
          <InfoCircle />
        </OverlayTrigger>
      </Form.Label>
    )
  }

  let renderInput = () => {
    switch (MODEL_SPECS[selectedModel][specName]["type"]) {
      case "int":
        return (
          <Form.Control
            type="number"
            placeholder="Leave blank to use default value"
            step={"1"}
            value={classificationState["model_specs"][specName]}
            onChange={handleModelSpecChange}
          />
        )
      case "float":
        return (
          <Form.Control
            type="number"
            placeholder="Leave blank to use default value"
            step={"0.1"}
            value={classificationState["model_specs"][specName]}
            onChange={handleModelSpecChange}
          />
        )
      case "string":
        return (
          <Form.Control
            type="text"
            value={classificationState["model_specs"][specName]}
            onChange={handleModelSpecChange}
          />
        )
      case "select":
        return (
          <Form.Select 
            value={classificationState["model_specs"][specName]}
            onChange={handleModelSpecChange}
          >
          {MODEL_SPECS[selectedModel][specName]["options"].map(option => (
            <option key={option}>{option}</option>
          ))}
          </Form.Select>
        )
      default:
        return (<></>);
    }
  }

  return (
    <Form.Group
      as={Row}
      controlId={specName}
      className="mb-2 align-items-center"
    >
      {renderLabel()}
      <Col xs={8}>
        {renderInput()}
      </Col>
    </Form.Group>
  )

}