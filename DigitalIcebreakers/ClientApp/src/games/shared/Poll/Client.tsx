import React from "react";
import { useDispatch } from "react-redux";
import { clientMessage } from "../../../store/lobby/actions";
import { ContentContainer } from "../../../components/ContentContainer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Button from "../../../layout/components/CustomButtons/Button";
import { makeStyles } from "@material-ui/core/styles";
import { infoColor } from "../../../layout/assets/jss/material-dashboard-react";
import { playerActions } from "./reducers/playerActions";
import { Answer, TriviaAnswer } from "./types/Answer";
import { useSelector } from "store/useSelector";
import { Name as PollName } from "games/Poll";

const useStyles = makeStyles(() => ({
  item: {
    background: "white",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    "&.MuiListItem-button:hover": {
      backgroundColor: "white",
    },
    "&.MuiListItem-root.Mui-selected": {
      backgroundColor: `${infoColor[3]} !important`,
    },
  },
  text: {
    fontSize: "30px",
  },
  button: {
    width: "100%",
  },
}));

const Client = () => {
  const dispatch = useDispatch();
  const {
    questionId,
    selectedAnswerId,
    answerLocked,
    canAnswer,
    question,
    currentGame,
    answers,
  } = useSelector((state) => {
    const currentGame = state.lobby.currentGame;
    if (currentGame === PollName) {
      return { ...state.games.poll.player, currentGame, canAnswer: true };
    } else return { ...state.games.trivia.player, currentGame };
  });

  const { lockAnswerAction, selectAnswerAction } = playerActions(currentGame!);

  const classes = useStyles();
  const lockAnswer = () => {
    dispatch(
      clientMessage({
        questionId,
        answerId: selectedAnswerId,
      })
    );
    dispatch(lockAnswerAction());
  };
  return (
    <ContentContainer>
      {canAnswer || answerLocked ? (
        <>
          <Typography className={classes.text}>{question}</Typography>
          <List>
            {(answers as any[]).map((answer: Answer | TriviaAnswer) => (
              <ListItem
                button
                disableTouchRipple={true}
                disabled={answerLocked || !canAnswer}
                className={classes.item}
                onClick={() => dispatch(selectAnswerAction(answer.id))}
                selected={selectedAnswerId === answer.id}
              >
                <Typography className={classes.text}>{answer.text}</Typography>
              </ListItem>
            ))}
            <Button
              className={classes.button}
              color="primary"
              size="lg"
              disabled={answerLocked || !selectedAnswerId}
              onClick={() => lockAnswer()}
            >
              Lock In &amp; Send
            </Button>
          </List>
        </>
      ) : (
        <h2>Wait for next question...</h2>
      )}
    </ContentContainer>
  );
};

export default Client;
