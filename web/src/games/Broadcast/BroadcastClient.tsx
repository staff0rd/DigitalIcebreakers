import { useAtomValue } from "jotai";
import Button from "../../layout/components/CustomButtons/Button";
import { useDispatch } from "store/useSelector";
import Notifications from "@mui/icons-material/Notifications";
import { clientMessage } from "../../store/lobby/actions";
import { broadcastAtom } from "./broadcastAtoms";
import { Box } from "@mui/material";

export const BroadcastClient = () => {
  const dispatch = useDispatch();
  const broadcastState = useAtomValue(broadcastAtom);
  const clientText = broadcastState.client.text;

  const ding = () => {
    dispatch(clientMessage(1));
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1 data-testid="client-text">{clientText}</h1>
      <Button color="primary" onClick={ding}>
        <Notifications />
      </Button>
    </Box>
  );
};
