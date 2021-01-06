import React from "react";
import { useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";
import ScoreIcon from "@material-ui/icons/Score";
import CloseIcon from "@material-ui/icons/Close";
import BarChart from "@material-ui/icons/BarChart";
import LiveHelp from "@material-ui/icons/LiveHelp";
import { makeStyles } from "@material-ui/core/styles";
import { presenterActions } from "games/shared/Poll/reducers/presenterActions";
import { NameAndMode } from "games/shared/Poll/types/NameAndMode";
import { toggleShowScoreBoardAction } from "games/Trivia/reducers/triviaPresenterReducer";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    bottom: 0,
    right: 0,
    padding: "16px",
  },
}));

type Props = {
  gotoNextQuestion: Function;
  gotoPreviousQuestion: Function;
  nextQuestionId: string | null;
  previousQuestionId: string | null;
  showResponses: boolean;
  showScoreBoard: boolean;
} & NameAndMode;

const PollButtons = ({
  gotoNextQuestion,
  gotoPreviousQuestion,
  nextQuestionId,
  previousQuestionId,
  showResponses,
  showScoreBoard,
  isTriviaMode,
  gameName,
}: Props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { toggleShowResponsesAction } = presenterActions(gameName);
  return (
    <div className={classes.root}>
      <IconButton
        disabled={!previousQuestionId}
        onClick={() => gotoPreviousQuestion()}
      >
        <NavigateBefore />
      </IconButton>
      <IconButton
        data-testid="show-responses"
        disabled={showScoreBoard}
        onClick={() => dispatch(toggleShowResponsesAction())}
      >
        {showResponses ? <LiveHelp /> : <BarChart />}
      </IconButton>
      {isTriviaMode && (
        <IconButton onClick={() => dispatch(toggleShowScoreBoardAction())}>
          {showScoreBoard ? <CloseIcon /> : <ScoreIcon />}
        </IconButton>
      )}
      <IconButton disabled={!nextQuestionId} onClick={() => gotoNextQuestion()}>
        <NavigateNext />
      </IconButton>
    </div>
  );
};

export default PollButtons;
