import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams,
} from "react-router";
import React, { useEffect } from "react";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// core components
import Navbar from "../components/Navbars/Navbar";
import { useAtomValue, useSetAtom } from "jotai";
import {
  showDrawerAtom,
  toggleDrawerAtom,
} from "../../store/atoms/shellAtoms";
import Sidebar from "../components/Sidebar/Sidebar";

import useRoutes from "../useRoutes";

import stylesWithoutTheme from "../assets/jss/material-dashboard-react/layouts/adminStyle";
import { Box, useTheme } from "@mui/material";

let ps;

const Redirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname.length === 5) {
      console.log(
        `redirecting to /join-lobby${location.pathname} from ${location.pathname}`
      );
      navigate(`/join-lobby${location.pathname}`);
      return;
    }
    console.log("redirecting to / from " + location.pathname);
    navigate("/");
  }, [location, navigate]);

  return <></>;
};

const AppRoutes = () => {
  const routes = useRoutes();

  return (
    <Routes>
      {routes.map(({ path, route, component: Component }, key) => {
        return <Route path={route || path} element={<Component />} key={key} />;
      })}
      <Route path="/:lobbyCode" element={<LobbyCodeRedirect />} />
      <Route path="*" element={<Redirect />} />
    </Routes>
  );
};

const LobbyCodeRedirect = () => {
  const navigate = useNavigate();
  const { lobbyCode } = useParams();

  useEffect(() => {
    if (lobbyCode && lobbyCode.length === 4) {
      navigate(`/join-lobby/${lobbyCode}`);
    } else {
      navigate("/");
    }
  }, [lobbyCode, navigate]);

  return null;
};

export default function Admin(props: Record<string, unknown>) {
  const routes = useRoutes();
  const theme = useTheme();
  const styles = stylesWithoutTheme(theme);
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef<HTMLDivElement>();
  const showDrawer = useAtomValue(showDrawerAtom);
  const toggleDrawer = useSetAtom(toggleDrawerAtom);

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      toggleDrawer(false);
    }
  };
  // initialize and destroy the PerfectScrollbar plugin
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);

  return (
    <Box sx={styles.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"Digital Icebreakers"}
        logo="/img/icon.svg"
        open={showDrawer}
        color="blue"
        {...props}
      />
      <Box sx={styles.mainPanel} ref={mainPanel}>
        <Navbar routes={routes} {...props} />
        <Box sx={styles.content}>
          <Box sx={styles.container}>
            <AppRoutes />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
