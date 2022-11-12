import AutoRenewIcon from "@material-ui/icons/Autorenew";
import { useResizeListener } from "games/pixi/useResizeListener";
import * as gsap from "gsap";
import * as PIXI from "pixi.js";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { presenterMessage } from "store/lobby/actions";
import { useSelector } from "store/useSelector";
import { useTimeout } from "util/useTimeout";
import { Colors, ColorUtils } from "../../Colors";
import { ContentContainer } from "../../components/ContentContainer";
import Button from "../../layout/components/CustomButtons/Button";
import Table from "../../layout/components/Table/Table";
import { shuffle } from "../../Random";
import { RootState } from "../../store/RootState";
import { Pixi } from "../pixi/Pixi";
import {
  endRoundAction,
  getPlayerName,
  startRoundAction,
  toggleAutoAgainAction,
} from "./reactionReducer";
import { Shape } from "./Shape";
import { ShapeType } from "./ShapeType";
import { ShapeView } from "./ShapeView";

export const ReactionPresenter = () => {
  const [pixi, setPixi] = useState<PIXI.Application>();
  const [againTween, setAgainTween] =
    useState<ReturnType<typeof gsap.TweenLite.to>>();
  const players = useSelector((state: RootState) => state.lobby.players);
  const againProgress = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { shape, shapes, scores, showScores, autoAgain, choices } = useSelector(
    (state: RootState) => state.games.reaction.presenter
  );

  const getOtherShapes = () => shapes.filter((s) => s.id !== shape!.id);

  const resize = () => {
    if (pixi && shape) {
      pixi.stage.removeChildren();
      const bottomShapes = getOtherShapes();
      const size = pixi.screen.height * 0.7;
      const mainShape = new ShapeView(size, shape);
      mainShape.view.position.set(pixi.screen.width / 2, size / 2);
      const bottomShapesContainer = new PIXI.Container();
      const views = [mainShape];

      let smallShapeWidth: number = 0;
      const shapeMargin = 20;
      bottomShapes.forEach((s) => {
        const shapeView = new ShapeView(pixi!.screen.height * 0.2, s);
        shapeView.view.position.set(
          (shapeView.view.width + shapeMargin) *
            bottomShapesContainer.children.length,
          0
        );
        smallShapeWidth = shapeView.view.width;
        bottomShapesContainer.addChild(shapeView.view);
        views.push(shapeView);
      });
      bottomShapesContainer.position.set(
        pixi.screen.width / 2 -
          ((bottomShapes.length - 1) * (smallShapeWidth + shapeMargin)) / 2,
        pixi.screen.height - shapeMargin + smallShapeWidth / 2
      );
      bottomShapesContainer.pivot.set(0, bottomShapesContainer.height);
      pixi.stage.addChild(mainShape.view, bottomShapesContainer);
      views.forEach((view) => {
        view.update(
          choices.filter((choice) => choice.choice === view.id).length,
          getPlayerName(
            players,
            choices.find(
              (choice) => choice.isFirst && choice.choice === view.id
            )?.id
          )
        );
      });
    }
  };

  const setShape = () => {
    const colors = [
      Colors.Red.C500,
      Colors.Green.C500,
      Colors.Blue.C500,
      Colors.Indigo.C500,
      Colors.Orange.C500,
    ];
    let counter = 0;
    const allShapes: Shape[] = [];
    [ShapeType.Circle, ShapeType.Triangle, ShapeType.Square].forEach((s) => {
      allShapes.push(
        ...colors.map((c) => {
          return { id: counter++, type: s, color: c };
        })
      );
    });

    const newRoundShapes = shuffle(allShapes).slice(0, 6);
    dispatch(
      startRoundAction({ shapes: newRoundShapes, shape: newRoundShapes[0] })
    );
    dispatch(presenterMessage(shuffle([...newRoundShapes])));
  };

  useResizeListener(resize);
  useEffect(resize, [pixi, shape, choices]);

  useEffect(() => {
    if (autoAgain) {
      setAgainTween(
        gsap.TweenLite.to(againProgress.current!.style, 5, {
          width: "0px",
          ease: "power1.in",
          onComplete: () => setShape(),
        })
      );
    } else againTween && againTween.kill();
  }, [autoAgain, scores]);

  useTimeout(
    () => {
      if (shape) {
        dispatch(endRoundAction([...players]));
      }
    },
    2000,
    [shape, autoAgain]
  );

  useEffect(() => setShape(), []);

  if (showScores) {
    if (pixi)
      pixi.view.parentElement && pixi.view.parentElement.removeChild(pixi.view);

    const tableData: any[] = [...scores]
      .sort((a, b) => b.score - a.score)
      .map((p, ix) => [p.score, p.name]);

    return (
      <ContentContainer header="Scores">
        <Table tableData={tableData} />
        <Button
          className="primary"
          startIcon={autoAgain ? <AutoRenewIcon /> : undefined}
          onClick={() => {
            dispatch(toggleAutoAgainAction());
          }}
        >
          Again
        </Button>
        <div
          ref={againProgress}
          style={{
            marginTop: 15,
            width: 500,
            height: 50,
            backgroundColor: ColorUtils.toHtml(Colors.Red.C400),
          }}
        ></div>
      </ContentContainer>
    );
  } else {
    return (
      <Pixi
        backgroundColor={Colors.White}
        onAppChange={(app) => setPixi(app)}
      />
    );
  }
};
