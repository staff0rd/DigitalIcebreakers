import {
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Admin from "./layouts/Admin";
import { renderLobbyApp } from "../store/lobbyShellTestHelpers";

const openDrawer = () => fireEvent.click(screen.getByLabelText("open drawer"));

describe("shell", () => {
  describe("mobile drawer", () => {
    it("is closed initially", () => {
      renderLobbyApp(<Admin />);
      expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
    });

    it("opens from the navbar menu button", () => {
      renderLobbyApp(<Admin />);
      openDrawer();
      expect(screen.getByRole("presentation")).toBeInTheDocument();
    });

    it("closes when the menu button is pressed again", async () => {
      renderLobbyApp(<Admin />);
      openDrawer();
      openDrawer();
      await waitFor(() =>
        expect(screen.queryByRole("presentation")).not.toBeInTheDocument()
      );
    });

    describe("when a menu item is selected", () => {
      it("closes", async () => {
        renderLobbyApp(<Admin />);
        openDrawer();
        const drawer = screen.getByRole("presentation");
        fireEvent.click(within(drawer).getByText("Present"));
        await waitFor(() =>
          expect(screen.queryByRole("presentation")).not.toBeInTheDocument()
        );
      });
    });

    describe("when resized to desktop width", () => {
      it("closes", async () => {
        renderLobbyApp(<Admin />);
        openDrawer();
        act(() => {
          window.innerWidth = 1280;
          window.dispatchEvent(new Event("resize"));
        });
        await waitFor(() =>
          expect(screen.queryByRole("presentation")).not.toBeInTheDocument()
        );
      });
    });
  });
});
