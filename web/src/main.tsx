import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import history from "./history";
import "./layout/assets/css/material-dashboard-react.css";
import { createTheme, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/styles";

// TODO: probably switch to wouter
import { unstable_HistoryRouter as HistoryRouter } from "react-router";

const baseUrl = import.meta.env.BASE_URL || "/";

const theme = createTheme({});

createRoot(document.getElementById("root")!).render(
  <HistoryRouter basename={baseUrl} history={history}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </HistoryRouter>
);
