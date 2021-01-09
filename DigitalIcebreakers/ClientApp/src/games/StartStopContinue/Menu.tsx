import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import Button from "../../layout/components/CustomButtons/Button";
import { clearIdeasAction } from "./reducer";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useSelector } from "store/useSelector";
import { RootState } from "store/RootState";
import { getCategories, ideasByCategory } from "./Category";

export const Menu = () => {
  const dispatch = useDispatch();
  const [confirmClearDialogOpen, setConfirmClearDialogOpen] = useState(false);
  const ideas = useSelector(
    (state: RootState) => state.games.startStopContinue.ideas
  );

  const exportIdeas = () => {
    const fileName = "startstopcontinue.txt";
    const text = getCategories()
      .map(
        (category) =>
          `* ${category}\n` +
          ideasByCategory(ideas, category)
            .map((idea) => `    * ${idea.payload.message}\n`)
            .join("")
      )
      .join("");
    const fileToSave = new Blob([text], {
      type: "plain/text",
    });
    saveAs(fileToSave, fileName);
  };

  return (
    <>
      <ListItem>
        <Button onClick={() => exportIdeas()}>Export</Button>
      </ListItem>
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
