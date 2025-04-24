import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import history from "./history";

import { Router } from "react-router-dom";

// const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");

createRoot(document.getElementById("root")!).render(
  <Router
    /* TODO: determine whether this is neccessary basename={baseUrl} */ history={
      history
    }
  >
    <App />
  </Router>
);

import "./layout/assets/css/material-dashboard-react.css";
