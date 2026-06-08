import styles from "layout/assets/jss/material-dashboard-react/components/tasksStyle";
import { Answer } from "games/shared/Poll/types/Answer";
import Check from "@mui/icons-material/Check";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { TableCell } from "@mui/material";

import { toggleCorrectAnswer } from "../toggleCorrectAnswer";
import makeStyles from "@mui/styles/makeStyles";

const useLayoutStyles = makeStyles(styles);

export const CorrectAnswerCell = ({
  answer,
  answers,
  cellClass,
  correctLabelClass,
  setAnswers,
}: {
  answer: Answer;
  answers: Answer[];
  cellClass: string;
  correctLabelClass: string;
  setAnswers: (answers: Answer[]) => void;
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
