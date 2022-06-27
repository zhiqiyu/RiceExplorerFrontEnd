import { Button, ButtonGroup, Card, Col, Container, Form, ListGroup, Modal, Nav, Row, Stack, TabContainer, TabContent, Table, TabPane } from "react-bootstrap";
import _, { sample } from 'lodash'
import { actions, modifySeason } from "../../features/seasonSlice"
import { SampleContainer, idField } from "../../components/SampleContainer";
import { ChartArea, ChartContainer } from "../../components/ChartContainer";
import SeasonPanel from "../../components/SeasonPanel";

const tabNames = {
  tab1: "Samples",
  tab2: "Phenology Phases"
}



export default function PhenologyRight() {

  
  return (
    <div className="h-100 d-flex flex-column">

      <TabContainer defaultActiveKey={tabNames.tab1} unmountOnExit={false}>
        <Row className="tabs-nav g-0 flex-wrap">
          <Nav variant="pills" className="h-100">
            <Col className="h-100 align-items-center p-1">
              <Nav.Link className="tab-title align-middle w-100 h-100 h6 mb-0" eventKey={tabNames.tab1} >{tabNames.tab1}</Nav.Link>
            </Col>
            <Col className="h-100 align-items-center p-1">
              <Nav.Link className="tab-title align-middle h-100 w-100 h6 mb-0" eventKey={tabNames.tab2} >{tabNames.tab2}</Nav.Link>
            </Col>
          </Nav>
        </Row>

        <Row className="overflow-auto h-100 g-0 mb-auto">
          <Col className="h-100 w-100">
            <TabContent className="h-100 w-100">
              <TabPane eventKey={tabNames.tab1} className="h-100 w-100">

                <div className="sample-container h-100 px-2 pt-2">
                  <SampleContainer />
                </div>

                <div className="chart-canvas w-100 px-2 pt-2">
                  <ChartContainer />
                </div>

              </TabPane>

              <TabPane eventKey={tabNames.tab2} className="h-100 p-2">

                <SeasonPanel />

                
              </TabPane>

            </TabContent>
          </Col>
        </Row>
      </TabContainer>

      
    </div>
  );
}
