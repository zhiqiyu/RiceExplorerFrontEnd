import axios from "axios"
import { Fragment, useState } from "react"
import { Accordion, Badge, Button, Col, Form, Modal, Row, Table } from "react-bootstrap"
import {saveAs} from 'file-saver'

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

const state2color = {
  'COMPLETED': 'success',
  'RUNNING': 'secondary',
  'READY': 'primary',
  'FAILED': 'danger',
  'CANCELLED': 'warning'
}

export const ExportStatus = () => {

  const [tasks, setTasks] = useState([])
  const [task, setTask] = useState(null)
  const [show, setShow] = useState(false)
  const [taskId, setTaskId] = useState(null)
  const [loading, setLoading] = useState(false)

  const refreshTasks = () => {
    axios.get("tasks/")
        .then((v) => {
          setTasks(v.data)
        })
  }

  const handleOpenStatus = (e) => {
    refreshTasks()
    setShow(true)
  }

  const handleHide = (e) => {
    setShow(false)
    setTask(null)
    setTaskId(null)
  }

  const handleSearchTask = (e) => {
    setLoading(true)
    axios.get("tasks/" + taskId)
        .then(v => {
          setTask(v.data)
          setLoading(false)
          if (v.data === null) {
            alert("Task not found")
          }
        })
  }

  const handleDownloadFile = (e) => {
    axios.get("download/" + taskId, {responseType: 'blob'})
        .then(v => {
          saveAs(new Blob([v.data], {type: "image/tiff"}), taskId + ".tif")
        }) 
  }

  return (
    <Fragment>
      <Button size="sm" variant="info" onClick={handleOpenStatus}>
        Export Status
      </Button> 

      <Modal size='lg' show={show} onHide={handleHide}>
        <Modal.Header>
          Task Status
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
            <Form.Label column sm="auto">
              Task ID
            </Form.Label>
            <Col sm>
              <Form.Control value={taskId} onChange={e=>setTaskId(e.target.value)}/>
            </Col>
            <Col sm="auto">
              <Button disabled={loading} onClick={handleSearchTask}>
              {loading ? "Loading" : "Search"}
              </Button>
            </Col>
          </Form.Group>
          
          <Accordion>
            {task !== null ?
              <Accordion.Item eventKey={task.id}>
                <Accordion.Header>
                  <Badge 
                    bg={state2color[task.state]}
                  >
                    {task.state}
                  </Badge> {'  '}{task.id} 
                  
                </Accordion.Header>
                <Accordion.Body>
                  {json2table(task)}

                  {task.state === "COMPLETED" ? 
                    <Button size="sm" onClick={handleDownloadFile}>
                      Download
                    </Button>
                  : null}
                </Accordion.Body>
              </Accordion.Item>
            : null}
          </Accordion>
          
          {/* <Accordion>
            {tasks.map((task, i) => (
              <Accordion.Item eventKey={task.id}>
                <Accordion.Header>
                  <Badge 
                    bg={state2color[task.state]}
                  >
                    {task.state}
                  </Badge> {'  '}{task.id} 
                </Accordion.Header>
                <Accordion.Body>
                  {json2table(task)}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion> */}
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}