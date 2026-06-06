import { Box, Button } from "@mui/material";
import { useSetAtom } from "jotai";
import { clientMessageAtom } from "../../store/jotai/transportAtoms";

const BuzzerClient = () => {
  const sendClientMessage = useSetAtom(clientMessageAtom);

  const handleMouseDown = () => {
    sendClientMessage("down");
  };

  const handleMouseUp = () => {
    sendClientMessage("up");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "grey.600",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
        sx={{
          width: "50%",
          height: "50%",
          fontSize: "2rem",
          bgcolor: "primary.main",
          "&:active": {
            bgcolor: "error.main",
          },
        }}
      >
        BUZZ
      </Button>
    </Box>
  );
};

export default BuzzerClient;
