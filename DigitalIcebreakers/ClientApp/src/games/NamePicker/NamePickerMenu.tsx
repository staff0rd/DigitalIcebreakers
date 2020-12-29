import React from "react";
import Button from "../../layout/components/CustomButtons/Button";
import { reset, pick } from "./NamePickerReducer";
import { useDispatch } from "react-redux";
import { useSelector } from "../../store/useSelector";
import { ListItem } from "@material-ui/core";

export default () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.games.pong.presenter);
  return (
    <>
      <ListItem>
        <Button onClick={() => dispatch(reset())}>Reset</Button>
      </ListItem>
      <ListItem>
        <Button onClick={() => dispatch(pick())}>Pick</Button>
      </ListItem>
    </>
  );
};
