import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import { useDispatch } from "react-redux";
import { Question } from "../types/Question";
import { presenterActions } from "games/shared/Poll/reducers/presenterActions";
import { ConfirmDialog } from "components/ConfirmDialog";
import { useSelector } from "store/useSelector";
import { RootState } from "store/RootState";
import { guid } from "util/guid";
import { shuffle } from "Random";
import CustomInput from "layout/components/CustomInput/CustomInput";
import {
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(1),
  },
  difficulty: {
    marginTop: 27,
    marginLeft: theme.spacing(2),
  },
  opentdb: {
    backgroundColor: "black",
    padding: theme.spacing(0.5),
    height: 32,
  },
}));

const htmlDecode = (input: string): string => {
  var doc = new DOMParser().parseFromString(input, "text/html");
  const result = doc.documentElement.textContent || "";
  return result;
};

type QuestionType = "multiple";

type Response = {
  response_code: number;
  results: Result[];
};

type Result = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: QuestionType;
};

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
export const AutoQuestions = (props: Props) => {
  const currentGame = useSelector(
    (state: RootState) => state.lobby.currentGame
  );
  const { open, setOpen } = props;
  const { importQuestionsAction } = presenterActions(currentGame!);
  const dispatch = useDispatch();

  const handleOk = async () => {
    if (!countIsValid()) {
      setError("Number of Questions is Invalid");
    } else {
      setError("");
      let url = `https://opentdb.com/api.php?amount=${count}`;
      if (difficulty !== "any") url += `&difficulty=${difficulty}`;
      try {
        const response = await fetch(url);
        const json = (await response.json()) as Response;
        const questions: Question[] = json.results.map((q) => ({
          id: guid(),
          responses: [],
          text: htmlDecode(q.question),
          answers: shuffle([
            {
              correct: true,
              id: guid(),
              text: htmlDecode(q.correct_answer),
            },
            ...q.incorrect_answers.map((a) => ({
              correct: false,
              id: guid(),
              text: htmlDecode(a),
            })),
          ]),
        }));
        dispatch(importQuestionsAction(questions));
        setOpen(false);
      } catch (error) {
        setError("Could not get questions");
      }
    }
  };

  const handleCountChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (e) => {
    setCount(e.target.value);
  };

  const handleDifficultyChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setDifficulty(event.target.value as string);
  };

  const [count, setCount] = useState("10");
  const [error, setError] = useState("");
  const [difficulty, setDifficulty] = useState("easy");

  const countIsValid = () => {
    const result = Number.isInteger(parseInt(count));

    return result;
  };

  const classes = useStyles();

  return (
    <ConfirmDialog
      header={
        <div className={classes.header}>
          <Typography variant="h4">Auto questions</Typography>
          <a href="//opentriviadb.org">
            <img
              className={classes.opentdb}
              src="img/open-trivia-database.png"
              alt="questions by open trivia database"
              title="questions by open trivia database"
            ></img>
          </a>
        </div>
      }
      action={handleOk}
      open={open}
      setOpen={setOpen}
      content={
        <>
          <Alert severity="warning">
            <Typography variant="body2">
              Generating questions will clear all questions and audience
              responses
            </Typography>
          </Alert>
          <CustomInput
            labelText="Number of questions"
            id="count"
            formControlProps={{
              fullWidth: false,
            }}
            value={count}
            onChange={(e) => handleCountChange(e)}
            error={!countIsValid()}
          />
          <FormControl className={classes.difficulty}>
            <InputLabel id="difficulty-label">Difficulty</InputLabel>
            <Select
              labelId="difficulty-label"
              id="difficulty-select"
              value={difficulty}
              onChange={handleDifficultyChange}
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
              <MenuItem value="any">Any</MenuItem>
            </Select>
          </FormControl>
          {!!error && <Alert severity="error">{error}</Alert>}
        </>
      }
    />
  );
};
