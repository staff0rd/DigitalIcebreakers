import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Admin from "../layout/layouts/Admin";
import {
  renderLobbyApp,
  createReconnectPayload,
} from "./lobbyShellTestHelpers";

const confirmLobby = (
  emit: (eventName: string, payload?: unknown) => void,
  overrides: Parameters<typeof createReconnectPayload>[0] = {}
) => emit("reconnect", createReconnectPayload(overrides));

describe("lobby flow", () => {
  describe("when there is no lobby", () => {
    it("offers Present and Join in the menu", () => {
      renderLobbyApp(<Admin />);
      expect(screen.getAllByText("Present").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Join").length).toBeGreaterThan(0);
      expect(screen.queryAllByText("New Activity")).toHaveLength(0);
      expect(screen.queryAllByText("Close Lobby")).toHaveLength(0);
    });
  });

  describe("creating a lobby", () => {
    it("sends the lobby name and user to the server", () => {
      const { connection, user } = renderLobbyApp(<Admin />, {
        route: "/create-lobby",
      });
      fireEvent.click(screen.getByTestId("create-lobby-button"));
      expect(connection.invoke).toHaveBeenCalledWith(
        "createLobby",
        "My Lobby",
        expect.objectContaining({ id: user.id })
      );
    });

    describe("when the server confirms the lobby", () => {
      it("shows the presenter menu with the player count", () => {
        const { emit } = renderLobbyApp(<Admin />, {
          route: "/create-lobby",
        });
        fireEvent.click(screen.getByTestId("create-lobby-button"));
        confirmLobby(emit);
        expect(screen.getAllByText("Lobby (0)").length).toBeGreaterThan(0);
        expect(screen.getAllByText("New Activity").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Close Lobby").length).toBeGreaterThan(0);
      });

      it("shows a QR code linking to the lobby", async () => {
        const { emit } = renderLobbyApp(<Admin />, {
          route: "/create-lobby",
        });
        fireEvent.click(screen.getByTestId("create-lobby-button"));
        confirmLobby(emit, { lobbyId: "wxyz" });
        const qrLink = await screen.findByTestId("qrcode-link");
        expect(qrLink).toHaveAttribute(
          "href",
          expect.stringContaining("/wxyz")
        );
      });
    });
  });

  describe("joining a lobby", () => {
    it("connects to the lobby with the entered code", () => {
      const { connection, user } = renderLobbyApp(<Admin />, {
        route: "/join-lobby",
      });
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "wxyz" },
      });
      fireEvent.click(screen.getByTestId("join-lobby"));
      expect(connection.invoke).toHaveBeenCalledWith(
        "connectToLobby",
        expect.objectContaining({ id: user.id }),
        "wxyz"
      );
    });

    describe("when the code is not four characters", () => {
      it("does not connect", () => {
        const { connection } = renderLobbyApp(<Admin />, {
          route: "/join-lobby",
        });
        fireEvent.change(screen.getByRole("textbox"), {
          target: { value: "ab" },
        });
        fireEvent.click(screen.getByTestId("join-lobby"));
        expect(connection.invoke).not.toHaveBeenCalledWith(
          "connectToLobby",
          expect.anything(),
          expect.anything()
        );
      });
    });
  });

  describe("when the server confirms a lobby join", () => {
    it("matches the join code case insensitively", () => {
      const { emit } = renderLobbyApp(<Admin />, { route: "/join-lobby" });
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "abcd" },
      });
      fireEvent.click(screen.getByTestId("join-lobby"));
      confirmLobby(emit, { lobbyId: "ABCD", isPresenter: false });
      expect(screen.getAllByText("Lobby (0)").length).toBeGreaterThan(0);
    });

    describe("when it is for a different lobby than the one being joined", () => {
      it("ignores it", () => {
        const { emit } = renderLobbyApp(<Admin />, { route: "/join-lobby" });
        fireEvent.change(screen.getByRole("textbox"), {
          target: { value: "abcd" },
        });
        fireEvent.click(screen.getByTestId("join-lobby"));
        confirmLobby(emit, { lobbyId: "zzzz", isPresenter: false });
        expect(screen.queryAllByText("Lobby (0)")).toHaveLength(0);
      });
    });

    describe("when an unregistered player reconnects", () => {
      it("does not enter the lobby", () => {
        const { emit } = renderLobbyApp(<Admin />, {
          user: { isRegistered: false },
        });
        confirmLobby(emit, { isPresenter: false, isRegistered: false });
        expect(screen.queryAllByText(/^Lobby \(/)).toHaveLength(0);
        expect(screen.getAllByText("Present").length).toBeGreaterThan(0);
      });
    });
  });

  describe("when players come and go", () => {
    it("updates the lobby player count in the menu", () => {
      const { emit } = renderLobbyApp(<Admin />);
      confirmLobby(emit);
      emit("joined", { id: "p1", name: "Alice" });
      expect(screen.getAllByText("Lobby (1)").length).toBeGreaterThan(0);
      emit("joined", { id: "p2", name: "Bob" });
      expect(screen.getAllByText("Lobby (2)").length).toBeGreaterThan(0);
      emit("left", { id: "p1", name: "Alice" });
      expect(screen.getAllByText("Lobby (1)").length).toBeGreaterThan(0);
    });

    it("does not count the same player twice", () => {
      const { emit } = renderLobbyApp(<Admin />);
      confirmLobby(emit);
      emit("joined", { id: "p1", name: "Alice" });
      emit("joined", { id: "p1", name: "Alice" });
      expect(screen.getAllByText("Lobby (1)").length).toBeGreaterThan(0);
    });

    it("replaces the player list when the server sends all players", () => {
      const { emit } = renderLobbyApp(<Admin />);
      confirmLobby(emit);
      emit("players", [
        { id: "p1", name: "Alice" },
        { id: "p2", name: "Bob" },
        { id: "p3", name: "Carol" },
      ]);
      expect(screen.getAllByText("Lobby (3)").length).toBeGreaterThan(0);
    });
  });

  describe("starting a new game", () => {
    it("sends the chosen game to the server", () => {
      const { emit, connection } = renderLobbyApp(<Admin />);
      confirmLobby(emit);
      fireEvent.click(screen.getAllByText("New Activity")[0]);
      fireEvent.click(screen.getByTestId("game-broadcast"));
      expect(connection.invoke).toHaveBeenCalledWith("newGame", "broadcast");
    });

    describe("when the server starts the game", () => {
      it("navigates the presenter to the game", async () => {
        const { emit } = renderLobbyApp(<Admin />);
        confirmLobby(emit);
        emit("newgame", "broadcast");
        expect(await screen.findByText("Dings: 0")).toBeInTheDocument();
        expect(screen.getAllByText("Broadcast").length).toBeGreaterThan(0);
      });

      it("navigates a player to the game", async () => {
        const { emit } = renderLobbyApp(<Admin />);
        confirmLobby(emit, { isPresenter: false });
        emit("newgame", "broadcast");
        expect(await screen.findByTestId("client-text")).toBeInTheDocument();
      });
    });
  });

  describe("when reconnecting to a lobby with a game in progress", () => {
    it("routes game messages to the game", async () => {
      const { emit } = renderLobbyApp(<Admin />);
      confirmLobby(emit, { isPresenter: false, currentGame: "broadcast" });
      const clientText = await screen.findByTestId("client-text");
      emit("gameMessage", "hello audience");
      expect(clientText).toHaveTextContent("hello audience");
    });
  });

  describe("closing the lobby", () => {
    it("tells the server to close the lobby", async () => {
      const { emit, connection } = renderLobbyApp(<Admin />);
      confirmLobby(emit);
      fireEvent.click(screen.getAllByText("Close Lobby")[0]);
      fireEvent.click(await screen.findByText("Close"));
      expect(connection.invoke).toHaveBeenCalledWith("closelobby");
    });

    describe("when the server closes the lobby", () => {
      it("returns to the no-lobby menu", async () => {
        const { emit } = renderLobbyApp(<Admin />);
        confirmLobby(emit);
        expect(screen.queryAllByText("Present")).toHaveLength(0);
        emit("closelobby");
        expect((await screen.findAllByText("Present")).length).toBeGreaterThan(
          0
        );
        expect(screen.queryAllByText("Close Lobby")).toHaveLength(0);
      });
    });
  });
});
