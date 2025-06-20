import { Box, Button } from "@mui/material";
import { useDispatch } from "store/useSelector";
import { clientMessage } from "../../store/lobby/actions";

const BuzzerClient = () => {
  const dispatch = useDispatch();

  const handleMouseDown = () => {
    dispatch(clientMessage("down"));
  };

  const handleMouseUp = () => {
    dispatch(clientMessage("up"));
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
