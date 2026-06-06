import { useAtomValue, useSetAtom } from "jotai";
import Button from "../../layout/components/CustomButtons/Button";
import Notifications from "@mui/icons-material/Notifications";
import { clientMessageAtom } from "../../store/jotai/transportAtoms";
import { broadcastAtom } from "./broadcastAtoms";
import { Box } from "@mui/material";

export const BroadcastClient = () => {
  const sendClientMessage = useSetAtom(clientMessageAtom);
  const broadcastState = useAtomValue(broadcastAtom);
  const clientText = broadcastState.client.text;

  const ding = () => {
    sendClientMessage(1);
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
