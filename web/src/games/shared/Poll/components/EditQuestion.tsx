import { ReactNode, useState } from "react";
import Card from "../../../../layout/components/Card/Card";
import CardTitle from "../../../../layout/components/Card/CardTitle";
import CardFooter from "../../../../layout/components/Card/CardFooter";
import CardBody from "../../../../layout/components/Card/CardBody";
import Button from "../../../../layout/components/CustomButtons/Button";
import Grid from "@mui/material/GridLegacy";

import { useSelector } from "../../../../store/useSelector";
import { useAtom } from "jotai";
import { ContentContainer } from "../../../../components/ContentContainer";
import makeStyles from "@mui/styles/makeStyles";
import { useParams, useNavigate } from "react-router";
import CustomInput from "../../../../layout/components/CustomInput/CustomInput";
import SnackbarContent from "../../../../layout/components/Snackbar/SnackbarContent";
import { Question } from "../types/Question";
import Typography from "@mui/material/Typography";
import EditAnswers from "./EditAnswers";
import { guid } from "../../../../util/guid";
import { grayColor } from "../../../../layout/assets/jss/material-dashboard-react";
import { NameAndMode } from "../types/NameAndMode";
import { Answer } from "../types/Answer";
import { Name as PollName } from "games/Poll";
import { pollStateAtom, setQuestionsAtom as setPollQuestionsAtom } from "../../../Poll/pollAtoms";
import { triviaStateAtom, setQuestionsAtom as setTriviaQuestionsAtom } from "../../../Trivia/triviaAtoms";

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: 0,
    padding: 0,
  },
  noResponses: {
    color: grayColor[0],
    fontStyle: "italic",
  },
}));
type SetAnswers = (answers: Answer[]) => void;

type Props = {
  question: Question;
} & NameAndMode;

const QuestionEditor = ({ question, gameName }: Props) => {
  const [pollState] = useAtom(pollStateAtom);
  const [triviaState] = useAtom(triviaStateAtom);
  const [, setPollQuestions] = useAtom(setPollQuestionsAtom);
  const [, setTriviaQuestions] = useAtom(setTriviaQuestionsAtom);

  const questions =
    gameName === PollName
      ? pollState.presenter.questions
      : triviaState.presenter.questions;
  const setQuestions =
    gameName === PollName ? setPollQuestions : setTriviaQuestions;

  const totalQuestions = questions.length;
  const [text, setText] = useState(question.text);
  const [answers, setAnswers] = useState(question.answers);

  const classes = useStyles();
  const navigate = useNavigate();

  const isValid = () => {
    return text.length < 3;
  };

  const saveQuestion = () => {
    const updatedQuestion = {
      id: question.id,
      answers,
      responses: question.responses,
      text,
    };
    setQuestions(
      questions.map((q) => (q.id === question.id ? updatedQuestion : q))
    );
    navigate("/questions");
  };

  const deleteQuestion = () => {
    setQuestions(questions.filter((q) => q.id !== question.id));
    navigate("/questions");
  };

  return (
    <ContentContainer>
      <Card>
        <CardTitle title="Edit question" />
        <CardBody>
          <Grid container>
            <Grid item xs={12}>
              <Typography className={classes.header} variant="h5">
                Question
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomInput
                labelText="Question text"
                id="question-text"
                formControlProps={{
                  fullWidth: true,
                  className: classes.formControl,
                }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                error={isValid()}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.header} variant="h5">
                Answers
              </Typography>
              <EditAnswers
                answers={answers}
                setAnswers={(answers) => setAnswers(answers)}
                questionId={question.id}
              />
              <Button
                onClick={() =>
                  setAnswers([
                    ...answers,
                    { id: guid(), text: "A new answer", correct: false },
                  ])
                }
              >
                Add answer
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.header} variant="h5">
                Responses
              </Typography>
              {question.responses.length === 0 && (
                <Typography className={classes.noResponses}>
                  No responses
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardBody>
        <CardFooter>
          <Button
            color="primary"
            onClick={() => saveQuestion()}
            disabled={isValid()}
          >
            Save
          </Button>
          <Button
            onClick={() => deleteQuestion()}
            disabled={totalQuestions < 2}
          >
            Delete
          </Button>
        </CardFooter>
      </Card>
    </ContentContainer>
  );
};

const EditQuestion = () => {
  const [pollState] = useAtom(pollStateAtom);
  const [triviaState] = useAtom(triviaStateAtom);

  const gameName = useSelector((state) => state.lobby.currentGame!);
  const isTriviaMode = gameName !== PollName;
  const questionId = useParams<{ id: string }>().id;

  const question = gameName === PollName
    ? pollState.presenter.questions.find((q) => q.id === questionId)
    : triviaState.presenter.questions.find((q) => q.id === questionId);

  return question ? (
    <QuestionEditor
      question={question}
      gameName={gameName}
      isTriviaMode={isTriviaMode}
    />
  ) : (
    <ContentContainer>
      <SnackbarContent message="No such question" color="danger" />
    </ContentContainer>
  );
};

export default EditQuestion;
