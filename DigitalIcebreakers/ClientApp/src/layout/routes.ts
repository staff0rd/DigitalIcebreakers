import AddCircle from "@material-ui/icons/AddCircle";
import LiveTv from "@material-ui/icons/LiveTv";
import GroupAdd from "@material-ui/icons/GroupAdd";
import People from "@material-ui/icons/People";
import SportsEsports from "@material-ui/icons/SportsEsports";
import Cancel from "@material-ui/icons/Cancel";
import CreateLobby from "../components/CreateLobby";
import CloseLobby from "../components/CloseLobby";
import JoinLobby from "../components/JoinLobby";
import Join from "../components/Join";
import LobbyClosed from "../components/LobbyClosed";
import { Lobby } from "../components/Lobby";
import { Home } from "../components/Home";
import NewGame from "../components/NewGame";
import { useSelector } from "../store/useSelector";
import Games from "../games/Games";
import { Game } from "../components/Game";
import { ReactNode } from "react";
import Blank from './Blank';

export interface RouteLink {
  path: string;
  name?: string;
  icon?: ReactNode;
  component: ReactNode;
}

const useRoutes = () => {
  const lobby = useSelector((state) => state.lobby);
  const game = useSelector((state) =>
    Games.find((g) => g.name === state.lobby.currentGame)
  );
  const gameRoutes: RouteLink[] =
    lobby.isAdmin && game && game.routes ? game.routes : [];

  return [
    lobby.id && {
      path: "/",
      name: `Lobby (${lobby.players.length})`,
      icon: People,
      component: Lobby,
      testId: "menu-lobby",
    },
    !lobby.id && {
      path: "/",
      component: Home,
    },
    !lobby.id && {
      path: "/create-lobby",
      name: "Present",
      icon: LiveTv,
      component: CreateLobby,
    },
    !lobby.id && {
      path: "/join-lobby/:id?",
      name: "Join",
      icon: GroupAdd,
      component: Join,
    },
      lobby.isAdmin && {
        path: "/new-game",
        name: "New Activity",
        icon: AddCircle,
        component: NewGame,
    },
    !game && {
      path: "/game",
      component: Blank,
      },
    game && {
      path: "/game",
      name: game.title,
      icon: SportsEsports,
      component: Game,
    },
    ...gameRoutes,
    lobby.id &&
      lobby.isAdmin && {
        path: "/close-lobby",
        name: "Close Lobby",
        icon: Cancel,
        component: CloseLobby,
      },
    {
      path: "/join/:id",
      component: JoinLobby,
    },
    {
      path: "/lobby-closed",
      component: LobbyClosed,
    },
  ].filter((paths) => paths);
};

export default useRoutes;
