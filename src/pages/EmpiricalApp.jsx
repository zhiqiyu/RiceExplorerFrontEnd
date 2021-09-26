import React, { Fragment, useEffect } from "react"
import { useReducer, useState } from "react"
import { useDispatch } from "react-redux"
import AppStatusBar from "../components/AppStatusBar"
import Map from "../components/LeafletMap"
import Sidebar from "../components/Sidebar"
import SplitPanel from "../components/SplitPanel"
import { setToken } from "../features/phenology/csrfTokenSlice"
import { getCookie } from "../utils/csrfToken"


export function EmpiricalApp() {

  const dispatch = useDispatch()

  const [info, setInfo] = useState("Please run the app to show area of rice.")

  useEffect(() => {
    let token = getCookie('csrftoken')
    dispatch(setToken(token))
  }, [])


  return (
    <Fragment>
      <AppStatusBar />
      <SplitPanel 
        className="app-main"
        leftPanel={<Sidebar setInfo={setInfo} />} 
        rightPanel={<Map info={info} />} 
      />
    </Fragment>
  )
}

export default EmpiricalApp;