import AddCircle from "@material-ui/icons/AddCircle";
import People from "@material-ui/icons/People";
import SportsEsports from "@material-ui/icons/SportsEsports";
import Cancel from "@material-ui/icons/Cancel";
import CreateLobby from "../components/CreateLobby";
import CloseLobby from "../components/CloseLobby";
import JoinLobby from "../components/JoinLobby";
import LobbyClosed from "../components/LobbyClosed";
import Lobby from '../components/Lobby';
import Home from '../components/Home'
import NewGame from "../components/NewGame";
import { useSelector } from '../store/useSelector';

export default () => {
  const lobby = useSelector(state => state.lobby);
  return [
    lobby.id && {
      path: "/",
      name: `Lobby (${lobby.players.length})`,
      icon: People,
      component: Lobby,
    },
    !lobby.id && {
      path: "/",
      component: Home,
    },
    !lobby.id && {
      path: "/create-lobby",
      name: "Host",
      icon: AddCircle,
      component: CreateLobby,
    },
    lobby.id && {
      path: "/new-game",
      name: "New Game",
      icon: SportsEsports,
      component: NewGame,
    },
    lobby.currentGame && {
      path: "/game",
      name: "New Game",
      icon: SportsEsports,
      component: NewGame,
    },
    lobby.id && {
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
  ].filter(paths => paths);
}
