import React from "react";
import UnknownIcon from "@material-ui/icons/Help";
import ConnectedIcon from "@material-ui/icons/Power";
import NotConnectedIcon from "@material-ui/icons/PowerOff";
import { useSelector } from "../store/useSelector";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  icon: {
    width: "24px",
    height: "30px",
    fontSize: "24px",
    lineHeight: "30px",
    float: "left",
    marginRight: "15px",
    textAlign: "center",
    verticalAlign: "middle",
    color: "#535353",
  },
}));

export const ConnectionIcon = () => {
  const status = useSelector((state) => state.connection.status);
  const classes = useStyles();

  switch (status) {
    case 0:
      return (
        <NotConnectedIcon
          className={classes.icon}
          data-testid="connection-status"
          data-status="NotConnected"
        />
      );
    case 1:
      return (
        <UnknownIcon
          className={classes.icon}
          data-testid="connection-status"
          data-status="Unknown"
        />
      );
    case 2:
      return (
        <ConnectedIcon
          className={classes.icon}
          data-testid="connection-status"
          data-status="Connected"
        />
      );
    default:
      return <span data-testid="connection-status" data-status=""></span>;
  }
};
