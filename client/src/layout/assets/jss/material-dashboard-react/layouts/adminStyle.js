import { drawerWidth, transition } from "../../material-dashboard-react";

const appStyle = (theme) => ({
  wrapper: {
    position: "relative",
    top: "0",
    height: "100vh",
  },
  mainPanel: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    overflow: "auto",
    float: "right",
    ...transition,
    height: "100%",
    width: "100%",
    overflowScrolling: "touch",
  },
  content: {
    padding: 0,
    height: "100%",
  },
  container: {
    height: "100%",
  },
});

export default appStyle;
