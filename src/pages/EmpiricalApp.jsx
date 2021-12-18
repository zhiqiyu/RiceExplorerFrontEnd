import React, { Fragment, useEffect } from "react"
import { useReducer, useState } from "react"
import { useDispatch } from "react-redux"
import AppStatusBar from "../components/AppStatusBar"
import Map, { geojsonLayer } from "../components/LeafletMap"
import { FilterPanel } from "../components/panels/FilterPanel"
import Sidebar from "../components/Sidebar"
import SplitPanel from "../components/SplitPanel"
import { APP_NAME, setAppName } from "../features/phenology/appNameSlice"
import { setToken } from "../features/phenology/csrfTokenSlice"
import { getCookie } from "../utils/csrfToken"

export function EmpiricalApp() {

  const dispatch = useDispatch()

  const [info, setInfo] = useState("Please run the app to show area of rice.")

  useEffect(() => {
    dispatch(setAppName(APP_NAME.empirical))

  }, [])


  return (
    <Fragment>
      <AppStatusBar />
      <SplitPanel 
        className="app-main"
        leftPanel={<FilterPanel setInfo={setInfo} />} 
        rightPanel={<Map showInfoControl={true} info={info} />} 
      />
    </Fragment>
  )
}

export default EmpiricalApp;