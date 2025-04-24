import { getCountMessage } from "./ResponseCount";

describe("getCountMessage", () => {
  it("should handle no participants", () => {
    const result = getCountMessage(0, 0);
    expect(result).toBe("Waiting for participants to join...");
  });
  it("should handle all participants responded", () => {
    const result = getCountMessage(5, 5);
    expect(result).toBe("All 5 participants have responded");
  });
  it("should handle some participants responsded", () => {
    const result = getCountMessage(2, 3);
    expect(result).toBe("2 of 3 participants have responded");
  });
});
