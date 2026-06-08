import Button from "../../layout/components/CustomButtons/Button";
import Stepper from "../../components/Stepper";
import { useAtom, useSetAtom } from "jotai";
import {
  pongAtom,
  resetScoresAtom,
  setPaddleHeightAtom,
  setPaddleWidthAtom,
  setPaddleSpeedAtom,
  setBallSpeedAtom,
} from "./pongAtoms";
import { ListItem } from "@mui/material";

const PongMenu = () => {
  const [state] = useAtom(pongAtom);
  const resetScores = useSetAtom(resetScoresAtom);
  const setPaddleHeight = useSetAtom(setPaddleHeightAtom);
  const setPaddleWidth = useSetAtom(setPaddleWidthAtom);
  const setPaddleSpeed = useSetAtom(setPaddleSpeedAtom);
  const setBallSpeed = useSetAtom(setBallSpeedAtom);
  
  return (
    <>
      <ListItem>
        <Button onClick={() => resetScores()}>Reset score</Button>
      </ListItem>
      <ListItem>
        <Stepper
          label="Paddle height"
          step={1}
          value={state.presenter.paddleHeight}
          setValue={(value) => setPaddleHeight(value)}
        />
      </ListItem>
      <ListItem>
        <Stepper
          label="Paddle width"
          step={-5}
          value={state.presenter.paddleWidth}
          setValue={(value) => setPaddleWidth(value)}
        />
      </ListItem>
      <ListItem>
        <Stepper
          label="Paddle speed"
          step={25}
          value={state.presenter.paddleSpeed}
          setValue={(value) => setPaddleSpeed(value)}
        />
      </ListItem>
      <ListItem>
        <Stepper
          label="Ball speed"
          step={1}
          value={state.presenter.ballSpeed}
          setValue={(value) => setBallSpeed(value)}
        />
      </ListItem>
    </>
  );
};

export default PongMenu;