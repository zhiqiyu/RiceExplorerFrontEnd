import { Container, Nav, Navbar } from 'react-bootstrap';
import { BrowserRouter, NavLink, Route, Switch } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home';
import EmpiricalApp from './pages/EmpiricalApp';


import './App.css'
import PhenologyApp from './pages/PhenologyApp';

function App() {

  return (
    <div className="d-flex flex-column vh-100">
      <Header />

      <main className="h-100">
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/empirical">
          <EmpiricalApp />
        </Route>
        <Route exact path="/phenology">
          <PhenologyApp />
        </Route>
      </Switch>
      </main>
    </div>
  );
}

export default App;
