import { useEffect } from "react";
import { useSelector } from "../../store/useSelector";
import { adminMessage } from "../../store/lobby/actions";
import { useDispatch } from "react-redux";
import {
  currentQuestionSelector,
  GameState,
} from "../shared/Poll/reducers/currentQuestionSelector";
import { Answer } from "games/shared/Poll/types/Answer";
import { RootState } from "store/RootState";
import { presenterActions } from "games/shared/Poll/reducers/presenterActions";

export const useQuestionState = <T extends Answer>(
  gameName: string,
  gameStateSelector: (state: RootState) => GameState<T>
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
  } = useSelector(currentQuestionSelector(gameStateSelector));

  const { setCurrentQuestionAction } = presenterActions(gameName);

  const { showResponses, playerCount } = useSelector((state) => ({
    showResponses: state.games.poll.presenter.showResponses,
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
        adminMessage({
          questionId: question.id,
          answers: question.answers,
          question: question.text,
        })
      );
    } else {
      dispatch(adminMessage(null));
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
