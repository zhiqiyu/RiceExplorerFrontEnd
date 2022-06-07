import { Container, Nav, Navbar, Row } from "react-bootstrap";
import {
  BrowserRouter,
  NavLink,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
// import EmpiricalApp from "./pages/EmpiricalApp";
// import PhenologyApp from "./pages/PhenologyApp";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCookie } from "./utils/csrfToken";
import { setToken } from "./features/csrfTokenSlice";
import ClassificationApp from "./pages/ClassificationApp";

import AppStatusBar from "./components/AppStatusBar";
import Map from "./components/LeafletMap";

import SamplePanel from "./panels/SamplePanel";
import MapPanel from "./panels/MapPanel";
import { APP_NAME, setAppName } from "./features/appNameSlice";

import "./App.css";
import SplitPane from "react-split-pane";
import PhenologyRight from "./apps/phenology/PhenologyRight";
import PhenologyLeft from "./apps/phenology/PhenologyLeft";
import { EmpiricalLeft } from "./apps/empirical/EmpiricalLeft";
import EmpiricalRight from "./apps/empirical/EmpiricalRight";
import { ClassificationLeft } from "./apps/classification/ClassificationLeft";
import { ClassificationRight } from "./apps/classification/ClassificationRight";
import { MapCarousel } from "./components/MapCarousel";

const leftSize = {
  "default": "20%",
  "max": "40%"
}

const rightSize = {
  "default": "25%",
  "max": "40%"
}

function App() {
  const location = useLocation();

  const dispatch = useDispatch();

  const appName = useSelector(state => state.appName)

  // const [info, setInfo] = useState("Please run the app to show area of rice.");

  useEffect(() => {
    let token = getCookie("csrftoken");
    dispatch(setToken(token));
  }, []);

  useEffect(() => {
    let temp = location.pathname.split("/");
    let currentName = temp[temp.length - 1] || "home";

    dispatch(setAppName(APP_NAME[currentName]));
  }, [location]);

  return (
    <div className="vh-100 vw-100">
      <Header />
      <div className="main d-flex h-100 w-100">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route path={["/empirical", "/phenology", "/classification"]}>

            <SplitPane
              split="vertical"
              defaultSize={leftSize["default"]}
              minSize={0}
              maxSize={leftSize["max"]}
              className="h-100 position-static"
            >
              {/* left panel */}
              <div className="h-100 w-100">
                <Switch>
                  <Route exact path="/empirical">
                    <EmpiricalLeft  />
                  </Route>
                  <Route exact path="/phenology">
                    <PhenologyLeft />
                  </Route>
                  <Route exact path="/classification">
                    <ClassificationLeft  />
                  </Route>
                </Switch>
              </div>

              <SplitPane 
                split="vertical" 
                primary="second" 
                defaultSize={rightSize["default"]}
                minSize={0}
                maxSize={rightSize["max"]}
              >
                {/* Mid panel */}
                <div className="h-100 w-100">
                  {/* <MapPanel /> */}
                  <SplitPane 
                    split="horizontal" 
                    primary="second" 
                    defaultSize={appName === "phenology" ? 250 : 0} 
                    maxSize={appName === "phenology" ? 400 : 0}
                    minSize={0}
                  >
                    <div className="w-100 h-100">
                      <Map />
                    </div>

                    <div className="w-100">
                      {appName === "phenology" ? (<MapCarousel />) : null}
                    </div>

                  </SplitPane>
                </div>

                {/* Right panel */}
                <div className="h-100">
                  <Route exact path="/phenology">
                    <div className="h-100 w-100">
                      <PhenologyRight />
                    </div>
                  </Route>
                  <Route exact path="/empirical">
                    <EmpiricalRight />
                  </Route>
                  <Route exact path="/classification">
                    <ClassificationRight />
                  </Route>
                </div>
              </SplitPane>
            </SplitPane>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
