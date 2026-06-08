import { useState } from "react";
import { useSetAtom } from "jotai";
import ListItem from "@mui/material/ListItem";
import Button from "../../layout/components/CustomButtons/Button";
import {
  clearIdeasAtom,
  arrangeIdeasAtom,
  toggleNamesAtom,
} from "./atoms";
import { ConfirmDialog } from "../../components/ConfirmDialog";

const IdeaWallMenu = () => {
  const clearIdeas = useSetAtom(clearIdeasAtom);
  const arrangeIdeas = useSetAtom(arrangeIdeasAtom);
  const toggleNames = useSetAtom(toggleNamesAtom);
  const [confirmArrangeDialogOpen, setConfirmArrangeDialogOpen] =
    useState(false);
  const [confirmClearDialogOpen, setConfirmClearDialogOpen] = useState(false);

  return (
    <>
      <ListItem>
        <Button onClick={() => toggleNames()}>
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
        action={() => {
          arrangeIdeas(true);
          setConfirmArrangeDialogOpen(false);
        }}
      />
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
    </>
  );
};

export default IdeaWallMenu;
