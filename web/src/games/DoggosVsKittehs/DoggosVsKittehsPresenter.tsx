import { Pixi } from "../pixi/Pixi";
import { Colors } from "../../Colors";
import { Graph } from "../pixi/Graph";
import { useState, useEffect } from "react";
import { useResizeListener } from "../pixi/useResizeListener";
import { useAtomValue } from "jotai";
import { doggosVsKittehsResultsAtom } from "./doggosVsKittehsAtoms";
import * as PIXI from "pixi.js";

const DoggosVsKittehsPresenter = () => {
  const [app, setApp] = useState<PIXI.Application>();

  const state = useAtomValue(doggosVsKittehsResultsAtom);

  const draw = () => {
    if (app) {
      const data = [
        { label: "Doggos", value: state.doggos, color: Colors.Red.C500 },
        { label: "Undecided", value: state.undecided, color: Colors.Grey.C500 },
        { label: "Kittehs", value: state.kittehs, color: Colors.Blue.C500 },
      ];
      app.stage.removeChildren();
      new Graph(app, data);
    }
  };

  useEffect(() => draw(), [app, state, draw]);

  useResizeListener(draw);

  return (
    <Pixi
      onAppChange={(app) => setApp(app)}
      data-testid="doggos-vs-kittehs-presenter"
      data-doggos={state.doggos}
      data-kittehs={state.kittehs}
      data-undecided={state.undecided}
    />
  );
};

export default DoggosVsKittehsPresenter;
