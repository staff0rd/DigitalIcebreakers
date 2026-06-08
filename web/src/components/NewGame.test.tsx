import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NewGame from "./NewGame";
import { renderLobbyApp } from "../store/lobbyShellTestHelpers";

describe("new activity list", () => {
  it("lists the available activities", () => {
    renderLobbyApp(<NewGame />);
    expect(screen.getByText("Fist of Five")).toBeInTheDocument();
  });

  it("does not show a 'new' badge on any activity", () => {
    renderLobbyApp(<NewGame />);
    expect(screen.queryAllByTestId("FiberNewIcon")).toHaveLength(0);
  });
});
