import React from "react";
import { Config } from "../config";
import { useSelector } from "../store/useSelector";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import {
  hexToRgb,
  grayColor,
} from "layout/assets/jss/material-dashboard-react";

const useStylesLg = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  header: {
    display: "flex-inline",
    margin: theme.spacing(2, 0),
  },
  qrCodeLink: {
    textAlign: "center",
  },
  qrCode: {
    width: "calc(100vh - 104px - 73px)",
  },
  browseLink: {
    padding: theme.spacing(1, 0),
  },
}));

const useStylesSm = makeStyles((theme) => ({
  container: {
    textAlign: "center",
    padding: "10px 10px 4px 10px",
    background: "white",
    margin: theme.spacing(2, 2, 0, 2),
  },
  header: {},
  qrCodeLink: {
    textAlign: "center",
  },
  qrCode: {},
  browseLink: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& h6": {
      width: "calc(100% - 30px)",
      borderBottom: "1px solid rgba(" + hexToRgb(grayColor[6]) + ", 0.3)",
      textAlign: "center",
    },
    "& a": {
      textTransform: "none",
    },
  },
}));

var QRCode = require("qrcode.react");

type Props = {
  lg?: boolean;
};

const LobbyQrCode = ({ lg }: Props) => {
  const lgStyles = useStylesLg();
  const smStyles = useStylesSm();
  const classes = lg ? lgStyles : smStyles;
  const sm = !lg;
  const lobby = useSelector((state) => state.lobby);
  const joinUrl = `${Config.baseUrl}/${lobby.id}`;
  return (
    <>
      <div className={classes.container}>
        {lg && (
          <h1 className={classes.header}>
            Phone camera{" "}
            <span role="img" aria-label="qrcode below">
              👇
            </span>
          </h1>
        )}
        <a
          href={joinUrl}
          className={classes.qrCodeLink}
          data-testid="qrcode-link"
        >
          <QRCode
            height="100%"
            width="100%"
            className={classes.qrCode}
            value={joinUrl}
            renderAs="svg"
          />
        </a>
        {lg && (
          <Typography variant="h4" className={classes.browseLink}>
            or browse to: <a href={joinUrl}>ibk.rs/{lobby.id}</a>
          </Typography>
        )}
      </div>
      {sm && (
        <div className={classes.browseLink}>
          <Typography variant="h6">
            <a href={joinUrl}>http://ibk.rs/{lobby.id}</a>
          </Typography>
        </div>
      )}
    </>
  );
};
export default LobbyQrCode;
