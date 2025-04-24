import Button from "../../layout/components/CustomButtons/Button";
import { reset, pick } from "./NamePickerReducer";
import { useDispatch } from "store/useSelector.js";
import { ListItem } from "@mui/material";

const NamePickerMenu = () => {
  const dispatch = useDispatch();
  return (
    <>
      <ListItem>
        <Button onClick={() => dispatch(reset())}>Reset</Button>
      </ListItem>
      <ListItem>
        <Button onClick={() => dispatch(pick())}>Pick</Button>
      </ListItem>
    </>
  );
};

export default NamePickerMenu;
