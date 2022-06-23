import axios from 'axios'
import {saveAs} from 'file-saver'

import { Dropdown, DropdownButton } from "react-bootstrap"
import { useSelector } from "react-redux"

import _ from "lodash";
import { useDispatch } from 'react-redux';
import { appendLog } from '../features/logSlice';


export const ExportImages = ({downloadUrl}) => {

  const csrfToken = useSelector(state => state.csrfToken)
  const datasetFilters = useSelector(state => state.dataset)
  const seasonFilters = useSelector(state => state.seasons)
  const appName = useSelector(state => state.appName)
  const classificationState = useSelector(state => state.classification)
  const sampleState = useSelector(state => state.samples)

  const dispatch = useDispatch()

  const handleExport = (key) => {
    if (key === 'toJpeg') {
      // export to jpeg\
      if (downloadUrl !== "") {
        saveAs(downloadUrl, 'result.jpg')
      }
    } else {
      // export to google drive
      const formData = new FormData()
      const jsonData = {}

      if (appName === "empirical") {
        
        jsonData['op'] = seasonFilters.op
        jsonData['seasons'] = seasonFilters.seasons

        jsonData['dataset'] = _.cloneDeep(datasetFilters)
        if (jsonData['dataset'].boundary_file) {
          formData.append('boundary_file', jsonData['dataset'].boundary_file)
          delete jsonData['dataset'].boundary_file
        } 

        formData.append('json', new Blob([JSON.stringify(jsonData)], {
          type: 'application/json'
        }));
      } else if (appName === "classification") {

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
      }

      
      axios.post(appName + "/export", formData, {
        baseURL: process.env.PUBLIC_URL,
        headers: {
          "X-CSRFToken": csrfToken,
        },
        
      }).then(response => {
        let res_body = response.data
        // console.log(res_body)
        dispatch(appendLog("Export task ID: <b>" + res_body + "</b>. Please use this ID to check export task status."))

      }).catch(error => {
        // setLoading(false)
        dispatch(appendLog("<b>Failed</b> with the reason: " + error.response.data))
      })

      dispatch(appendLog("Run export task with parameters: <br>" + JSON.stringify(jsonData)))
    }
  }

  return (
    <DropdownButton 
      id="export-dropdown" 
      size="sm"
      title="Export" 
      onSelect={(key, e) => handleExport(key)}
    >
      <Dropdown.Item eventKey="toJpeg" disabled={downloadUrl===""}>Download as thumbnail</Dropdown.Item>
      <Dropdown.Item eventKey="toDrive">Export to Google Drive</Dropdown.Item>
    </DropdownButton>
  )
}