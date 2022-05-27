import { createContext, Fragment } from "react"
import { useEffect, useReducer, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import MapPanel from "../panels/MapPanel"
import SamplePanel from "../panels/SamplePanel"
import SettingsPanel from "../panels/SettingsPanel"
// import Sidebar from "../components/Sidebar"
import { TriplePanel } from "../components/TriplePanel"
import { useDispatch } from "react-redux"
import AppStatusBar from "../components/AppStatusBar"
import { FilterPanel } from "../panels/FilterPanel"
import { useSelector } from "react-redux"
import { setAppName, APP_NAME } from "../features/appNameSlice"
import SplitPane from "react-split-pane"

export default function PhenologyApp() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setAppName(APP_NAME.phenology))
  }, [])

  return (
    <Fragment>
      <AppStatusBar />
      <div className="app-main">
      {/* <Container fluid className="h-100 app-main pb-0 ps-0 pe-0">
        <Row className="h-100 gx-0">
          <Col >
            <SettingsPanel />
          </Col>
          <Col xs={"7"} >
            <MapPanel showEditControl={false} showInfoControl={false}/>
          </Col>
          <Col >
            <SamplePanel />
          </Col>
        </Row>
      </Container> */}

        <SplitPane split="vertical" defaultSize={200}>
          <SettingsPanel />
          <SplitPane split="vertical">
            <MapPanel showEditControl={false} showInfoControl={false}/>
            <SamplePanel />
          </SplitPane>
        </SplitPane>
      </div>
    </Fragment>
  )
}
