import React from "react";
import { Question } from "../types/Question";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { ResponseCount } from "./ResponseCount";

const useStyles = makeStyles((theme) => ({
  question: {
    margin: 0,
    padding: 0,
    textAlign: "center",
  },
}));

type Props = {
  question: Question;
  responseCount: number;
  playerCount: number;
  totalQuestions: number;
  currentQuestionNumber: number;
};

const QuestionAndResponseCount = (props: Props) => {
  const {
    question,
    responseCount,
    playerCount,
    totalQuestions,
    currentQuestionNumber,
  } = props;
  const classes = useStyles();

  return (
    <>
      <Typography variant="overline">
        Question {currentQuestionNumber} of {totalQuestions}
      </Typography>
      <h1 id="question" className={classes.question}>
        {question.text}
      </h1>
      <ResponseCount responseCount={responseCount} playerCount={playerCount} />
    </>
  );
};

export default QuestionAndResponseCount;
