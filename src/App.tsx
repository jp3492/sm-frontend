import React, { lazy, Suspense } from "react";
import "./App.scss";
import "./forms/forms.scss";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { usegs } from "./utils/rxGlobal";

import { AUTH } from "./services/auth";

import { ErrorPage404 } from "./views/404";
import { ErrorPage403 } from "./views/403";
import { Modal } from "./components/Modal";
import { Landing2 } from "./views/Landing2";

// lazy load all pages
const Dashboard = lazy(() => import("./views/Dashboard"));
const Sequencer = lazy(() => import("./views/Sequencer"));
const Landing = lazy(() => import("./views/Landing"));
const Viewer = lazy(() => import("./views/Viewer"));
const Impressum = lazy(() => import("./views/Impressum"));
const Datenschutz = lazy(() => import("./views/Datenschutz"));
const Roadmap = lazy(() => import("./views/Roadmap"));

const App = () => {
  const [auth] = usegs(AUTH, "pending");

  return (
    <div className="app">
      <Suspense fallback={LoadingPage}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/landing2" component={Landing2} />
            <Route exact path="/roadmap" component={Roadmap} />
            <Route exact path="/viewer/:type/:id" component={Viewer} />
            <Route exact path="/impressum" component={Impressum} />
            <Route exact path="/datenschutz" component={Datenschutz} />
            {auth === "pending" ? (
              <div className="centered-grid dashboard-loading cl-content-sec">
                <h3>Loading App...</h3>
              </div>
            ) : (
              auth === true && (
                <>
                  <Route exact path="/dashboard" component={Dashboard} />
                  <Route exact path="/sequencer/:id" component={Sequencer} />
                </>
              )
            )}
            <Route exact path="/403" component={ErrorPage403} />
            <Route path={["*", "/404"]} component={ErrorPage404} />
          </Switch>
          <Modal />
        </BrowserRouter>
      </Suspense>
    </div>
  );
};

const LoadingPage = () => {
  return <div className="centered-grid">Loading Page</div>;
};

export default App;
