import { useAtom, useSetAtom } from "jotai";
import { clientMessageAtom } from "../../store/jotai/transportAtoms";
import { ContentContainer } from "../../components/ContentContainer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Button from "../../layout/components/CustomButtons/Button";
import { ListItemButton } from "@mui/material";
import { infoColor } from "../../layout/assets/jss/material-dashboard-react";
import { triviaStateAtom, selectAnswerAtom, lockAnswerAtom } from "./triviaAtoms";

const TriviaClient = () => {
  const [triviaState] = useAtom(triviaStateAtom);
  const [, selectAnswer] = useAtom(selectAnswerAtom);
  const [, lockAnswer] = useAtom(lockAnswerAtom);
  const sendClientMessage = useSetAtom(clientMessageAtom);

  const {
    questionId,
    selectedAnswerId,
    answerLocked,
    question,
    answers,
    canAnswer,
  } = triviaState.player;

  const handleAnswerSelect = (answerId: string) => {
    selectAnswer(answerId);
  };

  const handleLockAnswer = () => {
    if (!selectedAnswerId) {
      return;
    }
    sendClientMessage({
      questionId,
      answerId: selectedAnswerId,
    });
    lockAnswer();
  };

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

export default TriviaClient;