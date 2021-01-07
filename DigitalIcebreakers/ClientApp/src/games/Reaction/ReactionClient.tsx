import { Colors } from "../../Colors";
import { Shape } from "./Shape";
import * as PIXI from "pixi.js";
import { drawShape } from "./ShapeView";
import { Pixi } from "../pixi/Pixi";
import { useDispatch } from "react-redux";
import { clientMessage } from "../../store/lobby/actions";
import React, { useEffect, useState } from "react";
import { RootState } from "store/RootState";
import { useResizeListener } from "games/pixi/useResizeListener";
import { useSelector } from "store/useSelector";
import { selectShape } from "./reactionReducer";

export const ReactionPlayer = () => {
  const [pixi, setPixi] = useState<PIXI.Application>();
  const dispatch = useDispatch();
  const { shapes, selectedId } = useSelector(
    (state: RootState) => state.games.reaction.player
  );

  const select = (id: number) => {
    dispatch(clientMessage(id));
    dispatch(selectShape(id));
    resize();
  };

  const draw = (shape: Shape, radius: number, leftOffset = radius) => {
    const g = new PIXI.Graphics();
    let alpha = 1;
    if (selectedId === null) {
      g.on("pointerdown", () => select(shape.id));
      g.buttonMode = true;
      g.interactive = true;
    } else alpha = 0.5;
    if (selectedId === shape.id) {
      g.lineStyle(5, Colors.BlueGrey.C900);
      alpha = 1;
    }
    g.beginFill(shape.color, alpha);

    return drawShape(g, shape.type, leftOffset, radius, radius).endFill();
  };

  const resize = () => {
    if (pixi) {
      console.log("performing layout");
      pixi.stage.removeChildren();
      const margin = 25;
      const radius = Math.min(
        (pixi.screen.width - 3 * margin) / 4,
        (pixi.screen.height - (shapes.length / 2 + 1) * margin) / 6
      );
      for (let i = 0; i < shapes.length; i += 2) {
        const g1 = draw(shapes[i], radius);
        const g2 = draw(shapes[i + 1], radius, radius * 3 + margin);
        const container = new PIXI.Container();
        container.addChild(g1, g2);
        container.position.set(
          pixi.screen.width / 2 - container.width / 2,
          margin + (i / 2) * (radius * 2 + margin)
        );
        pixi.stage.addChild(container);
      }
    }
  };

  useResizeListener(resize);
  useEffect(resize, [pixi, shapes, selectedId]);

  return (
    <Pixi backgroundColor={Colors.White} onAppChange={(app) => setPixi(app)} />
  );
};
