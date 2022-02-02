import { useContext, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Button, ButtonGroup, Card, Form, ListGroup, Table } from "react-bootstrap";
import shp from "shpjs";
import L from "leaflet";
import { map, layerControlRef, addTileOverlays, panToLatLng, geojsonLayer, setGeojsonLayer, addGeoJsonOverlay } from "../LeafletMap";
import { useDispatch, useSelector } from "react-redux";
import {
  replace,
  addFeatures,
  selectFeature,
  setClassProperty,
  deleteFeature
} from "../../features/phenology/sampleSlice";
import { useEffect } from "react";
import Chart from "react-google-charts";
import _, { sample } from 'lodash'
import { FileEarmarkArrowUpFill, SaveFill, TrashFill, Upload } from "react-bootstrap-icons";
import { saveAs } from 'file-saver'

const json2table = (json) => {
  return (
    <Table striped bordered hover>
      <thead>
        <th>key</th>
        <th>value</th>
      </thead>
      <tbody>
        {Object.entries(json).map(([key, val]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{val}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const prepareChartData = (sample) => {
  let curve_data = {}
  Object.entries(sample.properties).forEach(([key, val]) => {
    if (key.endsWith('_feature')) {
      let words = key.split('_')
      let date = new Date(Number.parseInt(words[words.length - 2])).getTime()
      curve_data[date] = val
    }
  })

  if (Object.keys(curve_data).length === 0) {
    return null
  }

  let chartData = [['date', 'value']]

  Object.keys(curve_data).sort((a,b)=>Number.parseInt(a)-Number.parseInt(b)).forEach(date => {
    let row = Array(chartData[0].length).fill(null)
    row[0] = new Date(Number.parseInt(date))
    row[1] = curve_data[date]
    chartData.push(row)
  })
  
  return chartData
}

// let geojsonLayer = null

export const idField = "_$id"

export default function SamplePanel() {
  const [invalidFile, setInvalidFile] = useState(true);
  const [chartData, setChartData] = useState(null);

  // const [fieldState, setFieldState] = useState(null);
  // const [positiveValueState, setPositiveValueState] = useState(null);

  const sampleState = useSelector((state) => state.samples);
  const dispatch = useDispatch();

  // console.log(sampleState.geojson)
  useEffect(() => {
    if (typeof sampleState.selected === 'number') {
      // console.log(sampleState.selected.geometry.coordinates.reverse())
      let selected_sample = sampleState.geojson.features.filter(f => f.properties[idField] == sampleState.selected)[0]
      let latlon = [...selected_sample.geometry.coordinates].reverse()
      panToLatLng(latlon)
      if (geojsonLayer) {
        // geojsonLayer.openPopup(latlon)
        // let a = L.geoJSON()
        // a.eachLayer(layer => layer.fea)
        geojsonLayer.eachLayer(layer => {
          if (layer.feature.properties[idField] === sampleState.selected) {
            layer.openPopup(latlon)
          }
        })
      }
      
      setChartData(prepareChartData(selected_sample))
    }
  }, [sampleState.selected, sampleState.geojson])

  useEffect(() => {
    if (sampleState.classProperty.name === null) return;

    geojsonLayer.eachLayer(layer => {
      let geoJsonPoint = layer.feature;
      if (geoJsonPoint.properties[sampleState.classProperty.name] == sampleState.classProperty.positiveValue) {
        layer.setStyle({
          radius: 3, 
          fillColor: "red", 
          stroke: 0.2,
          color: "black",
          opacity: 0.5,
          fillOpacity: 1,
        })
      } else {
        layer.setStyle({
          radius: 3, 
          fillColor: "blue", 
          stroke: 0.2,
          color: "black",
          opacity: 0.5,
          fillOpacity: 1
        })
      }
    })

  }, [sampleState.classProperty])

  return (
    <div className="sidebar h-100 d-flex flex-column">
      
      <div className="sample-container px-2 pt-2">
        <SampleContainer />
      </div>

      <div className="chart-canvas p-2">
        <Card className="h-100 w-100">
          <Card.Body className="p-2">
          {chartData ?
            <Chart 
              width="100%" 
              height="90%" 
              chartType="LineChart" 
              loader={<div>Loading Chart...</div>} 
              data={chartData}
              options={{
                hAxis: {
                  title: 'Date',
                  format: "yyyy-MM-dd"
                },
                vAxis: {
                  title: 'Value',
                },
                legend: {
                  position: 'bottom'
                },
              }}
              rootProps={{ 'data-testid': '1' }}
            />
            :
            "Click on an sample to see its phenology"
          }
          </Card.Body>
        </Card>
        {/* <div className="chart-canvas w-100 h-100 p-2">
        {chartData ?
          <Chart 
            width="100%" 
            height="90%" 
            chartType="LineChart" 
            loader={<div>Loading Chart...</div>} 
            data={chartData}
            options={{
              hAxis: {
                title: 'Date',
                format: "yyyy-MM-dd"
              },
              vAxis: {
                title: 'Value',
              },
              legend: {
                position: 'bottom'
              },
            }}
            rootProps={{ 'data-testid': '1' }}
          />
          :
          "Click on an sample to see its phenology"
        }
        </div> */}
      </div>
    </div>
  );
}

const POSITIVE_STYLE = {
  radius: 3, 
  fillColor: "red", 
  stroke: 0.2,
  color: "black",
  opacity: 0.5,
  fillOpacity: 1,
}

const NEGATIVE_STYLE = {
  radius: 3, 
  fillColor: "blue", 
  stroke: 0.2,
  color: "black",
  opacity: 0.5,
  fillOpacity: 1,
}

export const SampleContainer = () => {

  const [fieldState, setFieldState] = useState(null);
  const [positiveValueState, setPositiveValueState] = useState(null);

  const sampleState = useSelector((state) => state.samples);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sampleState.classProperty.name === null) return;

    geojsonLayer.eachLayer(layer => {
      let geoJsonPoint = layer.feature;
      if (geoJsonPoint.properties[sampleState.classProperty.name] === sampleState.classProperty.positiveValue) {
        layer.setStyle(POSITIVE_STYLE)
      } else {
        layer.setStyle(NEGATIVE_STYLE)
      }
    })

  }, [sampleState.classProperty])


  const handleUploadFile = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      let geojson = await shp(await file.arrayBuffer());
      geojson.features.forEach((feature, i)=> {
        feature.properties[idField] = i+1   // avoid using 0 to prevent it getting cast to false
      })

      // if (geojson.features[0].geometry.type !== "Point") {
      // }

      // create geojson layer
      let layer = L.geoJSON(geojson, {
        pointToLayer: (geoJsonPoint, latlng) => {
          if (geoJsonPoint.properties[sampleState.classProperty.name] === sampleState.classProperty.positiveValue) {
            return L.circleMarker(latlng, POSITIVE_STYLE)
          } else {
            return L.circleMarker(latlng, NEGATIVE_STYLE)
          }
        },
        onEachFeature: (feature, layer) => {
          layer.bindPopup(layer => {
            return ReactDOMServer.renderToString(json2table(layer.feature.properties))
          }, {
            maxHeight: "400",
            maxWidth: "400",
          })
        }
      })
      layer.addTo(map);
      
      setGeojsonLayer(layer)

      // let overlays = [
      //   {
      //     layer: layer,
      //     name: file.name,
      //   },
      // ];
      addGeoJsonOverlay();

      dispatch(replace(geojson));
    }
  };

  const handleSelectClassField = (field) => {
    dispatch(setClassProperty({
      name: field,
      positiveValue: null,
    }))
  }

  const handleChangeClassValue = (value) => {
    dispatch(setClassProperty({
      positiveValue: value
    }))
  }

  const handleSaveSamples = (e) => {
    console.log(sampleState.geojson)
    const json_blob = new Blob([JSON.stringify(sampleState.geojson)], {type: "application/json"})
    saveAs(json_blob, "samples.geojson")
  }

  return (
    <Card className="h-100">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="m-0 p-0">
              Samples { `(count: ${sampleState.geojson.features.length})`}
            </h6>
          </div>
          <div>
            <Button
              variant="light"
              size="sm"
              className="h-100 w-100 px-0"
              as="label"
              htmlFor="sample-upload"
            >
              <FileEarmarkArrowUpFill />
            </Button>
            <input
              type="file"
              className="d-none"
              id="sample-upload"
              onChange={handleUploadFile}
            />
          </div>
          <div>
            <Button
              variant="light"
              size="sm"
              className="h-100 w-100 px-0"
              onClick={handleSaveSamples}
            >
              <SaveFill />
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="p-2">
        <div className="container card mb-2">
          <div className="p-2">
            <div className="row align-items-center mb-2">
              <div className="col-auto">Class field:</div>
              <div className="col">
                <Form.Select 
                  className="w-100"
                  value={sampleState.classProperty.name || ""}
                  disabled={!!!sampleState.geojson.features.length}
                  onChange={e => handleSelectClassField(e.target.value)}
                >
                  <option></option>
                  {sampleState.geojson.features.length !== 0 && Object.keys(sampleState.geojson.features[0].properties).map(k => (
                    <option key={k}>{k}</option>
                  ))}
                </Form.Select>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-auto">Class value:</div>
              <div className="col"> 
                <Form.Select 
                  value={sampleState.classProperty.positiveValue || ""}
                  disabled={!!!sampleState.classProperty.name}
                  onChange={e => handleChangeClassValue(e.target.value)}
                >
                  <option></option>
                  {sampleState.geojson.features.length !== 0 && [...new Set(sampleState.geojson.features.map(feature => feature.properties[sampleState.classProperty.name]))].map(v => {
                    return (<option key={v}>{v}</option>)
                  })
                  }
                </Form.Select>
              </div>
            </div>
          </div>
        </div>

        <ListGroup className="sample-list">
          {sampleState.geojson &&
            sampleState.geojson.features.map((feature, idx) => (
              <SampleItem feature={feature} idx={idx} />
            ))}
        </ListGroup>
      </Card.Body>
    </Card>
  )

}


const SampleItem = (props) => {

  const { idx, feature } = props;

  const sampleState = useSelector(state => state.samples)
  const dispatch = useDispatch()

  const handleSelectSample = (idx) => {
    dispatch(selectFeature(idx));
  };

  const handleDelete = (e, id) => {
    e.stopPropagation()
    console.log(id)
    geojsonLayer.eachLayer(layer => {
      
      if (id === layer.feature.properties[idField]) {
        geojsonLayer.removeLayer(layer)
      }
    })
    dispatch(deleteFeature(id))
    dispatch(selectFeature(null))
  }

  return (
    <ListGroup.Item
      action
      className="px-3 py-1"
      key={idx}
      onClick={() => handleSelectSample(feature.properties[idField])}
      active={feature.properties[idField] == sampleState.selected}
      style={{backgroundColor: feature.properties[sampleState.classProperty.name] == sampleState.classProperty.positiveValue ? "lightgreen" : null}}
    >
      <div className="d-flex align-items-center flex-row justify-content-between">
        <div>
          {`${feature.properties[idField]} - ${feature.properties[sampleState.classProperty.name]}`}
        </div>
        <div >
          <Button
            variant="light"
            size="sm"
            className="h-100 w-100 px-0 bg-transparent"
            as="label"
            onClick={(e) => handleDelete(e, feature.properties[idField])}
          >
            <TrashFill />
          </Button>
        </div>
      </div>
      
    </ListGroup.Item>
  )
}