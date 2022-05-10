import React, { Component } from "react";
import Layout from "./layout/layouts/Admin";

import history from "./history";
import { Events } from "./Events";
import { Provider } from "react-redux";
import { configureAppStore } from "./store/configureAppStore";
import { authenticate } from "./store/user/actions";
import { useSelector } from "./store/useSelector";
import { Player } from "./Player";

type AppState = {
  lobby?: AppLobby;
  players: Player[];
  menuItems: JSX.Element[];
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

  private store: ReturnType<typeof configureAppStore>;

  constructor(props: any) {
    super(props);

    this.isDebug = true;

    this.state = {
      isPresenter: false,
      menuItems: [],
      players: [],
    };

    this.store = configureAppStore();

    this.store.dispatch(authenticate());

    window.onresize = () => Events.emit("onresize");
  }

  debug(...a: any[]) {
    if (this.isDebug) console.log("[app]", ...a);
  }

  getCurrentLocation() {
    return history.location || window.location;
  }

  setMenuItems = (items: JSX.Element[]) => {
    this.setState({ menuItems: items });
  };

  render() {
    return (
      <Provider store={this.store}>
        <Main />
      </Provider>
    );
  }
}

const Main = () => {
  const lobby = useSelector((state) => state.lobby);

  return (
    <Layout
      isPresenter={lobby.isPresenter}
      currentGame={lobby.currentGame}
      lobbyId={lobby.id}
    />
  );
};
