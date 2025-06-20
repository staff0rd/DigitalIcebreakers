import { Pixi } from "../pixi/Pixi";
import { Colors } from "../../Colors";
import { Graph } from "../pixi/Graph";
import { useState, useEffect } from "react";
import { useResizeListener } from "../pixi/useResizeListener";
import { useAtomValue } from "jotai";
import { doggosVsKittehsAtom } from "./doggosVsKittehsAtoms";
import * as PIXI from "pixi.js";

const DoggosVsKittehsPresenter = () => {
  const [app, setApp] = useState<PIXI.Application>();

  let graph: Graph;

  const state = useAtomValue(doggosVsKittehsAtom);

  const draw = () => {
    if (app) {
      const data = [
        { label: "Doggos", value: state.yes, color: Colors.Red.C500 },
        { label: "Undecided", value: state.maybe, color: Colors.Grey.C500 },
        { label: "Kittehs", value: state.no, color: Colors.Blue.C500 },
      ];
      app.stage.removeChildren();
      console.log("set new graph");

      graph = new Graph(app, data);
    } else {
      console.log("no app");
    }
  };

  useEffect(() => draw(), [app, state, draw]);

  useResizeListener(draw);

  return (
    <Pixi
      onAppChange={(app) => setApp(app)}
      data-testid="doggos-vs-kittehs-presenter"
      data-doggos={state.yes}
      data-kittehs={state.no}
      data-undecided={state.maybe}
    />
  );
};

export default DoggosVsKittehsPresenter;
