import { render, screen, fireEvent } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { Provider as ReduxProvider } from "react-redux";
import { AnyAction, configureStore, Middleware } from "@reduxjs/toolkit";
import { describe, it, expect } from "vitest";
import Register from "./Register";
import { rootReducer } from "../store/rootReducer";
import { userAtom } from "../store/atoms/userAtoms";
import { setUserName } from "../store/user/actions";
import { SET_USER_NAME } from "../store/user/types";
import { goToDefaultUrl } from "../store/shell/actions";

const renderRegister = ({ name = "" }: { name?: string } = {}) => {
  const actions: AnyAction[] = [];
  const actionRecorder: Middleware = () => (next) => (action) => {
    actions.push(action as AnyAction);
    return next(action);
  };
  const reduxStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(actionRecorder),
  });
  const jotaiStore = createStore();
  jotaiStore.set(userAtom, { id: "user-1", name, isRegistered: false });
  render(
    <ThemeProvider theme={createTheme({})}>
      <ReduxProvider store={reduxStore}>
        <JotaiProvider store={jotaiStore}>
          <Register />
        </JotaiProvider>
      </ReduxProvider>
    </ThemeProvider>
  );
  return { actions, jotaiStore };
};

const typeName = (name: string) =>
  fireEvent.change(screen.getByRole("textbox"), { target: { value: name } });

const join = () => fireEvent.click(screen.getByTestId("join-lobby-button"));

describe("Register", () => {
  describe("when the user already has a name", () => {
    it("pre-fills the name input", () => {
      renderRegister({ name: "Stafford" });
      expect(screen.getByRole("textbox")).toHaveValue("Stafford");
    });
  });

  it("registers the entered name when joining", () => {
    const { actions } = renderRegister();
    typeName("Alice");
    join();
    expect(actions).toContainEqual(setUserName("Alice"));
    expect(actions).toContainEqual(goToDefaultUrl());
  });

  describe("when the entered name is too short", () => {
    it("does not register", () => {
      const { actions } = renderRegister();
      typeName("ab");
      join();
      expect(
        actions.filter((action) => action.type === SET_USER_NAME)
      ).toHaveLength(0);
    });
  });
});
