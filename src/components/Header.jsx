import { Container, Nav, Navbar } from 'react-bootstrap';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'

export default () => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" className="header" fixed="top">
        <Container fluid>
          <Navbar.Brand href="/">Crop Mapping Explorer</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link to={"/empirical"} as={Link}>Empirical Thresholding</Nav.Link>
              <Nav.Link to={"/phenology"} as={Link}>Phenology Explorer</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}