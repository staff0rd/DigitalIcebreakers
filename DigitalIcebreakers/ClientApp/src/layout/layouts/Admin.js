import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "../components/Navbars/Navbar.js";
import { toggleDrawer } from '../../store/shell/actions';
import { useSelector } from '../../store/useSelector';
import Sidebar from "../components/Sidebar/Sidebar.js";

import useRoutes from "../routes";

import styles from "../assets/jss/material-dashboard-react/layouts/adminStyle";

let ps;

const switchRoutes = (routes) => (
  <Switch>
    {routes.map((prop, key) => (
      <Route
       exact
        path={prop.path}
        component={prop.component}
        key={key}
      />
    ))}
    {/* <Redirect from="/admin" to="/admin/dashboard" /> */}
  </Switch>
);

const useStyles = makeStyles(styles);

export default function Admin({ isAdmin, currentGame, lobbyId, ...rest }) {
  // styles
  const classes = useStyles();
  // ref to help us initialize PerfectScrollbar on windows devices
  const mainPanel = React.createRef();
  const showDrawer = useSelector(state => state.shell.showDrawer)
  
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
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
        suppressScrollY: false
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

  const routes = useRoutes();

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"Digital Icebreakers"}
        logo='/img/icon.svg'
        open={showDrawer}
        color="blue"
        {...rest}
      />
      <div className={classes.mainPanel} ref={mainPanel}>
        <Navbar
          routes={routes}
          {...rest}
        />
        {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>{switchRoutes(routes)}</div>
          </div>
        ) : (
          <div className={classes.map}>{switchRoutes(routes)}</div>
        )}
        {/* {getRoute() ? <Footer /> : null} */}
      </div>
    </div>
  );
}
