import UnknownIcon from "@mui/icons-material/Help";
import ConnectedIcon from "@mui/icons-material/Power";
import NotConnectedIcon from "@mui/icons-material/PowerOff";
import { useSelector } from "../store/useSelector";
import makeStyles from "@mui/styles/makeStyles";

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
