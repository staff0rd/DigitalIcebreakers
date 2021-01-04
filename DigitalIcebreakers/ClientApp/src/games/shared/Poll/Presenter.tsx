import React from "react";
import ResponseChart from "./components/ResponseChart";
import PollButtons from "./components/PollButtons";
import ScoreBoard from "./components/ScoreBoard";
import QuestionAndResponseCount from "./components/QuestionAndResponseCount";
import { NoQuestions } from "./components/NoQuestions";
import { useQuestionState } from "../../Poll/useQuestionState";
import { makeStyles } from "@material-ui/core";
import { RootState } from "store/RootState";
import { GameState } from "games/shared/Poll/reducers/currentQuestionSelector";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  question: {
    margin: 0,
    padding: 0,
    textAlign: "center",
  },
}));

type Props = {
  isTriviaMode: boolean;
  showScoreBoard: boolean;
  gameName: string;
  gameStateSelector: (state: RootState) => GameState;
};

export const Presenter = ({
  isTriviaMode,
  showScoreBoard,
  gameName,
  gameStateSelector,
}: Props) => {
  const classes = useStyles();
  const {
    question,
    responseCount,
    nextQuestionId,
    previousQuestionId,
    currentQuestionNumber,
    totalQuestions,
    showResponses,
    playerCount,
    gotoNextQuestion,
    gotoPreviousQuestion,
  } = useQuestionState(gameName, gameStateSelector);

  const QuestionDisplay = () =>
    showResponses ? (
      <ResponseChart
        gameStateSelector={gameStateSelector}
        isTriviaMode={isTriviaMode}
      />
    ) : (
      <QuestionAndResponseCount
        responseCount={responseCount}
        playerCount={playerCount}
        question={question!}
        currentQuestionNumber={currentQuestionNumber}
        totalQuestions={totalQuestions}
      />
    );

  const QuestionOrScoreBoard = () => {
    if (isTriviaMode && showScoreBoard) {
      return <ScoreBoard />;
    }
    return (
      <div className={classes.root}>
        {question ? <QuestionDisplay /> : <NoQuestions />}
      </div>
    );
  };

  return (
    <>
      <QuestionOrScoreBoard />
      <PollButtons
        gotoNextQuestion={gotoNextQuestion}
        gotoPreviousQuestion={gotoPreviousQuestion}
        previousQuestionId={previousQuestionId}
        nextQuestionId={nextQuestionId}
        isTriviaMode={isTriviaMode}
        showResponses={showResponses}
        showScoreBoard={showScoreBoard}
        gameName={gameName}
      />
    </>
  );
};
