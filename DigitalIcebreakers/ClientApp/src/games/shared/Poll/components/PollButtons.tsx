import React from "react";
import { useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";
import ScoreIcon from "@material-ui/icons/Score";
import CloseIcon from "@material-ui/icons/Close";
import { NameAndMode } from "games/shared/Poll/types/NameAndMode";
import { toggleShowScoreBoardAction } from "games/Trivia/reducers/triviaPresenterReducer";
import { ShowResponsesButton } from "./ShowResponsesButton";
import { useButtonStyles } from "./useButtonStyles";

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
  const classes = useButtonStyles();
  return (
    <div className={classes.root}>
      <IconButton
        disabled={!previousQuestionId}
        onClick={() => gotoPreviousQuestion()}
      >
        <NavigateBefore />
      </IconButton>
      <ShowResponsesButton
        showResponses={showResponses}
        gameName={gameName}
        showScoreBoard={showScoreBoard}
      />
      {isTriviaMode && (
        <IconButton
          data-testid="show-scoreboard"
          onClick={() => dispatch(toggleShowScoreBoardAction())}
        >
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
