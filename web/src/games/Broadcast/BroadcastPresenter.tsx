import { ChangeEvent, useEffect } from "react";
import { useDispatch } from "store/useSelector";
import { presenterMessage } from "store/lobby/actions";
import { ContentContainer } from "components/ContentContainer";
import { TextField } from "@mui/material";
import { useSelector } from "store/useSelector";
import { resetAction, setTextAction } from "./BroadcastReducer";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles(() => ({
  container: {
    textAlign: "center",
    verticalAlign: "middle",
  },
}));

export const BroadcastPresenter = () => {
  const classes = useStyles();
  const { dings, text } = useSelector(
    (state) => state.games.broadcast.presenter
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetAction());
    dispatch(presenterMessage(""));
  }, []);

  const updateClientText = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    dispatch(setTextAction(target.value));
    dispatch(presenterMessage(target.value));
  };

  return (
    <ContentContainer>
      <div className={classes.container}>
        <h1 style={{ fontSize: "100px" }}>Dings: {dings}</h1>
        <TextField
          label="Broadcast this"
          defaultValue="Default Value"
          value={text}
          onChange={updateClientText}
        />
      </div>
    </ContentContainer>
  );
};
