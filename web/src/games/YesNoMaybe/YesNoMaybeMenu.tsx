import Button from "../../layout/components/CustomButtons/Button";
import { useDispatch } from "store/useSelector.js";
import { presenterMessage } from "../../store/lobby/actions";
import ListItem from "@mui/material/ListItem";

export const YesNoMaybeMenu = () => {
  const dispatch = useDispatch();
  const reset = () => {
    dispatch(presenterMessage("reset"));
  };
  return (
    <ListItem>
      <Button onClick={reset}>Reset</Button>
    </ListItem>
  );
};
