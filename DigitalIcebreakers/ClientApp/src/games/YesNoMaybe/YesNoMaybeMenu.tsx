import React from "react";
import Button from "../../layout/components/CustomButtons/Button";
import { useDispatch } from "react-redux";
import { presenterMessage } from "../../store/lobby/actions";
import ListItem from "@material-ui/core/ListItem";

export const YesNoMaybeMenu = () => {
  const dispatch = useDispatch();
  const reset = () => {
    dispatch(presenterMessage("reset"));
  };
  return (
    <ListItem>
      <Button onClick={reset}>Reset</Button>
    </ListItem>
  );
};
