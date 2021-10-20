import { useContext, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Button, ButtonGroup, Card, ListGroup, Table } from "react-bootstrap";
import shp from "shpjs";
import L from "leaflet";
import { map, layerControlRef, addTileOverlays, panToLatLng, geojsonLayer, setGeojsonLayer } from "../LeafletMap";
import { useDispatch, useSelector } from "react-redux";
import {
  replace,
  addFeatures,
  selectFeature,
} from "../../features/phenology/sampleSlice";
import { useEffect } from "react";
import Chart from "react-google-charts";
import _, { sample } from 'lodash'
import { FileEarmarkArrowUpFill, Upload } from "react-bootstrap-icons";

const json2table = (json) => {
  return (
    <Table striped bordered hover>
      <thead>
        <th>key</th>
        <th>value</th>
      </thead>
      <tbody>
        {Object.entries(json).map(([key, val]) => (
          <tr>
            <td>{key}</td>
            <td>{val}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const computeMean = (geojson) => {
  let features = geojson.features
  let res = {}
  features.forEach(feature => {
    Object.keys(feature.properties).forEach(key => {
      if (key in res) {
        res[key].push(feature.properties[key])
      } else {
        res[key] = []
      }
    })
  })
  Object.keys(res).forEach(key => {
    res[key] = _.mean(res[key])
  })
  return Object.entries(res)
}

// const prepareChartData = (seasons) => {
//   console.log(seasons)
//   let chartData = [['date', ...Object.keys(seasons)]]
//   let combined_data = {}
//   Object.keys(seasons).forEach(season => {
//     let season_feature = seasons[season]
//     season_feature.properties.forEach(([key, val]) => {
//       let words = key.split("_")
//       let date = new Date(Number.parseInt(words[words.length - 2])).getTime()
//       combined_data[date] = val
//     })
//   }) 
//   Object.keys(combined_data).sort((a,b)=>Number.parseInt(a)-Number.parseInt(b)).forEach(date => {
//     chartData.push([new Date(Number.parseInt(date)), combined_data[date]])
//   })
//   return chartData
// }

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
  
  // Object.keys(seasons).forEach((season, i) => {
  //   Object.keys(seasons[season]).sort((a,b)=>Number.parseInt(a)-Number.parseInt(b)).forEach(date => {
  //     let row = Array(chartData[0].length).fill(null)
  //     row[0] = new Date(Number.parseInt(date))
  //     row[i+1] = seasons[season][date]
  //     chartData.push(row)
  //   })
  // })
  return chartData
}

// let geojsonLayer = null

export const idField = "_$id"

export default function SamplePanel() {
  const [invalidFile, setInvalidFile] = useState(true);
  const [chartData, setChartData] = useState(null)

  const sampleState = useSelector((state) => state.samples);
  const dispatch = useDispatch();

  // console.log(sampleState.geojson)
  useEffect(() => {
    if (typeof sampleState.selected === 'number') {
      // console.log(sampleState.selected.geometry.coordinates.reverse())
      let selected_sample = sampleState.geojson.features.filter(f => f.properties[idField] === sampleState.selected)[0]
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

  const handleUploadFile = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      let geojson = await shp(await file.arrayBuffer());
      geojson.features.forEach((feature, i)=> {
        feature.properties[idField] = i
      })
      if (geojson.features[0].geometry.type !== "Point") {
      }

      // create geojson layer
      let layer = L.geoJSON(geojson, {
        pointToLayer: (geoJsonPoint, latlng) => {
          if (geoJsonPoint.properties[sampleState.classProperty.name] === sampleState.classProperty.positiveValue) {
            return L.circleMarker(latlng, {
              radius: 3, 
              fillColor: "red", 
              stroke: 0.2,
              color: "black",
              opacity: 0.5,
              fillOpacity: 1,
            })
          } else {
            return L.circleMarker(latlng, {
              radius: 3, 
              fillColor: "blue", 
              stroke: 0.2,
              color: "black",
              opacity: 0.5,
              fillOpacity: 1
            })
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
      // .bindPopup(layer => {
      //   return ReactDOMServer.renderToString(json2table(layer.feature.properties))
      // }, {
      //   maxHeight: "400",
      //   maxWidth: "400",
      // })
      layer.addTo(map);
      
      setGeojsonLayer(layer)

      let overlays = [
        {
          layer: layer,
          name: file.name,
        },
      ];
      addTileOverlays(overlays);

      dispatch(replace(geojson));
    }
  };

  const handleSelectSample = (idx) => {
    dispatch(selectFeature(idx));
  };

  return (
    <div className="sidebar h-100 d-flex flex-column">
      {/* <div className="tabs-nav p-1">
        <Button
          variant="primary"
          size="sm"
          className="h-100 w-100"
          as="label"
          htmlFor="sample-upload"
        >
          Upload Sample
        </Button>
        <input
          type="file"
          className="d-none"
          id="sample-upload"
          onChange={handleUploadFile}
        />
      </div> */}

      <div className="sample-container p-1 ">
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
            </div>
          </Card.Header>
          <Card.Body className="p-2">
            <ListGroup className="sample-list">
              {sampleState.geojson &&
                sampleState.geojson.features.map((feature, idx) => (
                  <ListGroup.Item
                    action
                    className="px-3 py-1"
                    key={idx}
                    onClick={() => handleSelectSample(feature.properties[idField])}
                    active={feature.properties[idField] === sampleState.selected}
                    style={{backgroundColor: feature.properties[sampleState.classProperty.name] === sampleState.classProperty.positiveValue ? "lightgreen" : null}}
                  >
                    {`${feature.properties[idField]} - ${feature.properties[sampleState.classProperty.name]}`}
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </div>

      <div className="chart-canvas p-1">
        <div className="w-100 h-100 bg-white">
        {chartData ?
          <Chart 
            width="100%" 
            height="100%" 
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
            }}
            rootProps={{ 'data-testid': '1' }}
          />
          :
          "Click on an sample to see its phenology"
        }
        </div>
      </div>
    </div>
  );
}
