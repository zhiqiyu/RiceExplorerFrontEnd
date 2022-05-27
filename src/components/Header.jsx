import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BrowserRouter, Link, NavLink, Route, Switch } from 'react-router-dom'

export default () => {
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}