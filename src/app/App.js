import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "../pages/Dashboard/Dashboard";

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/Dashboard" component={Dashboard} />
  
      {/* <Route
        path="/project/:projectId"
        render={(props) => (
          <WorkDetail
            {...props}
            projectId={props.match.params.projectId}
          />
        )}
      /> */}

    </Switch>
  </Router>
);

export default App;
