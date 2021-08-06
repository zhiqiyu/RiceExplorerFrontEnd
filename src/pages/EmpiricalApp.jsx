import { useEffect } from "react"
import { useReducer, useState } from "react"
import { useDispatch } from "react-redux"
import Map from "../components/LeafletMap"
import Sidebar from "../components/Sidebar"
import SplitPanel from "../components/SplitPanel"
import { setToken } from "../features/phenology/csrfTokenSlice"
import { getCookie } from "../utils/csrfToken"


export function EmpiricalApp() {

  const dispatch = useDispatch()

  useEffect(() => {
    let token = getCookie('csrftoken')
    dispatch(setToken(token))
  }, [])


  return (
    <SplitPanel 
      leftPanel={<Sidebar />} 
      rightPanel={<Map />} 
    />
  )
}

export default EmpiricalApp;