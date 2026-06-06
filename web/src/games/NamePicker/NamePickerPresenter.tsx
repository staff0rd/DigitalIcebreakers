import { useState, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Colors, ColorUtils } from "../../Colors";
import { Pixi } from "../pixi/Pixi";
import { presenterMessageAtom } from "store/jotai/transportAtoms";
import { pick, between } from "Random";
import { namePickerAtom } from "./namePickerAtoms";
import { lobbyAtom } from "store/atoms/lobbyAtoms";

import * as PIXI from "pixi.js";

interface AnimatedText extends PIXI.Text {
  dx: number;
  dy: number;
}

const speed = 2;
const fadeUpdateMs = 250;

const NamePickerPresenter = () => {
  // Allow override via window object for testing
  const fadeOut = (window as any).__NAME_PICKER_FADE_SECONDS__ || 5;
  const fadeOutMs = fadeOut * 1000;
  const [app, setApp] = useState<PIXI.Application>();
  const [pickStarted, setPickStarted] = useState<Date>();
  const [id, setId] = useState<string>();
  const sendPresenterMessage = useSetAtom(presenterMessageAtom);

  const users = useAtomValue(lobbyAtom).players;
  const namePickerState = useAtomValue(namePickerAtom);
  const { shouldPick } = namePickerState.presenter;

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
        sendPresenterMessage({ id });
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
      sendPresenterMessage({});
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

  const draw = (delta: number): void => {
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
    <Pixi 
      backgroundColor={Colors.White} 
      onAppChange={(app) => setApp(app)}
      data-names={users.map(u => u.name).join(',')}
      data-selected-name={id ? users.find(u => u.id === id)?.name : ''}
      data-selected-id={id || ''}
    />
  );
};

export default NamePickerPresenter;
