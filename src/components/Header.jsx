import { Button, Container, Nav, Navbar, NavDropdown, Stack } from 'react-bootstrap';
import { BoxArrowUpRight } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import { NavLink, Route, Switch } from 'react-router-dom'
import { ClassificationActions } from '../apps/classification/ClassificationActions';
import { EmpiricalActions } from '../apps/empirical/EmpiricalActions';
import { PhenologyActions } from '../apps/phenology/PhenologyActions';
import { ExportStatus } from './ExportStatus';




export default () => {
  
  const appName = useSelector(state => state.appName)

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
            
            <Nav.Link href={process.env.PUBLIC_URL + '/user-manual.html'} target="_blank">
              <div className="d-flex align-items-center">
                <div className="pe-1">User Manual</div>
                <BoxArrowUpRight />
              </div>
            </Nav.Link>
          </Nav>

          <Stack direction="horizontal" gap={2}>
            {appName === "classification" ?
              <ClassificationActions />
            : (
              appName === "empirical" ?
              <EmpiricalActions />
              : 
              <PhenologyActions />
            )

            }


            <ExportStatus />

          </Stack>
          
        </Navbar.Collapse>
      </Container>


    </Navbar>
  )
}