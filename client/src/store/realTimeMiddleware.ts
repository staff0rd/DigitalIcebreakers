import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setLobby, createLobby } from "./lobby/actions";
import { RootState } from "./RootState";
import { getAuth, signInAnonymously } from "firebase/auth";
import { initialise } from "./firebase/initialise";
import * as firebase from "./firebase/actions";
import { authenticate, setUser, setUserName } from "./user/actions";
import { guid } from "@util/guid";

const getUserFromStorage = () => {
  if (window.sessionStorage) {
    const raw = window.sessionStorage.getItem("user");
    if (raw) {
      try {
        const user = JSON.parse(raw);
        return user;
      } catch {
        console.log("Could not parse user");
      }
    }
  }

  const user = { id: guid() };
  if (window.sessionStorage)
    window.sessionStorage.setItem("user", JSON.stringify(user));

  return user;
};

export const createRealTimeMiddleware = () => {
  const app = initialise();
  const auth = getAuth(app);

  const listenerMiddleware = createListenerMiddleware<RootState>();

  listenerMiddleware.startListening({
    actionCreator: authenticate,
    effect: async (_, listenerApi) => {
      const user = getUserFromStorage();

      try {
        await signInAnonymously(auth);
        const authUser = auth.currentUser;
        if (authUser) {
          listenerApi.dispatch(
            setUser({ id: authUser.uid, name: authUser.displayName ?? "" })
          );
          if (user.name && user.name !== authUser.displayName) {
            listenerApi.dispatch(setUserName(user.name));
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    },
  });

  listenerMiddleware.startListening({
    actionCreator: createLobby,
    effect: (action, listenerApi) => {
      const ownerId = listenerApi.getState().user.id;
      const { id, name } = action.payload;
      listenerApi.dispatch(
        firebase.createLobby({
          lobbyId: id,
          name,
          ownerId,
        })
      );
    },
  });

  listenerMiddleware.startListening({
    actionCreator: firebase.createLobby.fulfilled,
    effect: (action, listenerApi) => {
      const { lobbyId, name } = action.payload;
      listenerApi.dispatch(setLobby(lobbyId, name, true, []));
    },
  });

  return { middleware: listenerMiddleware.middleware, auth };
};
