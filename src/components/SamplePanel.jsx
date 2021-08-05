import { useContext } from "react";
import { Button, ButtonGroup, Card, ListGroup } from "react-bootstrap";
import PhenologyContext from "../context/PhenologyContext";


export default function SamplePanel() {

  const ctx = useContext(PhenologyContext)

  const handleChangeEditing = (e) => {
    ctx.setEditing((prev) => !prev)
  }

  return (
    <div className="sidebar h-100 d-flex flex-column">
      <div className="tabs-nav p-1">
        <Button variant={ctx.editing ? "warning" : "primary"} size="sm" className="w-100 h-100" onClick={handleChangeEditing}>Start Editing</Button>
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