import { ReactNode } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import IconButton from "@mui/material/IconButton";
import Delete from "@mui/icons-material/Delete";
import array from "util/array";
import CustomInput from "layout/components/CustomInput/CustomInput";
import makeStyles from "@mui/styles/makeStyles";
import { Answer } from "../types/Answer";

const useStyles = makeStyles(() => ({
  cell: {
    "&.MuiTableCell-root": {
      borderBottom: "none",
    },
    padding: "0 0 0 16px !important",
  },
  input: {
    "&.MuiInputBase-root": {
      margin: "0 !important",
    },
  },
  formControl: {
    margin: 0,
    padding: 0,
  },
  correctLabel: {
    verticalAlign: "middle",
    display: "inline",
  },
}));

type Props = {
  answers: Answer[];
  setAnswers: (answers: Answer[]) => void;
  questionId: string;
  children: ReactNode;
};

const EditAnswers = ({ answers, setAnswers, children }: Props) => {
  const classes = useStyles();

  return (
    <Table aria-label="answers" size="small">
      <TableBody>
        {answers.map((answer, ix) => (
          <TableRow key={answer.id}>
            <TableCell className={classes.cell} component="th" scope="row">
              <CustomInput
                className={classes.input}
                labelText=""
                id={`question-text-${answer.id}`}
                formControlProps={{
                  fullWidth: true,
                  className: classes.formControl,
                }}
                value={answer.text}
                onChange={(e) =>
                  setAnswers(
                    answers.map((a) =>
                      a.id !== answer.id
                        ? a
                        : { ...answer, text: e.target.value }
                    )
                  )
                }
                error={answer.text.length < 1}
              />
            </TableCell>
            {children}
            <TableCell className={classes.cell}>
              <IconButton
                onClick={() =>
                  setAnswers(array.moveUp(answers, answers.indexOf(answer)))
                }
                disabled={ix === 0}
              >
                <ArrowUpward />
              </IconButton>
              <IconButton
                onClick={() =>
                  setAnswers(array.moveDown(answers, answers.indexOf(answer)))
                }
                disabled={ix === answers.length - 1}
              >
                <ArrowDownward />
              </IconButton>
              <IconButton
                onClick={() =>
                  setAnswers(answers.filter((a) => a.id !== answer.id))
                }
                disabled={answers.length < 2}
              >
                <Delete />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EditAnswers;
