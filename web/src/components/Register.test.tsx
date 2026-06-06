import { render, screen, fireEvent } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { describe, it, expect } from "vitest";
import Register from "./Register";
import { userAtom } from "../store/atoms/userAtoms";
import { lobbyAtom, initialLobbyState } from "../store/atoms/lobbyAtoms";
import { initializeMockTransport } from "../store/jotai/transportTestHelpers";

const renderRegister = ({ name = "" }: { name?: string } = {}) => {
  const jotaiStore = createStore();
  jotaiStore.set(userAtom, { id: "user-1", name, isRegistered: false });
  jotaiStore.set(lobbyAtom, { ...initialLobbyState, joiningLobbyId: "abcd" });
  const signalR = initializeMockTransport(jotaiStore);
  render(
    <ThemeProvider theme={createTheme({})}>
      <JotaiProvider store={jotaiStore}>
        <Register />
      </JotaiProvider>
    </ThemeProvider>
  );
  return { ...signalR, jotaiStore };
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
    const { transport } = renderRegister();
    typeName("Alice");
    join();
    expect(transport.connectToLobby).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "user-1",
        name: "Alice",
        isRegistered: true,
      }),
      "abcd"
    );
  });

  describe("when the entered name is too short", () => {
    it("does not register", () => {
      const { transport } = renderRegister();
      typeName("ab");
      join();
      expect(transport.connectToLobby).not.toHaveBeenCalled();
    });
  });
});
