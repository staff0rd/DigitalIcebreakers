import React, { ReactNode, useState } from "react";
import Card from "../../../../layout/components/Card/Card";
import CardTitle from "../../../../layout/components/Card/CardTitle";
import CardFooter from "../../../../layout/components/Card/CardFooter";
import CardBody from "../../../../layout/components/Card/CardBody";
import Button from "../../../../layout/components/CustomButtons/Button";
import Grid from "@material-ui/core/Grid";
import { useSelector } from "../../../../store/useSelector";
import { ContentContainer } from "../../../../components/ContentContainer";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router";
import CustomInput from "../../../../layout/components/CustomInput/CustomInput";
import SnackbarContent from "../../../../layout/components/Snackbar/SnackbarContent";
import { Question } from "../types/Question";
import Typography from "@material-ui/core/Typography";
import EditAnswers from "./EditAnswers";
import { guid } from "../../../../util/guid";
import { grayColor } from "../../../../layout/assets/jss/material-dashboard-react";
import { useDispatch } from "react-redux";
import { presenterActions } from "games/shared/Poll/reducers/presenterActions";
import { NameAndMode } from "../types/NameAndMode";
import { Answer } from "../types/Answer";
import { getPollOrTriviaState } from "../getPollOrTriviaState";
import { RootState } from "store/RootState";
import { Name as PollName } from "games/Poll";

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
  editAnswersChildren?: (setAnswers: SetAnswers) => ReactNode;
} & NameAndMode;

const QuestionEditor = ({ question, gameName, editAnswersChildren }: Props) => {
  const dispatch = useDispatch();
  const totalQuestions = useSelector((store) => {
    const state = getPollOrTriviaState(store, gameName);
    return state.presenter.questions.length;
  });
  const [text, setText] = useState(question.text);
  const [answers, setAnswers] = useState(question.answers);

  const classes = useStyles();
  const history = useHistory();

  const isValid = () => {
    return text.length < 3;
  };

  const { updateQuestionAction, deleteQuestionAction } = presenterActions(
    gameName
  );

  const saveQuestion = () => {
    dispatch(
      updateQuestionAction({
        id: question.id,
        answers,
        responses: question.responses,
        text: text,
      })
    );
    history.push("/questions");
  };

  const deleteQuestion = () => {
    dispatch(deleteQuestionAction(question));
    history.push("/questions");
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
                children={editAnswersChildren}
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
  const gameName = useSelector((state: RootState) => state.lobby.currentGame!);
  const isTriviaMode = gameName !== PollName;
  const questionId = useParams<{ id: string }>().id;

  const question = useSelector((store) => {
    const state = getPollOrTriviaState(store, gameName);
    return state.presenter.questions.find((q) => q.id === questionId);
  });

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
