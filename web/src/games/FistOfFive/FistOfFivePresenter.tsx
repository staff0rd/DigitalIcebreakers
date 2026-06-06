import { useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { guid } from "util/guid";
import { presenterMessageAtom } from "store/jotai/signalRAtoms";
import { ResponseCount } from "games/shared/Poll/components/ResponseCount";
import { Buttons } from "./Buttons";
import { Responses } from "./Responses";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { fistOfFiveAtom } from "./fistOfFiveAtoms";
import { lobbyAtom } from "store/atoms/lobbyAtoms";

const getQuestion = () => [
  {
    answers: Array.from({ length: 5 }, (value, key) => key).map((ix) => ({
      id: `${ix + 1}`,
      text: `${ix + 1}`,
    })),
    id: guid(),
    text: "",
    responses: [],
  },
];

const FistOfFivePresenter = () => {
  const sendPresenterMessage = useSetAtom(presenterMessageAtom);
  const [fistOfFiveState, setFistOfFiveState] = useAtom(fistOfFiveAtom);
  const playerCount = useAtomValue(lobbyAtom).players.length;
  
  const { presenter } = fistOfFiveState;
  const question = presenter.questions[0];
  
  // Count responses from the question data
  const responseCount = question?.responses?.length || 0;

  const canAnswer = true;
  useEffect(() => {
    sendPresenterMessage({ canAnswer });
    // Initialize with question structure
    setFistOfFiveState(prev => ({
      ...prev,
      presenter: {
        ...prev.presenter,
        questions: getQuestion()
      }
    }));
    return () => {
      sendPresenterMessage({ canAnswer: false });
    };
  }, []);

  const handleReset = () => {
    sendPresenterMessage({ action: "clearScores" });
    setFistOfFiveState(prev => ({
      ...prev,
      presenter: {
        ...prev.presenter,
        questions: getQuestion(),
        showResponses: false
      }
    }));
  };

  return (
    <Box
      sx={{
        padding: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "80%",
      }}
    >
      <Typography variant="h1">✊ ✋</Typography>
      {presenter.showResponses ? (
        question && <Responses question={question} />
      ) : (
        <ResponseCount
          playerCount={playerCount}
          responseCount={responseCount}
        />
      )}
      <Buttons
        showResponses={presenter.showResponses}
        reset={handleReset}
        responses={question?.responses}
      />
    </Box>
  );
};

export default FistOfFivePresenter;
