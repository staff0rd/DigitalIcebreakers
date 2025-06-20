import { ChangeEvent, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useDispatch } from "store/useSelector";
import { presenterMessage } from "store/lobby/actions";
import { ContentContainer } from "components/ContentContainer";
import { TextField, Box } from "@mui/material";
import { broadcastAtom } from "./broadcastAtoms";

export const BroadcastPresenter = () => {
  const broadcastState = useAtomValue(broadcastAtom);
  const setBroadcastState = useSetAtom(broadcastAtom);
  const { dings, text } = broadcastState.presenter;
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset state on mount
    setBroadcastState({
      client: { text: "" },
      presenter: { text: "", dings: 0 },
    });
    dispatch(presenterMessage(""));
  }, [setBroadcastState, dispatch]);

  const updateClientText = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setBroadcastState((prev) => ({
      ...prev,
      presenter: { ...prev.presenter, text: newText },
    }));
    dispatch(presenterMessage(newText));
  };

  return (
    <ContentContainer>
      <Box sx={{ textAlign: "center", verticalAlign: "middle" }}>
        <h1 style={{ fontSize: "100px" }}>Dings: {dings}</h1>
        <TextField
          label="Broadcast this"
          value={text}
          onChange={updateClientText}
        />
      </Box>
    </ContentContainer>
  );
};
