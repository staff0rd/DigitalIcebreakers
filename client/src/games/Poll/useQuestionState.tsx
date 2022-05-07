import { useEffect } from "react";
import { useSelector } from "@store/useSelector";
import { presenterMessage } from "@store/lobby/actions";
import { useDispatch } from "react-redux";
import {
  currentQuestionSelector,
  GameState,
} from "../shared/Poll/reducers/currentQuestionSelector";
import { RootState } from "@store/RootState";
import { presenterActions } from "@games/shared/Poll/reducers/presenterActions";

export const useQuestionState = (
  gameName: string,
  gameStateSelector: (state: RootState) => GameState
) => {
  const dispatch = useDispatch();
  const {
    currentQuestionId,
    question,
    questionIds,
    responseCount,
    nextQuestionId,
    previousQuestionId,
    currentQuestionNumber,
    totalQuestions,
    showResponses,
  } = useSelector(currentQuestionSelector(gameStateSelector));

  const { setCurrentQuestionAction } = presenterActions(gameName);

  const { playerCount } = useSelector((state) => ({
    playerCount: state.lobby.players.length,
  }));

  // TODO: move this garbage to the reducer
  useEffect(() => {
    if (questionIds.length && !questionIds.find((f) => currentQuestionId)) {
      dispatch(setCurrentQuestionAction(questionIds[0]));
    }
  }, [questionIds, currentQuestionId]);

  const gotoNextQuestion = () =>
    nextQuestionId && dispatch(setCurrentQuestionAction(nextQuestionId));
  const gotoPreviousQuestion = () =>
    previousQuestionId &&
    dispatch(setCurrentQuestionAction(previousQuestionId));

  useEffect(() => {
    if (question) {
      dispatch(
        presenterMessage({
          questionId: question.id,
          answers: question.answers,
          question: question.text,
        })
      );
    } else {
      dispatch(presenterMessage(null));
    }
  }, [currentQuestionId]);

  return {
    currentQuestionId,
    question,
    questionIds,
    responseCount,
    nextQuestionId,
    previousQuestionId,
    currentQuestionNumber,
    totalQuestions,
    showResponses,
    playerCount,
    gotoNextQuestion,
    gotoPreviousQuestion,
  };
};
