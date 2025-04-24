import { useDispatch } from "store/useSelector.js";
import IconButton from "@mui/material/IconButton";
import BarChart from "@mui/icons-material/BarChart";
import LiveHelp from "@mui/icons-material/LiveHelp";
import { presenterActions } from "games/shared/Poll/reducers/presenterActions";

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
