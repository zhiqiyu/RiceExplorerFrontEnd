import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import { APP_STATUS } from "../features/phenology/appStatusSlice";


export function AppStatusBar(props) {

  const status = useSelector(state => state.appStatus)
  
  return (
    <div
      className="app-status-bar align-items-center d-flex position-absolute"
    >
      <div className="d-flex">
        <h6 className="mb-0">App Status: <b>{status}</b></h6>
      </div>
    </div>
  )
}

export default AppStatusBar;