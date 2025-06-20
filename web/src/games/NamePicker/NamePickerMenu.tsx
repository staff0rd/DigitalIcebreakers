import { useSetAtom } from "jotai";
import Button from "../../layout/components/CustomButtons/Button";
import { ListItem } from "@mui/material";
import { namePickerAtom } from "./namePickerAtoms";

const NamePickerMenu = () => {
  const setNamePickerState = useSetAtom(namePickerAtom);
  
  const handleReset = () => {
    setNamePickerState((prev) => ({
      ...prev,
      presenter: { shouldPick: false },
    }));
  };
  
  const handlePick = () => {
    setNamePickerState((prev) => ({
      ...prev,
      presenter: { shouldPick: true },
    }));
  };
  
  return (
    <>
      <ListItem>
        <Button onClick={handleReset}>Reset</Button>
      </ListItem>
      <ListItem>
        <Button onClick={handlePick}>Pick</Button>
      </ListItem>
    </>
  );
};

export default NamePickerMenu;
