import Button from "../../layout/components/CustomButtons/Button";
import { useSetAtom } from "jotai";
import { presenterMessageAtom } from "../../store/jotai/transportAtoms";
import ListItem from "@mui/material/ListItem";

export const YesNoMaybeMenu = () => {
  const sendPresenterMessage = useSetAtom(presenterMessageAtom);
  const reset = () => {
    sendPresenterMessage("reset");
  };
  return (
    <ListItem>
      <Button onClick={reset}>Reset</Button>
    </ListItem>
  );
};
