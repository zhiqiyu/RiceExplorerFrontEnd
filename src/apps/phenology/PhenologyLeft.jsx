import { Button, Col, Form, Nav, Row, Spinner, TabContainer, TabContent, TabPane } from "react-bootstrap";
import { SatelliteDataFilters, AuxDataFilters } from "../../components/DataFilterGroup";
import { seasonNames } from '../../utils/constants'
import { SeasonFilterGroup } from "../../components/SeasonFilterGroup";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash"
import * as d3 from "d3"
import { layerControlRef } from "../../components/LeafletMap";
import { replace, setResult } from "../../features/sampleSlice";
import { idField } from "../../panels/SamplePanel";
import { useEffect } from "react";
import { actions } from "../../features/seasonSlice"
import DateRangeFilters from "../../components/DateRangeFilters";



export default function PhenologyLeft(props) {

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

    jsonData['dataset'] = _.cloneDeep(datasetFilters)
    delete jsonData.dataset.boundary_file

    let samples = _.cloneDeep(sampleState.geojson)

    // get rid of existing phenology info
    samples.features.forEach(feature => {
      Object.keys(feature.properties).forEach(key => {
        if (key.endsWith('_feature')) {
          delete feature.properties[key]
        }
      })
    })

    jsonData['samples'] = samples
    jsonData['phenology_dates'] = sampleState.phenology

    // send request
    axios.post("phenology/", jsonData, {
      baseURL: process.env.PUBLIC_URL,
      headers: {
        "X-CSRFToken": csrfToken,
      },
      
    }).then(response => {
      let res_body = response.data

      // update the properties of the existing samples
      // let new_samples = samples
      res_body.features.forEach(feature => {
        let cur_feature = samples.features.filter(v => v.properties[idField] === feature.properties[idField])[0]
        cur_feature.properties = feature.properties
      })
      dispatch(replace(samples))

      setLoading(false)

    }).catch(reason => {
      setLoading(false)
      alert(reason)
    })

    // set loading state
    setLoading(true)

  }

  
  return (
    <div className="h-100 flex-column p-2">
    
      <Form method="POST" noValidate validated={validated} onSubmit={handleSubmit}>
        <SatelliteDataFilters />
        {/* <AuxDataFilters /> */}

        {/* <DateRangeFilters /> */}
      
        <Button className="w-100" type="submit" variant={ loading ? "secondary" : "primary" } disabled={loading}>
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
      </Form>

    </div>
  )
}