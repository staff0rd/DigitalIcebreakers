import "./layout/assets/css/material-dashboard-react.css?v=1.8.0";
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import App from "./App";
import history from "./history";
import ReactAI from "./app-insights-deprecated";

const rootElement = document.getElementById("root");

ReactAI.init({ instrumentationKey: "appInsightsKey" }, history);

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  rootElement
);
