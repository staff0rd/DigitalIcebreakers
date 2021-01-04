import styles from "layout/assets/jss/material-dashboard-react/components/tasksStyle";
import { TriviaAnswer } from "games/shared/Poll/types/Answer";
import Check from "@material-ui/icons/Check";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import { makeStyles, TableCell } from "@material-ui/core";
import React from "react";
import { toggleCorrectAnswer } from "../toggleCorrectAnswer";

const useLayoutStyles = makeStyles(styles);

export const CorrectAnswerCell = ({
  answer,
  answers,
  cellClass,
  correctLabelClass,
  setAnswers,
}: {
  answer: TriviaAnswer;
  answers: TriviaAnswer[];
  cellClass: string;
  correctLabelClass: string;
  setAnswers: (answers: TriviaAnswer[]) => void;
}) => {
  const layoutClasses = useLayoutStyles();
  return (
    <TableCell className={cellClass}>
      <Checkbox
        checked={answer.correct}
        onClick={() => setAnswers(toggleCorrectAnswer(answers, answer))}
        checkedIcon={<Check className={layoutClasses.checkedIcon} />}
        icon={<Check className={layoutClasses.uncheckedIcon} />}
      />
      <Typography className={correctLabelClass}>Correct</Typography>
    </TableCell>
  );
};
