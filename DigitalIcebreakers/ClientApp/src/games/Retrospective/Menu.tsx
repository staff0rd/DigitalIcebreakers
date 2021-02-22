import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import Button from "../../layout/components/CustomButtons/Button";
import { clearIdeasAction, setCategories } from "./presenterReducer";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useSelector } from "store/useSelector";
import { RootState } from "store/RootState";
import { ideasByCategory } from "./ideasByCategory";

export const Menu = () => {
  const dispatch = useDispatch();
  const [confirmClearDialogOpen, setConfirmClearDialogOpen] = useState(false);
  const [
    confirmSetCategoriesDialogOpen,
    setConfirmSetCategoriesDialogOpen,
  ] = useState(false);
  const { ideas, categories } = useSelector(
    (state: RootState) => state.games.retrospective.presenter
  );

  const exportIdeas = () => {
    const fileName = "retrospective.txt";
    const text = categories
      .map(
        (category) =>
          `* ${category.name}\n` +
          ideasByCategory(ideas, category.id)
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
        <Button onClick={() => setConfirmSetCategoriesDialogOpen(true)}>
          Set categories
        </Button>
      </ListItem>
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
      <ConfirmDialog
        header="Set categories?"
        content="All ideas will be removed!"
        open={confirmSetCategoriesDialogOpen}
        setOpen={setConfirmSetCategoriesDialogOpen}
        action={() =>
          dispatch(setCategories([])) &&
          setConfirmSetCategoriesDialogOpen(false)
        }
      />
    </>
  );
};
