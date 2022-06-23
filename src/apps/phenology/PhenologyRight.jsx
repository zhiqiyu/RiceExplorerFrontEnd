import { Button, ButtonGroup, Card, Col, Container, Form, ListGroup, Modal, Nav, Row, Stack, TabContainer, TabContent, Table, TabPane } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import _, { sample } from 'lodash'
import { ArrowsFullscreen, FileEarmarkArrowUpFill, SaveFill, TrashFill, Upload } from "react-bootstrap-icons";
import { saveAs } from 'file-saver'
import { SeasonFilterGroup } from "../../components/SeasonFilterGroup";
import * as d3 from "d3"
import { actions, modifySeason } from "../../features/seasonSlice"
import { SampleContainer, idField } from "../../components/SampleContainer";
import { ChartArea, ChartContainer } from "../../components/ChartContainer";

const tabNames = {
  tab1: "Samples",
  tab2: "Seasons"
}


// let geojsonLayer = null

const removeOutliers = (arr) => {
  let first = d3.quantile(arr, 0.25)
  let third = d3.quantile(arr, 0.75)
  let interquatile = third - first
  let upperbound = third + interquatile * 1.5
  let lowerbound = first - interquatile * 1.5
  return arr.filter(element => element > lowerbound && element < upperbound)
}

export default function PhenologyRight() {

  const sampleState = useSelector((state) => state.samples);

  const seasonFilters = useSelector(state => state.seasons)

  const dispatch = useDispatch();

  const handleRefresh = (e) => {
    if (sampleState.geojson.features.length === 0) {
      alert("Please upload the ground truth samples first.")
      return;
    }

    seasonFilters.seasons.forEach(seasonFilter => { 
      // let seasonFilter = seasonFilters[season];
      
      let start_date = new Date(seasonFilter.start)
      let end_date = new Date(seasonFilter.end)

      let candidates = []

      sampleState.geojson.features.forEach(sample => {
        // let candidates = []
        if (sample.properties[sampleState.classProperty.name] !== sampleState.classProperty.positiveValue) {
          return;
        }
        Object.entries(sample.properties).forEach(([key, val]) => {
          if (key.endsWith('_feature')) {
            let words = key.split('_')
            let date = new Date(Number.parseInt(words[words.length - 2])).getTime()
            if (start_date.getTime() <= date && date <= end_date.getTime()) {
              candidates.push(val)
            }
          }
        })
      })

      if (candidates.length === 0) {
        return;
      } 

      // compute mean, std
      let filteredCandidates = removeOutliers(candidates)
      let mean = _.sum(filteredCandidates) / filteredCandidates.length;
      let std = Math.sqrt(_.sum(_.map(filteredCandidates, v => Math.pow(v - mean, 2))) / filteredCandidates.length);
      
      // let action = actions[season];
      dispatch(modifySeason({
        "name": seasonFilter.name,
        "min": (mean - std).toFixed(2), 
        "max": (mean + std).toFixed(2)
      }))
      
    })
  }
  
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

                <div className="mb-2">
                  <Button className="w-100" onClick={handleRefresh} >
                    Calculate Thresholds
                  </Button>
                </div>
                
              </TabPane>

            </TabContent>
          </Col>
        </Row>
      </TabContainer>

      
    </div>
  );
}
