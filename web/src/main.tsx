import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import history from "./history";
import "./layout/assets/css/material-dashboard-react.css";
import { createTheme, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

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
