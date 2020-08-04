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
import { Viewer } from "./views/Viewer";
import { AUTH } from "./services/auth";
import { ErrorPage404 } from "./views/404";
import { ErrorPage403 } from "./views/403";
import { Payment } from "./views/Payment";
import { Impressum } from "./views/Impressum";
import { Datenschutz } from "./views/Datenschutz";

const App = () => {
  const [auth] = useGlobalState(AUTH, "pending");

  return (
    <div className="app">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/viewer/:type/:id" component={Viewer} />
          <Route exact path="/auth/:type" component={Auth} />
          <Route exact path="/impressum" component={Impressum} />
          <Route exact path="/datenschutz" component={Datenschutz} />
          {auth === "pending" ? (
            <div className="centered-grid">
              <h3>Loading App...</h3>
            </div>
          ) : (
            auth === true && (
              <>
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/sequencer/:id" component={Sequencer} />
                {/* <Route exact path="/profile/payment" component={Payment} /> */}
              </>
            )
          )}{" "}
          <Route exact path="/403" component={ErrorPage403} />
          <Route path={["*", "/404"]} component={ErrorPage404} />
        </Switch>
        <Modal />
      </BrowserRouter>
    </div>
  );
};

export default App;
