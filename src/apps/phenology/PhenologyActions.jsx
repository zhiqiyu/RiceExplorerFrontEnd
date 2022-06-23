import { Button, Col, Form, Nav, Row, Spinner, TabContainer, TabContent, TabPane, Stack } from "react-bootstrap";
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
import { useEffect } from "react";
import { actions } from "../../features/seasonSlice"
import DateRangeFilters from "../../components/DateRangeFilters";

import { appendLog } from "../../features/logSlice";
import { idField } from "../../components/SampleContainer";

export const PhenologyActions = () => {

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

    }).catch(error => {
      setLoading(false)
      alert(error.response.data)
    })

    // set loading state
    setLoading(true)


  }
  
  return (
    <Stack direction="horizontal" gap={2}>

      <Button 
        size="sm" 
        onClick={handleSubmit}
        variant={ loading ? "secondary" : "primary"} 
        disabled={loading}
        style={{"width": "100px"}}
      >
        {loading 
          ? ( 
            <div className="d-flex align-items-center">
              <Spinner as="span" animation="border" size="sm" role="status" ></Spinner>
              <div>Running </div>
            </div> 
            ) 
          : 
          "Save settings"
        }
      </Button>
    </Stack>
  )
}