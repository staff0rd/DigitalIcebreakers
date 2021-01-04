import React from "react";
import { Question } from "../types/Question";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Answer } from "games/shared/Poll/types/Answer";

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

export const getCountMessage = (responseCount: number, playerCount: number) => {
  if (playerCount === 0) return "Waiting for players to join...";
  return responseCount !== playerCount
    ? `${responseCount} of ${playerCount} players have answered`
    : `All ${playerCount} players have answered`;
};

type Props<T extends Answer> = {
  question: Question<T>;
  responseCount: number;
  playerCount: number;
  totalQuestions: number;
  currentQuestionNumber: number;
};

const QuestionAndResponseCount = <T extends Answer>(props: Props<T>) => {
  const {
    question,
    responseCount,
    playerCount,
    totalQuestions,
    currentQuestionNumber,
  } = props;
  const classes = useStyles();

  const countMessage = getCountMessage(responseCount, playerCount);

  return (
    <>
      <Typography variant="overline">
        Question {currentQuestionNumber} of {totalQuestions}
      </Typography>
      <h1 className={classes.question}>{question.text}</h1>
      <div className={classes.responseCount}>
        <Typography variant="overline">Responses</Typography>
        <Typography>{countMessage}</Typography>
      </div>
    </>
  );
};

export default QuestionAndResponseCount;
