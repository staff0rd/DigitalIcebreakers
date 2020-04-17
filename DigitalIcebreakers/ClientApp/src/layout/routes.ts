/*!

=========================================================
* Material Dashboard React - v1.8.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";
import AddCircle from "@material-ui/icons/AddCircle";
import People from "@material-ui/icons/People";
import Cancel from "@material-ui/icons/Cancel";
// core components/views for Admin layout
import DashboardPage from "./views/Dashboard/Dashboard";
import UserProfile from "./views/UserProfile/UserProfile";
import TableList from "./views/TableList/TableList";
import Typography from "./views/Typography/Typography";
import Icons from "./views/Icons/Icons";
import NotificationsPage from "./views/Notifications/Notifications";
import UpgradeToPro from "./views/UpgradeToPro/UpgradeToPro";
// core components/views for RTL layout
import RTLPage from "./views/RTLPage/RTLPage";
import CreateLobby from "../components/CreateLobby";
import CloseLobby from "../components/CloseLobby";
import JoinLobby from "../components/JoinLobby";
import LobbyClosed from "../components/LobbyClosed";
import { Lobby } from '../components/Lobby';

const getRoutes = (isAdmin: boolean, players: number, lobbyId?: string, currentGame?: string) => [
  lobbyId && {
    path: "/",
    name: `Lobby (${players})`,
    icon: People,
    component: Lobby,
  },
  !lobbyId && {
    path: "/create-lobby",
    name: "Host",
    icon: AddCircle,
    component: CreateLobby,
  },
  lobbyId && {
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

export default getRoutes;
