import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { initFirebase, setAuthObserver } from "./services/auth";

initFirebase();
setAuthObserver();

// @ts-ignore
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
// @ts-ignore
Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.register();
