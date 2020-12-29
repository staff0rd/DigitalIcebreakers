import React, { useState, useEffect } from "react";
import { Colors, ColorUtils } from "../../Colors";
import { Pixi } from "../pixi/Pixi";
import { useSelector } from "../../store/useSelector";
import { useDispatch } from "react-redux";
import { adminMessage } from "../../store/lobby/actions";
import { pick, between } from "Random";

interface AnimatedText extends PIXI.Text {
  dx: number;
  dy: number;
}

const speed = 2;
const fadeOut = 5;
const fadeUpdateMs = 250;
const fadeOutMs = fadeOut * 1000;

const NamePickerPresenter = () => {
  const [app, setApp] = useState<PIXI.Application>();
  const [pickStarted, setPickStarted] = useState<Date>();
  const [id, setId] = useState<string>();
  const dispatch = useDispatch();

  const users = useSelector((state) => state.lobby.players);
  const { shouldPick } = useSelector((state) => state.games.namePicker);

  useEffect(() => {
    const timer = setInterval(() => {
      const alpha = calculateAlpha();
      if (pickStarted && app) {
        app.stage.children.forEach((displayObject) => {
          const text = displayObject as AnimatedText;
          if (text.name !== id) {
            text.alpha = alpha;
          } else {
            text.alpha = 1;
          }
        });
      }
    }, fadeUpdateMs);
    return () => clearTimeout(timer);
  }, [id, pickStarted, app]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (id) {
        dispatch(adminMessage({ id }));
      }
    }, fadeOutMs);
    return () => clearTimeout(timer);
  }, [id, pickStarted, app]);

  useEffect(() => {
    if (shouldPick) {
      if (users.length) {
        setPickStarted(new Date());
        const selected = pick(users).id;
        console.log("selecting " + selected);
        setId(selected);
      }
    } else {
      console.log("resetting");
      setId(undefined);
      setPickStarted(undefined);
      app?.stage.children.forEach((t) => (t.alpha = 1));
      dispatch(adminMessage({}));
    }
  }, [shouldPick]);

  const getText = (id: string, name: string) => {
    const getTextSize = (name: string) => {
      if (name.length > 20) return 24;
      if (name.length > 10) return 32;
      return 48;
    };
    const text = new PIXI.Text(name, {
      fill: ColorUtils.randomColor().shades[4].shade,
      fontSize: getTextSize(name),
    }) as AnimatedText;
    text.name = id;
    text.pivot.set(text.width / 2, text.height / 2);
    text.dx = pick([-speed, speed]);
    text.dy = pick([-speed, speed]);
    return text;
  };

  const randomizeOrder = (text: AnimatedText) =>
    app?.stage.addChildAt(text, between(0, app?.stage.children.length - 1));

  const calculateAlpha = () => {
    if (pickStarted) {
      const timeDiff = new Date().getTime() - pickStarted.getTime();
      let alpha = (fadeOutMs - timeDiff) / fadeOutMs;
      if (alpha < 0) alpha = 0;
      return alpha;
    }
    return 1;
  };

  const draw = (delta: number) => {
    if (app) {
      users.forEach((u) => {
        const text = app.stage.children.find(
          (t) => t.name === u.id
        ) as AnimatedText;

        if (text) {
          text.position.x += text.dx * delta;
          text.position.y += text.dy * delta;
          if (text.position.x < text.width / 2) {
            text.position.x = text.width / 2;
            text.dx *= -1;
            randomizeOrder(text);
          }
          if (text.position.x > app.screen.width - text.width / 2) {
            text.position.x = app.screen.width - text.width / 2;
            text.dx *= -1;
            randomizeOrder(text);
          }
          if (text.position.y < text.height / 2) {
            text.position.y = text.height / 2;
            text.dy *= -1;
            randomizeOrder(text);
          }
          if (text.position.y > app.screen.height - text.height / 2) {
            text.position.y = app.screen.height - text.height / 2;
            text.dy *= -1;
            randomizeOrder(text);
          }
        }
      });
    }
  };

  useEffect(() => {
    app?.ticker.add(draw);
    return () => {
      app?.ticker.remove(draw);
    };
  }, [app, users]);

  useEffect(() => {
    if (app) {
      users.forEach((u) => {
        if (!app.stage.children.find((p) => p.name === u.id)) {
          const text = getText(u.id, u.name);
          text.alpha = u.id === id ? 1 : calculateAlpha();
          randomizeOrder(text);
          text.position.set(
            between(text.width / 2, app.screen.width - text.width / 2),
            between(text.height / 2, app.screen.height - text.height / 2)
          );
          console.log(
            `placing ${u.name} at ${text.position.x},${text.position.y}`
          );
        }
      });
      app.stage.children.forEach((displayObject) => {
        const currentUser = users.find((u) => u.id === displayObject.name);
        if (!currentUser) {
          app.stage.removeChild(displayObject);
        }
      });
    }
  }, [users, app]);

  return (
    <Pixi backgroundColor={Colors.White} onAppChange={(app) => setApp(app)} />
  );
};

export default NamePickerPresenter;
