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
import { actions, modifySeason } from "../../features/seasonSlice"
import DateRangeFilters from "../../components/DateRangeFilters";

import { appendLog } from "../../features/logSlice";
import { idField } from "../../components/SampleContainer";


const removeOutliers = (arr) => {
  let first = d3.quantile(arr, 0.25)
  let third = d3.quantile(arr, 0.75)
  let interquatile = third - first
  let upperbound = third + interquatile * 1.5
  let lowerbound = first - interquatile * 1.5
  return arr.filter(element => element > lowerbound && element < upperbound)
}



export const PhenologyActions = () => {

  const csrfToken = useSelector(state => state.csrfToken)
  const datasetFilters = useSelector(state => state.dataset)
  const seasonFilters = useSelector(state => state.seasons)
  const sampleState = useSelector(state => state.samples)
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


  const handleRefresh = (e) => {
    if (sampleState.geojson.features.length === 0) {
      alert("Please upload the ground truth samples first.")
      return;
    }

    seasonFilters.seasons.forEach(seasonFilter => { 
      // let seasonFilter = seasonFilters[season];
      
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
      
      // let action = actions[season];
      dispatch(modifySeason({
        "name": seasonFilter.name,
        "min": (mean - std).toFixed(2), 
        "max": (mean + std).toFixed(2)
      }))
      
    })
  }
  
  return (
    <Stack direction="horizontal" gap={2}>

      <Button 
        size="sm" 
        onClick={handleSubmit}
        variant={ loading ? "secondary" : "primary"} 
        disabled={loading}
        style={{"width": "150px"}}
      >
        {loading 
          ? ( 
            <div className="d-flex align-items-center justify-content-center">
              <Spinner as="span" animation="border" size="sm" role="status" ></Spinner>
              <div>Running </div>
            </div> 
            ) 
          : 
          "Get Phenology"
        }
      </Button>

      <Button
        size="sm"
        onClick={handleRefresh}
      >
        Calculate Thresholds
      </Button>
    </Stack>
  )
}