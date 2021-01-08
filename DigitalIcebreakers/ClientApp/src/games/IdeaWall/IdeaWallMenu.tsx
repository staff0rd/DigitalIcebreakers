import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import Button from "../../layout/components/CustomButtons/Button";
import {
  clearIdeasAction,
  arrangeIdeasAction,
  toggleNamesAction,
} from "./IdeaWallReducer";
import { ConfirmDialog } from "../../components/ConfirmDialog";

const IdeaWallMenu = () => {
  const dispatch = useDispatch();
  const [confirmArrangeDialogOpen, setConfirmArrangeDialogOpen] = useState(
    false
  );
  const [confirmClearDialogOpen, setConfirmClearDialogOpen] = useState(false);

  return (
    <>
      <ListItem>
        <Button onClick={() => dispatch(toggleNamesAction())}>
          Toggle Names
        </Button>
      </ListItem>
      <ListItem>
        <Button onClick={() => setConfirmArrangeDialogOpen(true)}>
          Arrange
        </Button>
      </ListItem>
      <ConfirmDialog
        header="Arrange ideas?"
        content="This will re-arrange all ideas"
        setOpen={setConfirmArrangeDialogOpen}
        open={confirmArrangeDialogOpen}
        action={() =>
          dispatch(arrangeIdeasAction(true)) &&
          setConfirmArrangeDialogOpen(false)
        }
      />
      <ListItem>
        <Button onClick={() => setConfirmClearDialogOpen(true)}>Clear</Button>
      </ListItem>
      <ConfirmDialog
        header="Clear all ideas?"
        content="All ideas will be removed!"
        open={confirmClearDialogOpen}
        setOpen={setConfirmClearDialogOpen}
        action={() =>
          dispatch(clearIdeasAction()) && setConfirmClearDialogOpen(false)
        }
      />
    </>
  );
};

export default IdeaWallMenu;
