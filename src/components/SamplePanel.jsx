import { useContext } from "react";
import { Button, ButtonGroup, Card, ListGroup } from "react-bootstrap";
import shp from "shpjs"
import L from "leaflet"
import { map, layerControlRef, addOverlays } from "./LeafletMap";

export default function SamplePanel() {

  const handleUploadFile = async (e) => {
    let file = e.target.files[0]
    let geojson = await shp(await file.arrayBuffer())
    let layer = L.geoJSON(geojson).addTo(map)
    let overlays = [{
      layer: layer,
      name: file.name
    }]
    addOverlays(overlays)
  }

  return (
    <div className="sidebar h-100 d-flex flex-column">
      <div className="tabs-nav p-1">
        {/* <Button variant={ctx.editing ? "warning" : "primary"} size="sm" className="w-100 h-100" onClick={handleChangeEditing}>Start Editing</Button> */}
        <Button variant="primary" size="sm" className="h-100 w-100"  as="label" htmlFor="sample-upload">Upload Sample</Button>
        <input type="file" className="d-none" id="sample-upload" onChange={handleUploadFile} />
      </div>

      <div className="p-1 sample-container">
        <Card className="h-100">
          <Card.Header>
            <h6 className="m-0 p-0">Samples</h6>
          </Card.Header>
          <Card.Body className="p-2">
            {Array(100).fill('hello').map((val, idx) => (
              <ListGroup.Item key={idx}>{val}</ListGroup.Item>
            ))}
            {/* <ListGroup className="sample-list"> */}
              
              {/* <ListGroup.Item></ListGroup.Item> */}
            {/* </ListGroup> */}
          </Card.Body>
        </Card>
      </div>

      <div className="chart-canvas p-1">
        <div className="w-100 h-100 bg-light"></div>
      </div>  

    </div>
  )
}