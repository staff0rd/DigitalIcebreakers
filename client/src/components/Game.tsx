import React from "react";
import Games from "../games/Games";
import { useSelector } from "../store/useSelector";

export const Game = () => {
  const name = useSelector((state) => state.lobby.currentGame);
  const game = Games.find((g) => g.name === name);
  const isPresenter = useSelector((state) => state.lobby.isPresenter);
  const Component = isPresenter ? game!.presenter : (game!.client as any);

  if (!game) return <div>No game</div>;
  else return <Component />;
};
