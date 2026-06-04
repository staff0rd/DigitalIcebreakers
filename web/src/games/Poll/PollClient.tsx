import { useAtom } from "jotai";
import { useDispatch } from "store/useSelector";
import { clientMessage } from "../../store/lobby/actions";
import { ContentContainer } from "../../components/ContentContainer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Button from "../../layout/components/CustomButtons/Button";
import { Box, ListItemButton } from "@mui/material";
import { infoColor } from "../../layout/assets/jss/material-dashboard-react";
import clsx from "clsx";
import { pollStateAtom, selectAnswerAtom, lockAnswerAtom } from "./pollAtoms";

const PollClient = () => {
  const [pollState] = useAtom(pollStateAtom);
  const [, selectAnswer] = useAtom(selectAnswerAtom);
  const [, lockAnswer] = useAtom(lockAnswerAtom);
  const dispatch = useDispatch();

  const {
    questionId,
    selectedAnswerId,
    answerLocked,
    question,
    answers,
  } = pollState.player;

  const handleAnswerSelect = (answerId: string) => {
    selectAnswer(answerId);
  };

  const handleLockAnswer = () => {
    dispatch(
      clientMessage({
        questionId,
        answerId: selectedAnswerId,
      })
    );
    lockAnswer();
  };

  const canAnswer = true; // Poll always allows answering (unlike Trivia)

  return (
    <ContentContainer>
      {canAnswer || answerLocked ? (
        <>
          <Typography sx={{ fontSize: "30px" }}>{question}</Typography>
          <List>
            {answers.map((answer) => (
              <ListItem key={answer.id}>
                <ListItemButton
                  disableTouchRipple={true}
                  disabled={answerLocked || !canAnswer}
                  sx={{
                    background: "white",
                    padding: 1.25,
                    marginBottom: 1.25,
                    borderRadius: 0.625,
                    "&.MuiListItem-button:hover": {
                      backgroundColor: "white",
                    },
                    "&.MuiListItem-root.Mui-selected": {
                      backgroundColor: `${infoColor[3]} !important`,
                    },
                  }}
                  onClick={() => handleAnswerSelect(answer.id)}
                  selected={selectedAnswerId === answer.id}
                >
                  <Typography sx={{ fontSize: "30px" }} className="answer">
                    {answer.text}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
            <Button
              color="primary"
              size="lg"
              disabled={answerLocked || !selectedAnswerId}
              onClick={handleLockAnswer}
            >
              Lock In &amp; Send
            </Button>
          </List>
        </>
      ) : (
        <h2>Please wait...</h2>
      )}
    </ContentContainer>
  );
};

export default PollClient;