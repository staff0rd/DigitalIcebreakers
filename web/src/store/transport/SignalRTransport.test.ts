import { describe, it, expect, vi } from "vitest";
import { HubConnection } from "@microsoft/signalr";
import { SignalRTransport } from "./SignalRTransport";
import { UserState } from "../user/types";

const createFakeConnection = () => {
  const connection = {
    on: vi.fn(),
    off: vi.fn(),
    onclose: vi.fn(),
    start: vi.fn(() => Promise.resolve()),
    invoke: vi.fn(() => Promise.resolve()),
    emit: (eventName: string, payload?: unknown) => {
      connection.on.mock.calls
        .filter((call) => call[0] === eventName)
        .forEach((call) => call[1](payload));
    },
  };
  return connection;
};

const createUser = (overrides: Partial<UserState> = {}): UserState => ({
  id: "user-1",
  name: "Alice",
  isRegistered: true,
  ...overrides,
});

const createTransport = () => {
  const connection = createFakeConnection();
  const transport = new SignalRTransport(
    () => connection as unknown as HubConnection
  );
  return { connection, transport };
};

describe("SignalR transport", () => {
  it("starts the hub connection", async () => {
    const { connection, transport } = createTransport();
    await transport.start();
    expect(connection.start).toHaveBeenCalled();
  });

  it("connects with the user and lobby", async () => {
    const { connection, transport } = createTransport();
    const user = createUser();
    await transport.connect(user, "abcd");
    expect(connection.invoke).toHaveBeenCalledWith("connect", user, "abcd");
  });

  it("creates a lobby", async () => {
    const { connection, transport } = createTransport();
    const user = createUser();
    await transport.createLobby("My Lobby", user);
    expect(connection.invoke).toHaveBeenCalledWith(
      "createLobby",
      "My Lobby",
      user
    );
  });

  it("connects to a lobby", async () => {
    const { connection, transport } = createTransport();
    const user = createUser();
    await transport.connectToLobby(user, "wxyz");
    expect(connection.invoke).toHaveBeenCalledWith(
      "connectToLobby",
      user,
      "wxyz"
    );
  });

  it("closes the lobby", async () => {
    const { connection, transport } = createTransport();
    await transport.closeLobby();
    expect(connection.invoke).toHaveBeenCalledWith("closelobby");
  });

  it("starts a new game", async () => {
    const { connection, transport } = createTransport();
    await transport.newGame("buzzer");
    expect(connection.invoke).toHaveBeenCalledWith("newGame", "buzzer");
  });

  it("sends presenter messages as admin hub messages", async () => {
    const { connection, transport } = createTransport();
    await transport.sendPresenterMessage({ text: "hello" });
    expect(connection.invoke).toHaveBeenCalledWith(
      "hubMessage",
      JSON.stringify({ admin: { text: "hello" } })
    );
  });

  it("sends client messages as client hub messages", async () => {
    const { connection, transport } = createTransport();
    await transport.sendClientMessage("down");
    expect(connection.invoke).toHaveBeenCalledWith(
      "hubMessage",
      JSON.stringify({ client: "down" })
    );
  });

  it("delivers server events to subscribers", () => {
    const { connection, transport } = createTransport();
    const onGameMessage = vi.fn();
    transport.on("gameMessage", onGameMessage);
    connection.emit("gameMessage", { payload: "down", id: "p1", name: "Al" });
    expect(onGameMessage).toHaveBeenCalledWith({
      payload: "down",
      id: "p1",
      name: "Al",
    });
  });

  it("notifies subscribers when the connection closes", () => {
    const { connection, transport } = createTransport();
    const onClosed = vi.fn();
    transport.on("connectionclosed", onClosed);
    const closeHandler = connection.onclose.mock.calls[0][0];
    closeHandler();
    expect(onClosed).toHaveBeenCalled();
  });

  it("stops delivering events after unsubscribing", () => {
    const { connection, transport } = createTransport();
    const onGameMessage = vi.fn();
    transport.on("gameMessage", onGameMessage);
    transport.off("gameMessage");
    connection.emit("gameMessage", "hello");
    expect(onGameMessage).not.toHaveBeenCalled();
  });
});
