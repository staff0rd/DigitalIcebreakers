import AddCircle from "@mui/icons-material/AddCircle";
import LiveTv from "@mui/icons-material/LiveTv";
import GroupAdd from "@mui/icons-material/GroupAdd";
import People from "@mui/icons-material/People";
import SportsEsports from "@mui/icons-material/SportsEsports";
import Cancel from "@mui/icons-material/Cancel";
import CreateLobby from "../components/CreateLobby";
import CloseLobby from "../components/CloseLobby";
import Register from "../components/Register";
import JoinLobby from "../components/JoinLobby";
import LobbyClosed from "../components/LobbyClosed";
import { Lobby } from "../components/Lobby";
import { Home } from "../components/Home";
import NewGame from "../components/NewGame";
import { useSelector } from "../store/useSelector";
import Games from "../games/Games";
import { Game } from "../components/Game";
import { JSX } from "react";
import Blank from "./Blank";

export interface RouteLink {
  path: string;
  route?: string;
  name?: string;
  icon?: typeof GroupAdd;
  component: () => JSX.Element;
  testId?: string;
}

const useRoutes = () => {
  const lobby = useSelector((state) => state.lobby);
  const game = useSelector((state) =>
    Games.find((g) => g.name === state.lobby.currentGame)
  );
  const gameRoutes: RouteLink[] =
    lobby.isPresenter && game && game.routes ? game.routes : [];

  const lobbyRoute = {
    path: "/",
    name: `Lobby (${lobby.players.length})`,
    icon: People,
    component: Lobby,
    testId: "menu-lobby",
  };

  const homeRoute = {
    path: "/",
    component: Home,
  };

  const createLobbyRoute = {
    path: "/create-lobby",
    name: "Present",
    icon: LiveTv,
    component: CreateLobby,
  };

  const joinRoute = {
    route: "/join-lobby/:id?",
    path: "/join-lobby",
    name: "Join",
    icon: GroupAdd,
    component: JoinLobby,
  };

  const newGameRoute = {
    path: "/new-game",
    name: "New Activity",
    icon: AddCircle,
    component: NewGame,
  };

  const noGameRoute = {
    path: "/game",
    component: Blank,
  };

  const gameRoute = {
    path: "/game",
    name: game?.title,
    icon: SportsEsports,
    component: Game,
  };

  const closeLobbyRoute = {
    path: "/close-lobby",
    name: "Close Lobby",
    icon: Cancel,
    component: CloseLobby,
  };

  const registerRoute = {
    path: "/register",
    component: Register,
  };

  const lobbyClosedRoute = {
    path: "/lobby-closed",
    component: LobbyClosed,
  };

  const ifNoLobby = (...routes: RouteLink[]) => (lobby.id ? [] : routes);
  const ifLobby = (...routes: RouteLink[]) => (lobby.id ? routes : []);
  const ifAdmin = (...routes: RouteLink[]) => (lobby.isPresenter ? routes : []);
  const ifGame = (yes: RouteLink[], no: RouteLink[]) => (game ? yes : no);

  return [
    ...ifLobby(lobbyRoute),
    ...ifNoLobby(homeRoute, createLobbyRoute, joinRoute, registerRoute),
    ...ifAdmin(newGameRoute),
    ...ifGame([gameRoute, ...gameRoutes], [noGameRoute]),
    ...ifAdmin(closeLobbyRoute),
    lobbyClosedRoute,
  ];
};

export default useRoutes;
