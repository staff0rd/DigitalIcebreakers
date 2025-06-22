import { useState, useEffect } from "react";
import { Colors, ColorUtils } from "../../Colors";
import { between } from "../../Random";
import { Pixi } from "../pixi/Pixi";
import { useAtom } from "jotai";
import { splatAtom } from "./splatAtoms";
import * as PIXI from "pixi.js";

const SplatPresenter = () => {
  const [app, setApp] = useState<PIXI.Application>();

  const [splatState] = useAtom(splatAtom);
  const splats = splatState.count;

  const draw = () => {
    if (app) {
      while (app.stage.children.length < splats) {
        const x = between(0, app.screen.width);
        const y = between(0, app.screen.height);
        const circle = new PIXI.Graphics()
          .beginFill(ColorUtils.randomColor().shades[4].shade)
          .drawCircle(x, y, between(30, 100))
          .endFill();
        app.stage.addChild(circle);
      }
    }
  };

  useEffect(() => draw(), [app, splats]);

  return (
    <Pixi backgroundColor={Colors.White} onAppChange={(app) => setApp(app)} />
  );
};

export default SplatPresenter;
