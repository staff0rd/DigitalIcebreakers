import React from "react";
import Typography from "@material-ui/core/Typography";
import { Question } from "@games/shared/Poll/types/Question";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  list: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    //margin: 0,
    padding: 0,
  },
  item: {
    flex: 1,
    textAlign: "center",
    listStyle: "none",
  },
  header: {},
  subheader: {},
  players: {
    fontSize: "1.25rem",
  },
}));

type Props = {
  question: Question;
};
export const Responses = ({ question: { responses } }: Props) => {
  const classes = useStyles();
  return (
    <>
      {responses.length && (
        <Typography data-testid="average-score" variant="h2">
          {Math.round(
            (responses
              .map((res) => parseInt(res.answerId))
              .reduce((sum, current) => sum + current, 0) /
              responses.length) *
              100
          ) / 100}
        </Typography>
      )}
      <ul className={classes.list}>
        {Array.from({ length: 5 }, (value, key) => key).map((ix) => (
          <li className={classes.item}>
            {responses.length && (
              <Typography className={classes.subheader} variant="body1">
                {Math.round(
                  (responses.filter((p) => p.answerId === `${ix + 1}`).length /
                    responses.length) *
                    100
                )}
                %
              </Typography>
            )}
            <Typography className={classes.header} variant="h4">
              {ix + 1}
            </Typography>
            {responses
              .filter((p) => p.answerId === `${ix + 1}`)
              .map((res) => (
                <Typography className={classes.players} variant="body1">
                  {res.playerName}
                </Typography>
              ))}
          </li>
        ))}
      </ul>
    </>
  );
};
