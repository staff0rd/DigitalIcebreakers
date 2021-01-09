import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import Button from "../../layout/components/CustomButtons/Button";
import { clearIdeasAction } from "./reducer";
import { ConfirmDialog } from "../../components/ConfirmDialog";

export const Menu = () => {
  const dispatch = useDispatch();
  const [confirmClearDialogOpen, setConfirmClearDialogOpen] = useState(false);

  return (
    <>
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
