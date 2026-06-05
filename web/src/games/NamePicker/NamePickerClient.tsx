import { useAtomValue } from "jotai";
import { Box } from "@mui/material";
import { Colors, ColorUtils } from "../../Colors";
import { namePickerAtom } from "./namePickerAtoms";
import { userAtom } from "../../store/atoms/userAtoms";

const NamePickerClient = () => {
  const user = useAtomValue(userAtom);
  const namePickerState = useAtomValue(namePickerAtom);
  const selectedId = namePickerState.player.selectedId;
  const won = selectedId === user.id;

  const getBackgroundColor = () => {
    if (selectedId) {
      if (won) {
        return ColorUtils.toHtml(Colors.Green.C200);
      } else {
        return ColorUtils.toHtml(Colors.Red.C200);
      }
    }
    return "#eeeeee";
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        flexDirection: "column",
        backgroundColor: getBackgroundColor(),
      }}
    >
      <h1>{user.name}</h1>
      {selectedId && (
        <h2>
          {won && "You won!"}
          {!won && "You lost :("}
        </h2>
      )}
    </Box>
  );
};

export default NamePickerClient;
