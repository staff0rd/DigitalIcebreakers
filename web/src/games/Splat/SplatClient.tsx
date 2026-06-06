import { useState, useEffect } from "react";
import { Button } from "../pixi/Button";
import { Pixi } from "../pixi/Pixi";
import { Colors } from "../../Colors";
import { useSetAtom } from "jotai";
import { clientMessageAtom } from "../../store/jotai/signalRAtoms";
import { useResizeListener } from "../pixi/useResizeListener";
import * as PIXI from "pixi.js";

const SplatClient = () => {
  const [pixi, setPixi] = useState<PIXI.Application>();
  const sendClientMessage = useSetAtom(clientMessageAtom);
  const [button] = useState(
    new Button(
      () => sendClientMessage("up"),
      () => sendClientMessage("down")
    )
  );

  const resize = () => {
    if (pixi) {
      pixi.stage.addChild(button);
      button.x = pixi.screen.width / 4;
      button.y = pixi.screen.height / 4;
      button.render(
        Colors.Blue.C400,
        Colors.Red.C400,
        0,
        0,
        pixi.screen.width / 2,
        pixi.screen.height / 2
      );
    }
  };

  useResizeListener(resize);
  useEffect(resize, [pixi]);

  return (
    <Pixi
      backgroundColor={Colors.BlueGrey.C400}
      onAppChange={(app) => setPixi(app)}
    />
  );
};

export default SplatClient;
