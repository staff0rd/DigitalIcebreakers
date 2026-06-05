import { render, screen } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { describe, it, expect } from "vitest";
import { ConnectionIcon } from "./ConnectionIcon";
import { connectionStatusAtom } from "../store/atoms/connectionAtoms";
import { ConnectionStatus } from "../ConnectionStatus";

const renderConnectionIcon = (status?: ConnectionStatus) => {
  const jotaiStore = createStore();
  if (status !== undefined) {
    jotaiStore.set(connectionStatusAtom, status);
  }
  return render(
    <ThemeProvider theme={createTheme({})}>
      <JotaiProvider store={jotaiStore}>
        <ConnectionIcon />
      </JotaiProvider>
    </ThemeProvider>
  );
};

describe("ConnectionIcon", () => {
  describe("when not connected", () => {
    it("shows the not-connected icon", () => {
      renderConnectionIcon(ConnectionStatus.NotConnected);
      expect(screen.getByTestId("connection-status")).toHaveAttribute(
        "data-status",
        "NotConnected"
      );
    });
  });

  describe("when connection is pending", () => {
    it("shows the unknown icon", () => {
      renderConnectionIcon(ConnectionStatus.Pending);
      expect(screen.getByTestId("connection-status")).toHaveAttribute(
        "data-status",
        "Unknown"
      );
    });
  });

  describe("when connected", () => {
    it("shows the connected icon", () => {
      renderConnectionIcon(ConnectionStatus.Connected);
      expect(screen.getByTestId("connection-status")).toHaveAttribute(
        "data-status",
        "Connected"
      );
    });
  });

  describe("when no connection has been attempted", () => {
    it("defaults to not connected", () => {
      renderConnectionIcon();
      expect(screen.getByTestId("connection-status")).toHaveAttribute(
        "data-status",
        "NotConnected"
      );
    });
  });
});
