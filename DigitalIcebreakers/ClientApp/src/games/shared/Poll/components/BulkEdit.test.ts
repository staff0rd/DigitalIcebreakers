import { TriviaAnswer } from "../types/Answer";
import { validate, ErrorMessages } from "./BulkEdit";

describe("validate", () => {
  it("should reject if first line not question", () => {
    const result = validate("not a question\n- a question", false);
    expect(result.isValid).toBeFalsy();
    expect(result.errorMessage).toBe(
      ErrorMessages.FIRST_LINE_SHOULD_BE_QUESTION
    );
    expect(result.errorLine).toBe(1);
  });

  it("should handle first line not question and second line as correct answer and throw", () => {
    const result = validate("not a question\n* a question", true);
    expect(result.isValid).toBeFalsy();
    expect(result.errorMessage).toBe(
      ErrorMessages.FIRST_LINE_SHOULD_BE_QUESTION
    );
    expect(result.errorLine).toBe(1);
  });

  it("should fail if a question has more than one answer", () => {
    const questionsAndAnswers = `
            - first
            * An answer
            A new answer
            A new answer
            - second
            * An answer
            * A new answer with a longer thing going on
            Another answer
        `;
    const result = validate(questionsAndAnswers, true);
    expect(result.isValid).toBeFalsy();
    expect(result.errorLine).toBe(7);
    expect(result.errorMessage).toBe(
      ErrorMessages.ONLY_ONE_CORRECT_ANSWER_PER_QUESTION
    );
  });

  it("should create questions and answers", () => {
    const questionsAndAnswers = `
            - first
            * An answer
            A new answer
            A new answer
            - second
            An answer
            * A new answer with a longer thing going on
            Another answer
        `;
    const result = validate(questionsAndAnswers, true);
    expect(result.isValid).toBeTruthy();
    expect(result.errorLine).toBeUndefined();
    expect(result.errorMessage).toBeUndefined();
    expect(result.questions.length).toBe(2);
    expect(
      (result.questions[0].answers[0] as TriviaAnswer).correct
    ).toBeTruthy();
    expect(result.questions[0].answers[1].text).toBe("A new answer");
    expect(result.questions[0].answers.length).toBe(3);
    expect(result.questions[1].text).toBe("second");
  });
});
