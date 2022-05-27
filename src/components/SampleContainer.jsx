import ReactDOMServer from "react-dom/server";
import { Button, ButtonGroup, Card, Col, Container, Form, ListGroup, Modal, Nav, Row, Stack, TabContainer, TabContent, Table, TabPane } from "react-bootstrap";
import shp from "shpjs";
import L from "leaflet";
import { map, layerControlRef, addTileOverlays, panToLatLng, geojsonLayer, setGeojsonLayer, addGeoJsonOverlay } from "../components/LeafletMap";
import { useDispatch, useSelector } from "react-redux";
import {
  replace,
  addFeatures,
  selectFeature,
  setClassProperty,
  deleteFeature
} from "../features/sampleSlice";
import { useEffect } from "react";
import _, { sample } from 'lodash'
import { ArrowsFullscreen, FileEarmarkArrowUpFill, SaveFill, TrashFill, Upload } from "react-bootstrap-icons";
import { saveAs } from 'file-saver'


export const idField = "_$id"

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
            <td>{JSON.stringify(val)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};


export const SampleContainer = () => {


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
      
      
    }
  }, [sampleState.selected, sampleState.geojson])


  const handleUploadFile = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];
      let geojson = await shp(await file.arrayBuffer());
      geojson.features.forEach((feature, i)=> {
        feature.properties[idField] = i+1   // avoid using 0 to prevent it getting cast to false
      })

      // if (geojson.features[0].geometry.type !== "Point") {
      // }
      if (geojsonLayer) {
        map.removeLayer(geojsonLayer)
      }
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
    <Card className="h-100 w-100 overflow-auto">
      <Card.Header>
        <Stack direction="horizontal" gap={2}>
          <div className="me-auto">
            <h6 className="m-0 p-0">
              Samples { `(count: ${sampleState.geojson.features.length})`}
            </h6>
          </div>

          <div>
            <Button
              variant="primary"
              size="sm"
              className="h-100 w-100"
              as="label"
              htmlFor="sample-uploa"
            >
              Upload
            </Button>
            <input
              type="file"
              className="d-none"
              id="sample-uploa"
              onChange={handleUploadFile}
            />
          </div>
          <div>
            <Button
              variant="secondary"
              size="sm"
              className="h-100 w-100"
              onClick={handleSaveSamples}
            >
              Download
            </Button>
          </div>

        </Stack>

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