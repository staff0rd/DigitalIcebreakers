import { getCountMessage } from "./ResponseCount";

describe("getCountMessage", () => {
  it("should handle no players", () => {
    const result = getCountMessage(0, 0);
    expect(result).toBe("Waiting for players to join...");
  });
  it("should handle all players responded", () => {
    const result = getCountMessage(5, 5);
    expect(result).toBe("All 5 players have answered");
  });
  it("should handle some players responsded", () => {
    const result = getCountMessage(2, 3);
    expect(result).toBe("2 of 3 players have answered");
  });
});
