import { createContext, Fragment } from "react"
import { useEffect, useReducer, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import MapPanel from "../components/panels/MapPanel"
import SamplePanel from "../components/panels/SamplePanel"
import SettingsPanel from "../components/panels/SettingsPanel"
import Sidebar from "../components/Sidebar"
import { TriplePanel } from "../components/TriplePanel"
import { getCookie } from "../utils/csrfToken"
import { setToken } from "../features/phenology/csrfTokenSlice"
import { useDispatch } from "react-redux"
import AppStatusBar from "../components/AppStatusBar"
import { FilterPanel } from "../components/panels/FilterPanel"

const appName = "phenology"

export default function PhenologyApp({appName}) {

  return (
    <Fragment>
      <AppStatusBar />
      <Container fluid className="h-100 app-main pb-0 ps-0 pe-0">
        <Row className="h-100 gx-0">
          <Col xs={2} >
            <SettingsPanel />
            {/* <FilterPanel appName={appName} /> */}
          </Col>
          <Col xs={8} >
            <MapPanel showEditControl={true} />
          </Col>
          <Col xs={2}>
            <SamplePanel />
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}
