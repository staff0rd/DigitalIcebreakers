import { ChangeEvent } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { presenterMessageAtom } from "store/jotai/transportAtoms";
import { ContentContainer } from "components/ContentContainer";
import { TextField, Box } from "@mui/material";
import { broadcastAtom } from "./broadcastAtoms";

export const BroadcastPresenter = () => {
  const broadcastState = useAtomValue(broadcastAtom);
  const setBroadcastState = useSetAtom(broadcastAtom);
  const { dings, text } = broadcastState.presenter;
  const sendPresenterMessage = useSetAtom(presenterMessageAtom);

  const updateClientText = (e: ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setBroadcastState((prev) => ({
      ...prev,
      presenter: { ...prev.presenter, text: newText },
    }));
    sendPresenterMessage(newText);
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
