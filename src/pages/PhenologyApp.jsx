import { createContext } from "react"
import { useEffect, useReducer, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import MapPanel from "../components/MapPanel"
import SamplePanel from "../components/SamplePanel"
import SettingsPanel from "../components/SettingsPanel"
import Sidebar from "../components/Sidebar"
import { TriplePanel } from "../components/TriplePanel"
import { getCookie } from "../utils/csrfToken"
import { setToken } from "../features/phenology/csrfTokenSlice"
import { useDispatch } from "react-redux"



export default function PhenologyApp() {

  const dispatch = useDispatch()

  useEffect(() => {
    let token = getCookie('csrftoken')
    dispatch(setToken(token))
  }, [])

  return (
    <Container fluid className="h-100 p-0" >
      <Row className="h-100 gx-0">
        <Col xs={2} >
          <SettingsPanel />
        </Col>
        <Col xs={8} >
          <MapPanel showEditControl={true} />
        </Col>
        <Col xs={2}>
          <SamplePanel />
        </Col>
      </Row>
    </Container>
  )
}
