import { test } from "../fixtures/firebase";
import { buzzerShowsPlayerStatesOnPresenter } from "./buzzerScenario";

test.describe("Buzzer over Firebase", () => {
  test("should show player buzzer states on presenter", async ({
    presenter,
    player,
    browser,
    browserFactory,
  }) => {
    test.setTimeout(30000);
    await buzzerShowsPlayerStatesOnPresenter({
      presenter,
      player,
      browser,
      browserFactory,
    });
  });
});
