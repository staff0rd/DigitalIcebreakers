import { useAtomValue } from "jotai";
import Games from "../games/Games";
import { lobbyAtom } from "../store/atoms/lobbyAtoms";

export const Game = () => {
  const { currentGame, isPresenter } = useAtomValue(lobbyAtom);
  const game = Games.find((g) => g.name === currentGame);

  if (!game) return <div>No game</div>;

  const Component = isPresenter ? game.presenter : game.client;
  return <Component />;
};
