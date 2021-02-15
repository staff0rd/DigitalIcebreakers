import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { guid } from "util/guid";
import { adminMessage } from "store/lobby/actions";
import { useDispatch } from "react-redux";
import { ResponseCount } from "games/shared/Poll/components/ResponseCount";
import { useQuestionState } from "games/Poll/useQuestionState";
import { Name } from "./reducer";
import { presenterActions } from "games/shared/Poll/reducers/presenterActions";
import { Buttons } from "./Buttons";
import { makeStyles } from "@material-ui/core/styles";
import { Responses } from "./Responses";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "80%",
  },
}));

const getQuestion = () => [
  {
    answers: Array.from({ length: 5 }, (value, key) => key).map((ix) => ({
      id: `${ix + 1}`,
      text: `${ix + 1}`,
    })),
    id: guid(),
    text: "",
    responses: [],
  },
];

const { importQuestionsAction } = presenterActions(Name);

const FistOfFivePresenter = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const canAnswer = true;
  useEffect(() => {
    dispatch(adminMessage({ canAnswer }));
    dispatch(importQuestionsAction(getQuestion()));
    return () => {
      dispatch(adminMessage({ canAnswer: false }));
    };
  }, [canAnswer]);

  const {
    responseCount,
    showResponses,
    playerCount,
    question,
  } = useQuestionState(Name, (state) => ({
    currentQuestionId: state.games.fistOfFive.presenter.currentQuestionId,
    questions: state.games.fistOfFive.presenter.questions,
    showResponses: state.games.fistOfFive.presenter.showResponses,
  }));

  return (
    <div className={classes.root}>
      <Typography variant="h1">✊ ✋</Typography>
      {showResponses ? (
        question && <Responses question={question} />
      ) : (
        <ResponseCount
          playerCount={playerCount}
          responseCount={responseCount}
        />
      )}
      <Buttons
        showResponses={showResponses}
        reset={() => dispatch(importQuestionsAction(getQuestion()))}
        responses={question?.responses}
      />
    </div>
  );
};

export default FistOfFivePresenter;
