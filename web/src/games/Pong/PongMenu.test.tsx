import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "jotai";
import React from "react";
import PongMenu from "./PongMenu";
import { pongAtom } from "./pongAtoms";
import { useAtomValue } from "jotai";

const AtomStateReader = () => {
  const state = useAtomValue(pongAtom);
  return (
    <div>
      <span data-testid="paddle-height">{state.presenter.paddleHeight}</span>
      <span data-testid="paddle-width">{state.presenter.paddleWidth}</span>
      <span data-testid="paddle-speed">{state.presenter.paddleSpeed}</span>
      <span data-testid="ball-speed">{state.presenter.ballSpeed}</span>
      <span data-testid="score">{state.presenter.score.join(",")}</span>
    </div>
  );
};

describe("PongMenu", () => {
  const renderWithProvider = () => {
    return render(
      <Provider>
        <PongMenu />
        <AtomStateReader />
      </Provider>
    );
  };

  describe("when initially rendered", () => {
    it("should display all control labels", () => {
      renderWithProvider();

      expect(screen.getByText("Paddle height")).toBeInTheDocument();
      expect(screen.getByText("Paddle width")).toBeInTheDocument();
      expect(screen.getByText("Paddle speed")).toBeInTheDocument();
      expect(screen.getByText("Ball speed")).toBeInTheDocument();
    });

    it("should display initial values from pong atom", () => {
      renderWithProvider();
      
      expect(screen.getByTestId("paddle-height")).toHaveTextContent("5");
      expect(screen.getByTestId("paddle-width")).toHaveTextContent("55");
      expect(screen.getByTestId("paddle-speed")).toHaveTextContent("200");
      expect(screen.getByTestId("ball-speed")).toHaveTextContent("3");
    });
  });

  describe("when reset button is clicked", () => {
    it("should reset scores to 0,0", () => {
      renderWithProvider();

      expect(screen.getByTestId("score")).toHaveTextContent("0,0");

      const resetButton = screen.getByRole("button", { name: /Reset score/i });
      fireEvent.click(resetButton);

      expect(screen.getByTestId("score")).toHaveTextContent("0,0");
    });
  });

  describe("when paddle height stepper is changed", () => {
    it("should increase paddle height", () => {
      renderWithProvider();

      expect(screen.getByTestId("paddle-height")).toHaveTextContent("5");

      const increaseButton = screen.getByRole("button", { name: /Increase Paddle height/i });
      fireEvent.click(increaseButton);

      expect(screen.getByTestId("paddle-height")).toHaveTextContent("6");
    });
  });

  describe("when paddle width stepper is changed", () => {
    it("should increase paddle width by 5", () => {
      renderWithProvider();

      expect(screen.getByTestId("paddle-width")).toHaveTextContent("55");

      const decreaseButton = screen.getByRole("button", { name: /Decrease Paddle width/i });
      fireEvent.click(decreaseButton);

      expect(screen.getByTestId("paddle-width")).toHaveTextContent("60");
    });
  });

  describe("when paddle speed is decreased multiple times", () => {
    it("should clamp to minimum value of 1", () => {
      renderWithProvider();

      expect(screen.getByTestId("paddle-speed")).toHaveTextContent("200");

      const decreaseButton = screen.getByRole("button", { name: /Decrease Paddle speed/i });
      fireEvent.click(decreaseButton);

      expect(screen.getByTestId("paddle-speed")).toHaveTextContent("100");
      
      fireEvent.click(decreaseButton);
      expect(screen.getByTestId("paddle-speed")).toHaveTextContent("75");
      
      fireEvent.click(decreaseButton);
      fireEvent.click(decreaseButton);
      fireEvent.click(decreaseButton);
      
      expect(screen.getByTestId("paddle-speed")).toHaveTextContent("1");
    });
  });

  describe("when ball speed stepper is changed", () => {
    it("should increase ball speed", () => {
      renderWithProvider();

      expect(screen.getByTestId("ball-speed")).toHaveTextContent("3");

      const increaseButton = screen.getByRole("button", { name: /Increase Ball speed/i });
      fireEvent.click(increaseButton);

      expect(screen.getByTestId("ball-speed")).toHaveTextContent("4");
    });
  });
});