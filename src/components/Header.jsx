import axios from 'axios';
import { useState } from 'react';
import { Accordion, Badge, Button, Container, Modal, Nav, Navbar, NavDropdown, Table } from 'react-bootstrap';
import { BrowserRouter, Link, NavLink, Route, Switch } from 'react-router-dom'

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

export default () => {

  const [tasks, setTasks] = useState([])

  const [show, setShow] = useState(false)

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

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className='header' fixed='top'>
      <Container fluid>
        <Navbar.Brand href="/">RiceMapEngine</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link to={"/phenology"} as={NavLink}>Phenology Explorer</Nav.Link>
            <NavDropdown title="Rice Mapping">
              <NavDropdown.Item to={"/empirical"} as={NavLink}>
                Empirical Thresholding
              </NavDropdown.Item>

              <NavDropdown.Item to={"/classification"} as={NavLink}>
                Supervised Classification
              </NavDropdown.Item>
            </NavDropdown>
            
          </Nav>

          <Button size="sm" onClick={handleOpenStatus}>
            Export Status
          </Button>
        </Navbar.Collapse>
      </Container>

      <Modal size='lg' show={show} onHide={() => setShow(false)}>
        <Modal.Header>
          Task Status
        </Modal.Header>
        <Modal.Body>
          <Accordion>
            {tasks.map((task, i) => (
              <Accordion.Item eventKey={task.id}>
                <Accordion.Header>
                  <Badge 
                    bg={state2color[task.state]}
                  >
                    {task.state}
                  </Badge> {'  '}{task.description} 
                </Accordion.Header>
                <Accordion.Body>
                  {json2table(task)}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Modal.Body>
      </Modal>
    </Navbar>
  )
}