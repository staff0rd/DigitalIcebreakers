import Button from "../../layout/components/CustomButtons/Button";
import { useSetAtom } from "jotai";
import { resetVotesAtom } from "./yesNoMaybeAtoms";
import ListItem from "@mui/material/ListItem";

export const YesNoMaybeMenu = () => {
  // The presenter is the vote authority; resetting locally re-publishes the
  // cleared state so refreshes/late-joins don't resurrect old votes
  const reset = useSetAtom(resetVotesAtom);
  return (
    <ListItem>
      <Button onClick={() => reset()}>Reset</Button>
    </ListItem>
  );
};
