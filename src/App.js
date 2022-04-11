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
import EmpiricalApp from "./pages/EmpiricalApp";
import PhenologyApp from "./pages/PhenologyApp";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCookie } from "./utils/csrfToken";
import { setToken } from "./features/csrfTokenSlice";
import ClassificationApp from "./pages/ClassificationApp";
import { FilterPanel } from "./panels/FilterPanel";
import AppStatusBar from "./components/AppStatusBar";
import Map from "./components/LeafletMap";
import SettingsPanel from "./panels/SettingsPanel";
import { ClassificationPanel } from "./panels/ClassificationPanel";
import SamplePanel from "./panels/SamplePanel";
import MapPanel from "./panels/MapPanel";
import { APP_NAME, setAppName } from "./features/appNameSlice";

import "./App.css";
import SplitPane from "react-split-pane";

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
      <AppStatusBar />
      <div className="main d-flex h-100 w-100">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          <Route path={["/empirical", "/phenology", "/classification"]}>
            <SplitPane
              split="vertical"
              defaultSize={"20%"}
              minSize={0}
              maxSize={"35%"}
              className="h-100 position-static"
            >
              <div className="h-100 w-100">
                <Switch>
                  <Route exact path="/empirical">
                    <FilterPanel  />
                  </Route>
                  <Route exact path="/phenology">
                    <SettingsPanel />
                  </Route>
                  <Route exact path="/classification">
                    <ClassificationPanel  />
                  </Route>
                </Switch>
              </div>

              <SplitPane 
                split="vertical" 
                primary="second" 
                defaultSize={appName === "phenology" ? "25%" : 0}
                minSize={0}
                maxSize={appName === "phenology" ? "40%" : 0}
              >
                <div className="h-100 w-100">
                  <MapPanel />
                </div>

                <div className="h-100">
                  <Route exact path="/phenology">
                    <div className="h-100 w-100">
                      <SamplePanel />
                    </div>
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
