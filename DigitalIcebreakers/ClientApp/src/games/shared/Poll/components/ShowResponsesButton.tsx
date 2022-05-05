import React from "react";
import { useDispatch } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import BarChart from "@material-ui/icons/BarChart";
import LiveHelp from "@material-ui/icons/LiveHelp";
import { presenterActions } from "@games/shared/Poll/reducers/presenterActions";

type Props = {
  showResponses: boolean;
  showScoreBoard: boolean;
  gameName: string;
};

export const ShowResponsesButton = ({
  showResponses,
  showScoreBoard,
  gameName,
}: Props) => {
  const dispatch = useDispatch();
  const { toggleShowResponsesAction } = presenterActions(gameName);
  return (
    <IconButton
      data-testid="show-responses"
      title="Toggle Responses"
      disabled={showScoreBoard}
      onClick={() => dispatch(toggleShowResponsesAction())}
    >
      {showResponses ? <LiveHelp /> : <BarChart />}
    </IconButton>
  );
};
