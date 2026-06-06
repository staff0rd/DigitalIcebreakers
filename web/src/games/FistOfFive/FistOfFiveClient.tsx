import { clientMessageAtom } from "../../store/jotai/transportAtoms";
import { ContentContainer } from "../../components/ContentContainer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Button from "../../layout/components/CustomButtons/Button";
import { Box, ListItemButton } from "@mui/material";
import { useAtom, useSetAtom } from "jotai";
import { fistOfFiveAtom } from "./fistOfFiveAtoms";

const FistOfFiveClient = () => {
  const sendClientMessage = useSetAtom(clientMessageAtom);
  const [fistOfFiveState, setFistOfFiveState] = useAtom(fistOfFiveAtom);
  const { player } = fistOfFiveState;
  const { questionId, selectedAnswerId, answerLocked, canAnswer, question, answers } = player;

  const selectAnswer = (answerId: string) => {
    setFistOfFiveState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        selectedAnswerId: answerId
      }
    }));
  };

  const lockAnswer = () => {
    sendClientMessage({
      questionId,
      answerId: selectedAnswerId,
    });
    setFistOfFiveState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        answerLocked: true
      }
    }));
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
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                    "&:hover": {
                      backgroundColor: "white",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#8bc34a !important",
                    },
                  }}
                  onClick={() => selectAnswer(answer.id)}
                  selected={selectedAnswerId === answer.id}
                >
                  <Typography sx={{ fontSize: "30px" }} className="answer">
                    {answer.text}
                  </Typography>
                </ListItemButton>
              </ListItem>
            ))}
            <Box sx={{ width: "100%" }}>
              <Button
                color="primary"
                size="lg"
                disabled={answerLocked || !selectedAnswerId}
                onClick={() => lockAnswer()}
              >
                Lock In &amp; Send
              </Button>
            </Box>
          </List>
        </>
      ) : (
        <h2>Please wait...</h2>
      )}
    </ContentContainer>
  );
};

export default FistOfFiveClient;