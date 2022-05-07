import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CustomInput from "@layout/components/CustomInput/CustomInput";
import Alert from "@material-ui/lab/Alert";
import { useDispatch } from "react-redux";
import { Question } from "../types/Question";
import { guid } from "@util/guid";
import { Answer } from "@games/shared/Poll/types/Answer";
import { presenterActions } from "@games/shared/Poll/reducers/presenterActions";
import { ConfirmDialog } from "@components/ConfirmDialog";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(2),
  },
  input: {
    fontFamily: "monospace",
    lineHeight: 1,
  },
}));

export enum ErrorMessages {
  FIRST_LINE_SHOULD_BE_QUESTION = "First line should be a question, starting with a dash",
  ONLY_ONE_CORRECT_ANSWER_PER_QUESTION = "A question may have maximum one correct answer",
  ONLY_TRIVIA_MODE_MAY_HAVE_CORRECT_ANSWERS = "Poll questions do not have correct answers, try Trivia instead",
}

type ValidateResponse = {
  isValid: boolean;
  questions: Question[];
  errorMessage: string | undefined;
  errorLine: number | undefined;
};

export const validate = (
  questionsAndAnswers: string,
  isTriviaMode: boolean
): ValidateResponse => {
  let questions: Question[] = [];
  let errorMessage: string | undefined;
  let errorLine: number | undefined;

  const lines = questionsAndAnswers
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line); // remove empty lines

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("-")) {
      const trimmed = line.substr(1).trim();
      questions.push({
        answers: [],
        id: guid(),
        responses: [],
        text: trimmed,
      });
    } else if (i === 0) {
      errorLine = 1;
      errorMessage = ErrorMessages.FIRST_LINE_SHOULD_BE_QUESTION;
      break;
    } else if (line.startsWith("*")) {
      if (!isTriviaMode) {
        errorMessage = ErrorMessages.ONLY_TRIVIA_MODE_MAY_HAVE_CORRECT_ANSWERS;
        errorLine = i + 1;
        break;
      } else {
        const trimmed = line.substr(1).trim();
        const currentAnswers = questions[questions.length - 1].answers;
        if (currentAnswers.find((a) => a.correct)) {
          errorMessage = ErrorMessages.ONLY_ONE_CORRECT_ANSWER_PER_QUESTION;
          errorLine = i + 1;
          break;
        }
        currentAnswers.push({
          correct: true,
          id: guid(),
          text: trimmed,
        });
      }
    } else {
      const trimmed = line.trim();
      const answer: Answer = {
        id: guid(),
        text: trimmed,
      };
      if (isTriviaMode) {
        answer.correct = false;
      }
      questions[questions.length - 1].answers.push(answer);
    }
  }

  return {
    isValid: errorMessage === undefined,
    questions,
    errorMessage,
    errorLine,
  };
};

const questionsForBulkEditSelector = (
  questions: Question[],
  isTriviaMode: boolean
) =>
  questions
    .map((q) => {
      const answers = q.answers.map((a) => {
        if (isTriviaMode) {
          if (a.correct) return `* ${a.text}`;
        }
        return a.text;
      });
      return `- ${q.text}\n${answers.join("\n")}`;
    })
    .join("\n");

type Props = {
  gameName: string;
  isTriviaMode: boolean;
  questions: Question[];
  open: boolean;
  setOpen: (open: boolean) => void;
};
export const BulkEdit = (props: Props) => {
  const { gameName, isTriviaMode, questions, open, setOpen } = props;
  const { importQuestionsAction } = presenterActions(gameName);
  const classes = useStyles();
  const dispatch = useDispatch();
  const questionsFromRedux = questionsForBulkEditSelector(
    questions,
    isTriviaMode
  );

  const [questionLines, setQuestionLines] =
    useState<string>(questionsFromRedux);
  useEffect(() => {
    setQuestionLines(questionsFromRedux);
  }, [questionsFromRedux]);
  const [error, setError] = useState<string>("");

  const handleOk = () => {
    const { errorLine, errorMessage, isValid, questions } = validate(
      questionLines,
      isTriviaMode
    );
    if (isValid) {
      setError("");
      dispatch(importQuestionsAction(questions));
      setOpen(false);
    } else {
      setError(`Line ${errorLine}: ${errorMessage}`);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setQuestionLines(target.value);
  };

  return (
    <ConfirmDialog
      header="Bulk edit"
      action={handleOk}
      open={open}
      setOpen={setOpen}
      content={
        <>
          <Alert severity="info">
            <Typography variant="body2">
              - First line should be a question
            </Typography>
            <Typography variant="body2">
              - Questions start with a dash
            </Typography>
            <Typography variant="body2">
              Answers are just plain lines like this
            </Typography>
            {gameName !== "poll" && (
              <Typography variant="body2">
                * Correct answers start with an asterix (zero or one per
                question)
              </Typography>
            )}
          </Alert>
          <Alert severity="warning">
            <Typography variant="body2">
              Using bulk edit will clear audience responses
            </Typography>
          </Alert>
          <CustomInput
            multiline
            id="bulk-edit"
            rows={10}
            labelText="Questions &amp; answers"
            error={error.length > 0}
            className={classes.input}
            formControlProps={{
              className: classes.form,
              fullWidth: true,
            }}
            value={questionLines}
            onChange={onChange}
          />
          {error.length > 0 && <Alert severity="error">{error}</Alert>}
        </>
      }
    />
  );
};
