import { useContext, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Button, ButtonGroup, Card, ListGroup, Table } from "react-bootstrap";
import shp from "shpjs";
import L from "leaflet";
import { map, layerControlRef, addTileOverlays, panToLatLng } from "./LeafletMap";
import { useDispatch, useSelector } from "react-redux";
import {
  replace,
  addFeatures,
  selectFeature,
} from "../features/phenology/sampleSlice";
import { useEffect } from "react";
import Chart from "react-google-charts";
import _ from 'lodash'

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

const prepareChartData = (seasons) => {
  let chartData = [['date', 'mean']]
  let combined_data = {}
  Object.keys(seasons).forEach(season => {
    let season_res = seasons[season]
    let features = season_res.features
    
    features.forEach(feature => {
      Object.entries(feature.properties).forEach(([key, val]) => {
        let words = key.split("_")
        let date = new Date(Number.parseInt(words[words.length - 2])).getTime()
        if (date in combined_data) {
          combined_data[date].push(val)
        } else {
          combined_data[date] = []
        }
      })
    })
  }) 
  Object.keys(combined_data).sort((a,b)=>Number.parseInt(a)-Number.parseInt(b)).forEach(date => {
    let mean = _.mean(combined_data[date])
    chartData.push([new Date(Number.parseInt(date)), mean])
  })
  return chartData

  // let data = computeMean(geojson)
  // let data_modified = data.map(([key, val]) => {
  //   let words = key.split("_")
  //   let date = words[words.length - 2]
  //   return [date, val]
  // })
  // return [['date', 'value'], ...data_modified]
  
}

let geojsonLayer = null

export default function SamplePanel() {
  const [invalidFile, setInvalidFile] = useState(true);
  const [chartData, setChartData] = useState(null)

  const sampleState = useSelector((state) => state.samples);
  const dispatch = useDispatch();

  // console.log(sampleState.geojson)
  useEffect(() => {
    if (sampleState.selected) {
      // console.log(sampleState.selected.geometry.coordinates.reverse())
      let latlon = [...sampleState.selected.geometry.coordinates].reverse()
      panToLatLng(latlon)
      if (geojsonLayer) {
        geojsonLayer.openPopup(latlon)
      }
    }
  }, [sampleState.selected])

  useEffect(() => {
    if (sampleState.results) {
      let data = prepareChartData(sampleState.results)
      setChartData(data)
    }
  }, [sampleState.results])

  const handleUploadFile = async (e) => {
    let file = e.target.files[0];
    let geojson = await shp(await file.arrayBuffer());
    if (geojson.features[0].geometry.type !== "Point") {
    }
    let layer = L.geoJSON(geojson).bindPopup(
      (layer) =>
        ReactDOMServer.renderToString(json2table(layer.feature.properties)),
      {
        maxHeight: "300",
        maxWidth: "400",
      }
    );
    layer.addTo(map);
    
    geojsonLayer = layer

    let overlays = [
      {
        layer: layer,
        name: file.name,
      },
    ];
    addTileOverlays(overlays);

    dispatch(replace(geojson));
  };

  const handleSelectSample = (idx) => {
    dispatch(selectFeature(idx));
  };

  return (
    <div className="sidebar h-100 d-flex flex-column">
      <div className="tabs-nav p-1">
        {/* <Button variant={ctx.editing ? "warning" : "primary"} size="sm" className="w-100 h-100" onClick={handleChangeEditing}>Start Editing</Button> */}
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
      </div>

      <div className="sample-container p-1 ">
        <Card className="h-100">
          <Card.Header>
            <h6 className="m-0 p-0">
              Samples { `(count: ${sampleState.geojson.features.length})`}
            </h6>
          </Card.Header>
          <Card.Body className="p-2">
            <ListGroup className="sample-list">
              {sampleState.geojson &&
                sampleState.geojson.features.map((feature, idx) => (
                  <ListGroup.Item
                    action
                    className="px-3 py-1"
                    key={idx}
                    onClick={() => handleSelectSample(idx)}
                    active={feature === sampleState.selected}
                  >
                    {feature.properties._id}
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </div>

      <div className="chart-canvas p-1">
        <div className="w-100 h-100 bg-white">
        {chartData && 
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
        }
        </div>
      </div>
    </div>
  );
}
