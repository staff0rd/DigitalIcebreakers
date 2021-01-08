import React from "react";
import { useDispatch } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import Button from "../../layout/components/CustomButtons/Button";
import {
  clearIdeasAction,
  arrangeIdeasAction,
  toggleNamesAction,
} from "./IdeaWallReducer";
import { useConfirmDialog } from "../../util/useConfirmDialog";

const IdeaWallMenu = () => {
  const dispatch = useDispatch();
  const { component: ConfirmClear, open: openConfirmClear } = useConfirmDialog(
    "Clear all ideas?",
    "All ideas will be removed!",
    (close) => dispatch(clearIdeasAction()) && close()
  );
  const {
    component: ConfirmArrange,
    open: openConfirmArrange,
  } = useConfirmDialog(
    "Arrange ideas?",
    "This will re-arrange all ideas",
    (close) => dispatch(arrangeIdeasAction(true)) && close()
  );

  return (
    <>
      <ListItem>
        <Button onClick={() => dispatch(toggleNamesAction())}>
          Toggle Names
        </Button>
      </ListItem>
      <ListItem>
        <Button onClick={() => openConfirmArrange()}>Arrange</Button>
      </ListItem>
      <ListItem>
        <Button onClick={() => openConfirmClear()}>Clear</Button>
      </ListItem>
      <ConfirmClear />
      <ConfirmArrange />
    </>
  );
};

export default IdeaWallMenu;
