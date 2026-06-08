import { Box } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import PrintIcon from "@mui/icons-material/Print";
import IconButton from "@mui/material/IconButton";
import { Response } from "games/shared/Poll/types/Response";
import { saveAs } from "file-saver";
import Button from "../../layout/components/CustomButtons/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { presenterMessageAtom } from "../../store/jotai/transportAtoms";
import { useSetAtom } from "jotai";
import { fistOfFiveAtom } from "./fistOfFiveAtoms";

type Props = {
  showResponses: boolean;
  reset: () => void;
  responses?: Response[];
};

export const Buttons = ({ showResponses, reset, responses }: Props) => {
  const sendPresenterMessage = useSetAtom(presenterMessageAtom);
  const setFistOfFiveState = useSetAtom(fistOfFiveAtom);

  const print = () => {
    const data = responses
      ?.map((res) => `"${res.playerName}",${res.answerId}\n`)
      .join("");
    if (data) {
      const fileName = "fist-of-five.csv";
      const fileToSave = new Blob([data], {
        type: "plain/text",
      });
      saveAs(fileToSave, fileName);
    }
  };

  const toggleResponses = () => {
    sendPresenterMessage({ action: "toggleResponses" });
    setFistOfFiveState((prev) => ({
      ...prev,
      presenter: {
        ...prev.presenter,
        showResponses: !prev.presenter.showResponses,
      },
    }));
  };

  return (
    <Box sx={{ display: "flex", marginTop: 2 }}>
      <IconButton
        aria-label="Reset"
        title="Reset"
        data-testid="replay-button"
        onClick={reset}
      >
        <ReplayIcon />
      </IconButton>
      <Button
        round
        color="primary"
        size="sm"
        data-testid="show-responses"
        onClick={toggleResponses}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {showResponses ? <VisibilityOffIcon /> : <VisibilityIcon />}
          {showResponses ? "Hide" : "Show"} Responses
        </Box>
      </Button>
      <IconButton
        aria-label="Export"
        title="Export"
        data-testid="replay-button"
        onClick={print}
      >
        <PrintIcon />
      </IconButton>
    </Box>
  );
};
