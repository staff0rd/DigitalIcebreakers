import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./layout/assets/css/material-dashboard-react.css";
import { createTheme, CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BrowserRouter } from "react-router";
import { NavigationHandler } from "./components/NavigationHandler.tsx";

const baseUrl = import.meta.env.BASE_URL || "/";

const theme = createTheme({});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={baseUrl}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavigationHandler />
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
