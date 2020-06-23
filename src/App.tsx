import React from "react";
import "./App.scss";
import "./forms/forms.scss";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { Auth } from "./views/Auth";
import { Dashboard } from "./views/Dashboard";
import { useGlobalState } from "react-global-state-hook";
import { Modal } from "./components/Modal";
import { Sequencer } from "./views/Sequencer";
import { Landing } from "./views/Landing";

const App = () => {
  const [auth] = useGlobalState("AUTH", "pending");

  return (
    <div className="app">
      {auth === "pending" ? (
        <div>Loading App..</div>
      ) : (
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/auth/:type" component={Auth} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/sequencer/:type/:id" component={Sequencer} />
          </Switch>
        </BrowserRouter>
      )}
      <Modal />
    </div>
  );
};

export default App;
