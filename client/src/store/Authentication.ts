import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import { setUser, setUserName } from "./user/actions";
import { Auth, signInAnonymously } from "firebase/auth";
import { guid } from "@util/guid";

const getUserFromStorage = () => {
  if (window.sessionStorage) {
    const raw = window.sessionStorage.getItem("user");
    if (raw) {
      try {
        const user = JSON.parse(raw);
        console.log("User retrieved", user);
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

export const authenticate = async (
  auth: Auth,
  dispatch: Dispatch<AnyAction>
) => {
  const user = getUserFromStorage();

  try {
    await signInAnonymously(auth);
    const authUser = auth.currentUser;
    if (authUser) {
      dispatch(setUser({ id: authUser.uid, name: authUser.displayName ?? "" }));
      if (user.name && user.name !== authUser.displayName) {
        dispatch(setUserName(user.name));
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};
