import { createContext, Fragment } from "react"
import { useEffect, useReducer, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import MapPanel from "../components/panels/MapPanel"
import SamplePanel from "../components/panels/SamplePanel"
import SettingsPanel from "../components/panels/SettingsPanel"
import Sidebar from "../components/Sidebar"
import { TriplePanel } from "../components/TriplePanel"
import { useDispatch } from "react-redux"
import AppStatusBar from "../components/AppStatusBar"
import { FilterPanel } from "../components/panels/FilterPanel"
import { useSelector } from "react-redux"
import { setAppName, APP_NAME } from "../features/phenology/appNameSlice"
import SplitPanel from "../components/SplitPanel"
import Map from "../components/LeafletMap"
import { ClassificationPanel } from "../components/panels/ClassificationPanel"

export default function ClassificationApp() {

  const dispatch = useDispatch()

  const [info, setInfo] = useState("Please run the app to show area of rice.")

  useEffect(() => {
    dispatch(setAppName(APP_NAME.classification))
  }, [])

  return (
    <Fragment>
      <AppStatusBar />
      {/* <Container fluid className="h-100 app-main pb-0 ps-0 pe-0"> */}
      <SplitPanel 
        className="app-main"
        leftPanel={<ClassificationPanel setInfo={setInfo} />} 
        rightPanel={<Map showInfoControl={true} info={info} />} 
      />
      {/* </Container> */}
    </Fragment>
  )
}
