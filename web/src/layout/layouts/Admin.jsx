import { Route, Routes, useNavigate } from "react-router";
import React from "react";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @mui/material components
import makeStyles from "@mui/styles/makeStyles";
// core components
import Navbar from "../components/Navbars/Navbar";
import { toggleDrawer } from "../../store/shell/actions";
import { useSelector } from "../../store/useSelector";
import Sidebar from "../components/Sidebar/Sidebar";

import useRoutes from "../useRoutes";

import styles from "../assets/jss/material-dashboard-react/layouts/adminStyle";

let ps;

const AppRoutes = () => {
  const routes = useRoutes();
  const navigate = useNavigate();
  return (
    <Routes>
      {routes.map(({ route, path, component: Component }, key) => {
        return (
          <Route exact path={route || path} element={<Component />} key={key} />
        );
      })}
      <Route
        render={({ location }) => {
          if (location.pathname.length === 5) {
            console.log(
              `redirecting to /join-lobby${location.pathname} from ${location.pathname}`
            );
            navigate(`/join-lobby${location.pathname}`);
          }
          console.log("redirecting to / from " + location.pathname);
          navigate("/");

          return <></>;
        }}
      />
    </Routes>
  );
};

const useStyles = makeStyles(styles);

export default function Admin({ isPresenter, currentGame, lobbyId, ...rest }) {
  // styles
  const classes = useStyles();
  const routes = useRoutes();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  const showDrawer = useSelector((state) => state.shell.showDrawer);

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
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"Digital Icebreakers"}
        logo="/img/icon.svg"
        open={showDrawer}
        color="blue"
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar routes={routes} {...rest} />
        <div className={classes.content}>
          <div className={classes.container}>
            <AppRoutes />
          </div>
        </div>
      </div>
    </div>
  );
}
