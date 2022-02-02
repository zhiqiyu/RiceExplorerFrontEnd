import { Container, Nav, Navbar, Row } from 'react-bootstrap';
import { BrowserRouter, NavLink, Route, Switch, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home';
import EmpiricalApp from './pages/EmpiricalApp';
import PhenologyApp from './pages/PhenologyApp';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getCookie } from './utils/csrfToken';
import { setToken } from './features/phenology/csrfTokenSlice';
import ClassificationApp from './pages/ClassificationApp';
import { FilterPanel } from './components/panels/FilterPanel';
import AppStatusBar from './components/AppStatusBar';
import Map from './components/LeafletMap';
import SettingsPanel from './components/panels/SettingsPanel';
import { ClassificationPanel } from './components/panels/ClassificationPanel';
import SamplePanel from './components/panels/SamplePanel';
import MapPanel from './components/panels/MapPanel';
import { APP_NAME, setAppName } from './features/phenology/appNameSlice';

import './App.css'


function App() {

  const location = useLocation()

  const dispatch = useDispatch()

  const appName = useSelector(state => state.appName)

  const [info, setInfo] = useState("Please run the app to show area of rice.")

  useEffect(() => {
    let token = getCookie('csrftoken')
    dispatch(setToken(token))
  }, [])

  useEffect(() => {
    let temp = location.pathname.split('/')
    let currentName = temp[temp.length - 1] || "home"
    
    dispatch(setAppName(APP_NAME[currentName]))
  }, [location])

  return (
    <div className="d-flex flex-column vh-100 vw-100">
      <Header />
      <AppStatusBar />
      <div className="main d-flex flex-row h-100 w-100">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
        <div className="left-panel">
          <Switch>
          <Route exact path="/empirical">
            {/* <EmpiricalApp /> */}
            <FilterPanel setInfo={setInfo} />
          </Route>
          <Route exact path="/phenology">
            {/* <PhenologyApp /> */}
            <SettingsPanel />
          </Route>
          <Route exact path="/classification">
            {/* <ClassificationApp /> */}
            <ClassificationPanel setInfo={setInfo} />
          </Route>
          </Switch>
        </div>

        <div className="mid-panel h-100">
          <Switch>
            <Route exact path={["/empirical", "/phenology", "/classification"]}>
              <MapPanel info={info}/>
            </Route>
          </Switch>
        </div>

        
          <Route exact path="/phenology">
            <div className='right-panel'>
              <SamplePanel />
            </div>
          </Route>
        
      </div>
    </div>
    
  );
}

export default App;
