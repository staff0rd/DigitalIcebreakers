import React from "react";
import { Presenter } from "../shared/Poll/Presenter";
import { Name } from "./";

export const PollPresenter = () => {
  return (
    <Presenter
      isTriviaMode={false}
      showScoreBoard={false}
      gameName={Name}
      gameStateSelector={(state) => ({
        currentQuestionId: state.games.poll.presenter.currentQuestionId,
        questions: state.games.poll.presenter.questions,
      })}
    />
  );
};
