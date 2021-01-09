import React, { ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { adminMessage } from "../../store/lobby/actions";
import { ContentContainer } from "../../components/ContentContainer";
import { makeStyles, TextField } from "@material-ui/core";
import { useSelector } from "store/useSelector";
import { resetAction, setTextAction } from "./BroadcastReducer";

const useStyles = makeStyles((theme) => ({
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
    dispatch(adminMessage(""));
  }, []);

  const updateClientText = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    dispatch(setTextAction(target.value));
    dispatch(adminMessage(target.value));
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
