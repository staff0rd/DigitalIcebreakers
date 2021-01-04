import React from "react";
import { ConnectionIcon } from "./ConnectionIcon";
import { Config } from "../config";
import { makeStyles } from "@material-ui/core/styles";
import { defaultFont } from "../layout/assets/jss/material-dashboard-react";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

const useStyles = makeStyles((theme) => ({
  sidebarFooter: {
    bottom: 0,
    position: "fixed",
    padding: "15px 30px",
    backgroundColor: "#191919",
    width: "200px",
  },
  text: {
    ...(defaultFont as CSSProperties),
    margin: "0",
    lineHeight: "30px",
    fontSize: "14px",
    color: "#535353",
  },
}));

const SidebarFooter = ({ lobbyId }: { lobbyId: string | undefined }) => {
  const classes = useStyles();
  return (
    <div className={classes.sidebarFooter}>
      <ConnectionIcon />
      <div className={classes.text}>{`v${Config.version}`}</div>
      <span data-testid="lobby-id" style={{ display: "none" }}>
        {lobbyId}
      </span>
    </div>
  );
};

export default SidebarFooter;
