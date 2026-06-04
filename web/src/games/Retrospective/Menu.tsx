import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import ListItem from "@mui/material/ListItem";
import Button from "../../layout/components/CustomButtons/Button";
import {
  clearIdeasAtom,
  retrospectiveAtom,
  setCategoriesAtom,
} from "./retrospectiveAtoms";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { ideasByCategory } from "./ideasByCategory";
import { saveAs } from "file-saver";

export const Menu = () => {
  const [confirmClearDialogOpen, setConfirmClearDialogOpen] = useState(false);
  const [confirmSetCategoriesDialogOpen, setConfirmSetCategoriesDialogOpen] =
    useState(false);
  const { ideas, categories } = useAtomValue(retrospectiveAtom).presenter;
  const clearIdeas = useSetAtom(clearIdeasAtom);
  const setCategories = useSetAtom(setCategoriesAtom);

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
        action={() => {
          clearIdeas();
          setConfirmClearDialogOpen(false);
        }}
      />
      <ConfirmDialog
        header="Set categories?"
        content="All ideas will be removed!"
        open={confirmSetCategoriesDialogOpen}
        setOpen={setConfirmSetCategoriesDialogOpen}
        action={() => {
          setCategories([]);
          setConfirmSetCategoriesDialogOpen(false);
        }}
      />
    </>
  );
};
