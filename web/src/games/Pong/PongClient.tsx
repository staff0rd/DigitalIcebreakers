import { Button, Box } from "@mui/material";
import { useAtom, useSetAtom } from "jotai";
import { clientMessageAtom } from "../../store/jotai/signalRAtoms";
import { pongAtom } from "./pongAtoms";
import { ColorUtils } from "../../Colors";

export const PongClient = () => {
  const [state] = useAtom(pongAtom);
  const { releasedColor, team } = state.client;
  const sendClientMessage = useSetAtom(clientMessageAtom);

  const handleMouseDown = (action: string) => () => {
    sendClientMessage(action);
  };

  const handleMouseUp = () => {
    sendClientMessage("release");
  };

  const buttonStyle = {
    backgroundColor: ColorUtils.toHtml(releasedColor),
    height: "40vh",
    width: "80%",
    fontSize: "2rem",
    "&:hover": {
      backgroundColor: ColorUtils.toHtml(releasedColor),
    },
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        gap: "10vh", // Same gap between buttons as from edges
        padding: "10vh 0",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "none" }} data-testid="team">
        {team}
      </div>
      <Button
        variant="contained"
        onMouseDown={handleMouseDown("up")}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown("up")}
        onTouchEnd={handleMouseUp}
        sx={buttonStyle}
        aria-label="up"
      />
      <Button
        variant="contained"
        onMouseDown={handleMouseDown("down")}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown("down")}
        onTouchEnd={handleMouseUp}
        sx={buttonStyle}
        aria-label="down"
      />
    </Box>
  );
};