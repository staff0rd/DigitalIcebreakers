import { Component } from "react";
import Layout from "./layout/layouts/Admin";
import { guid } from "./util/guid";
import { Events } from "./Events";
import { Provider as JotaiProvider, createStore } from "jotai";
import { Player } from "./Player";
import {
  initializeSignalR,
  connectionConnectAtom,
} from "./store/jotai/signalRAtoms";
import { connectionFactory } from "./store/connectionFactory";
import { userAtom } from "./store/atoms/userAtoms";

import { Theme } from "@mui/material/styles";

declare module "@mui/styles/defaultTheme" {
  interface DefaultTheme extends Theme {}
}

type AppState = {
  user: Player;
  lobby?: AppLobby;
  players: Player[];
  menuItems: Element[];
  currentGame?: string;
  isPresenter: boolean;
};

type AppLobby = {
  name: string;
  id: string;
};

export default class App extends Component<{}, AppState> {
  displayName = App.name;
  private isDebug = false;
  private myStorage: Storage;

  private user: Player;
  private jotaiStore = createStore();

  constructor(props: any) {
    super(props);

    this.isDebug = true;

    this.myStorage = window.sessionStorage;

    this.user = this.getUser();
    this.state = {
      user: this.user,
      isPresenter: false,
      menuItems: [],
      players: [],
    };

    initializeSignalR(this.jotaiStore, connectionFactory);

    this.jotaiStore.set(userAtom, {
      id: this.user.id,
      name: this.user.name || "",
      isRegistered: false,
    });

    window.onresize = () => Events.emit("onresize");

    this.jotaiStore.set(connectionConnectAtom);
  }

  private getUser() {
    if (this.myStorage) {
      const raw = this.myStorage.getItem("user");
      if (raw) {
        try {
          const user = JSON.parse(raw);
          console.log("User retrieved", user);
          return user;
        } catch {
          this.debug("Could not parse user");
        }
      }
    }

    const user = { id: guid() };
    if (this.myStorage) this.myStorage.setItem("user", JSON.stringify(user));

    return user;
  }

  debug(...a: any[]) {
    if (this.isDebug) console.log("[app]", ...a);
  }

  getCurrentLocation() {
    return window.location;
  }

  setMenuItems = (items: Element[]) => {
    this.setState({ menuItems: items });
  };

  render() {
    return (
      <JotaiProvider store={this.jotaiStore}>
        <Layout />
      </JotaiProvider>
    );
  }
}
