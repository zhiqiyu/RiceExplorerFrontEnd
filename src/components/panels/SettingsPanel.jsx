import { Button, Col, Form, Nav, Row, Spinner, TabContainer, TabContent, TabPane } from "react-bootstrap";
import { SatelliteDataFilters, AuxDataFilters } from "../DataFilterGroup";
import { seasonNames } from '../../utils/constants'
import { SeasonFilterGroup } from "../SeasonFilterGroup";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash"
import * as d3 from "d3"
import { layerControlRef } from "../LeafletMap";
import { replace, setResult } from "../../features/phenology/sampleSlice";
import { idField } from "./SamplePanel";
import { useEffect } from "react";
import { actions } from "../../features/phenology/seasonSlice"

const tabNames = {
  tab1: "Datasets",
  tab2: "Seasons"
}

const removeOutliers = (arr) => {
  let first = d3.quantile(arr, 0.25)
  let third = d3.quantile(arr, 0.75)
  let interquatile = third - first
  let upperbound = third + interquatile * 1.5
  let lowerbound = first - interquatile * 1.5
  return arr.filter(element => element > lowerbound && element < upperbound)
}

export default function SettingsPanel(props) {

  const csrfToken = useSelector(state => state.csrfToken)
  const datasetFilters = useSelector(state => state.dataset)
  const seasonFilters = useSelector(state => state.seasons)
  const sampleState = useSelector(state => state.samples)
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

    jsonData['samples'] = _.cloneDeep(sampleState.geojson)
    
    // send request
    axios.post("phenology/", jsonData, {
      baseURL: process.env.PUBLIC_URL,
      headers: {
        "X-CSRFToken": csrfToken,
      },
      
    }).then(response => {
      let res_body = response.data

      // update the properties of the existing samples
      let new_samples = _.cloneDeep(sampleState.geojson)
      res_body.features.forEach(feature => {
        let cur_feature = new_samples.features.filter(v => v.properties[idField] === feature.properties[idField])[0]
        cur_feature.properties = feature.properties
      })
      dispatch(replace(new_samples))

      setLoading(false)

    }).catch(reason => {
      setLoading(false)
      alert(reason)
    })

    // set loading state
    setLoading(true)

  }

  const handleRefresh = (e) => {
    if (sampleState.geojson.features.length === 0) {
      alert("Please upload the ground truth samples first.")
      return;
    }

    Object.keys(seasonFilters).forEach(season => { 
      let seasonFilter = seasonFilters[season];
      if (seasonFilter.on) {
        let start_date = new Date(seasonFilter.start)
        let end_date = new Date(seasonFilter.end)

        let candidates = []

        sampleState.geojson.features.forEach(sample => {
          // let candidates = []
          if (sample.properties[sampleState.classProperty.name] !== sampleState.classProperty.positiveValue) {
            return;
          }
          Object.entries(sample.properties).forEach(([key, val]) => {
            if (key.endsWith('_feature')) {
              let words = key.split('_')
              let date = new Date(Number.parseInt(words[words.length - 2])).getTime()
              if (start_date.getTime() <= date && date <= end_date.getTime()) {
                candidates.push(val)
              }
            }
          })
        })

        if (candidates.length === 0) {
          return;
        } 

        // compute mean, std
        let filteredCandidates = removeOutliers(candidates)
        let mean = _.sum(filteredCandidates) / filteredCandidates.length;
        let std = Math.sqrt(_.sum(_.map(filteredCandidates, v => Math.pow(v - mean, 2))) / filteredCandidates.length);
        
        let action = actions[season];
        dispatch(action({"min": (mean - std).toFixed(2), "max": (mean + std).toFixed(2)}))
      }
    })
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
                  <SatelliteDataFilters />
                  {/* <AuxDataFilters /> */}
                </TabPane>

                <TabPane eventKey={tabNames.tab2} >

                  {seasonNames.map(name => (
                    <SeasonFilterGroup key={name} name={name} inputThres={false} readOnly={editing} />
                  ))}

                  <div className="d-grid gap-2">
                    <Button type="submit" variant={ loading ? "secondary" : "primary" } disabled={loading}>
                      {loading 
                        ? (
                          <div>
                            Running...
                            <Spinner as="span" animation="border" size="sm" role="status" ></Spinner>
                          </div> 
                          ) 
                        : 
                        "Save settings"
                      }
                    </Button>

                    <Button onClick={handleRefresh}>Refresh</Button>

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