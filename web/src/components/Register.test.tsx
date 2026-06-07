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
  const transport = initializeMockTransport(jotaiStore);
  render(
    <ThemeProvider theme={createTheme({})}>
      <JotaiProvider store={jotaiStore}>
        <Register />
      </JotaiProvider>
    </ThemeProvider>
  );
  return { ...transport, jotaiStore };
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

  it("waits for the lobby to confirm the join before navigating", () => {
    // Navigating optimistically races the reconnect's navigation to /game and
    // can strand the player on the home view
    const paths: string[] = [];
    window.addEventListener("navigate-action", (event) =>
      paths.push((event as CustomEvent).detail.path)
    );
    renderRegister();
    typeName("Alice");
    join();
    expect(paths).toEqual([]);
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
