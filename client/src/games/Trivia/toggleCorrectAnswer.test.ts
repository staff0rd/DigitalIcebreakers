import { toggleCorrectAnswer } from "./toggleCorrectAnswer";

describe("setCorrectAnswer", () => {
  describe("single toggle from true", () => {
    it("should set false", () => {
      const answers = [{ id: "0", text: "", correct: true }];
      const result = toggleCorrectAnswer(answers, answers[0]);
      expect(result[0].correct).toBe(false);
    });
  });
  describe("single toggle from false", () => {
    it("should set true", () => {
      const answers = [{ id: "0", text: "", correct: false }];
      const result = toggleCorrectAnswer(answers, answers[0]);
      expect(result[0].correct).toBe(true);
    });
  });

  describe("multple toggle from true", () => {
    it("should set false", () => {
      const answers = [
        { id: "0", text: "", correct: true },
        { id: "1", text: "", correct: false },
      ];
      const result = toggleCorrectAnswer(answers, answers[0]);
      expect(result[0].correct).toBe(false);
      expect(result[1].correct).toBe(false);
    });
  });
  describe("multple toggle from false", () => {
    it("should set true", () => {
      const answers = [
        { id: "0", text: "", correct: false },
        { id: "1", text: "", correct: true },
      ];
      const result = toggleCorrectAnswer(answers, answers[0]);
      expect(result[0].correct).toBe(true);
      expect(result[1].correct).toBe(false);
    });
    it("should set false", () => {
      const answers = [
        { id: "0", text: "", correct: true },
        { id: "1", text: "", correct: false },
      ];
      const result = toggleCorrectAnswer(answers, answers[1]);
      expect(result[0].correct).toBe(false);
      expect(result[1].correct).toBe(true);
    });
  });
});
