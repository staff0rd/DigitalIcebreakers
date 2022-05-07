import React from "react";
import { Name } from "./reducer";
import { useButtonStyles } from "@games/shared/Poll/components/useButtonStyles";
import { ShowResponsesButton } from "@games/shared/Poll/components/ShowResponsesButton";
import ReplayIcon from "@material-ui/icons/Replay";
import PrintIcon from "@material-ui/icons/Print";
import IconButton from "@material-ui/core/IconButton";
import { Response } from "@games/shared/Poll/types/Response";

type Props = {
  showResponses: boolean;
  reset: () => void;
  responses?: Response[];
};

export const Buttons = ({ showResponses, reset, responses }: Props) => {
  const classes = useButtonStyles();

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

  return (
    <div className={classes.root}>
      <IconButton
        aria-label="Reset"
        title="Reset"
        data-testid="replay-button"
        onClick={reset}
      >
        <ReplayIcon />
      </IconButton>
      <ShowResponsesButton
        gameName={Name}
        showResponses={showResponses}
        showScoreBoard={false}
      />
      <IconButton
        aria-label="Export"
        title="Export"
        data-testid="replay-button"
        onClick={print}
      >
        <PrintIcon />
      </IconButton>
    </div>
  );
};
