import React from "react";
import { RootState } from "store/RootState";
import { Presenter } from "../shared/Poll/Presenter";
import { Name } from "./";

export const PollPresenter = () => {
  return (
    <Presenter
      isTriviaMode={false}
      showScoreBoard={false}
      gameName={Name}
      gameStateSelector={(state: RootState) => ({
        currentQuestionId: state.games.poll.presenter.currentQuestionId,
        questions: state.games.poll.presenter.questions,
        showResponses: state.games.poll.presenter.showResponses,
      })}
    />
  );
};
