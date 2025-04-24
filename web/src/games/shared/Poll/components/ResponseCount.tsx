import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles(() => ({
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
