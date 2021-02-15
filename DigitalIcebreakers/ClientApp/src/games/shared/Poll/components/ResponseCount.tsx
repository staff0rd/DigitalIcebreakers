import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  question: {
    margin: 0,
    padding: 0,
    textAlign: "center",
  },
  responseCount: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: 25,
  },
}));

type Props = {
  responseCount: number;
  playerCount: number;
};

export const getCountMessage = (responseCount: number, playerCount: number) => {
  if (playerCount === 0) return "Waiting for participants to join...";
  return responseCount !== playerCount
    ? `${responseCount} of ${playerCount} participants have responded`
    : `All ${playerCount} participants have responded`;
};

export const ResponseCount = ({ responseCount, playerCount }: Props) => {
  const classes = useStyles();
  const countMessage = getCountMessage(responseCount, playerCount);

  return (
    <div className={classes.responseCount}>
      <Typography variant="overline">Responses</Typography>
      <Typography>{countMessage}</Typography>
    </div>
  );
};
