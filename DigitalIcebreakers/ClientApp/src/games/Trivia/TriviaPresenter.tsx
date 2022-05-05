import React, { useEffect } from "react";
import { useSelector } from "@store/useSelector";
import { presenterMessage } from "@store/lobby/actions";
import { useDispatch } from "react-redux";
import { Presenter } from "../shared/Poll/Presenter";
import { Name } from ".";

export const TriviaPresenter = () => {
  const dispatch = useDispatch();
  const { showScoreBoard, showResponses } = useSelector((state) => ({
    showScoreBoard: state.games.trivia.presenter.showScoreBoard,
    showResponses: state.games.trivia.presenter.showResponses,
  }));
  const canAnswer = !showResponses && !showScoreBoard;
  useEffect(() => {
    dispatch(presenterMessage({ canAnswer }));
    return () => {
      dispatch(presenterMessage({ canAnswer: false }));
    };
  }, [canAnswer]);
  return (
    <Presenter
      isTriviaMode={true}
      showScoreBoard={showScoreBoard}
      gameName={Name}
      gameStateSelector={(state) => ({
        currentQuestionId: state.games.trivia.presenter.currentQuestionId,
        questions: state.games.trivia.presenter.questions,
        showResponses: state.games.trivia.presenter.showResponses,
      })}
    />
  );
};
