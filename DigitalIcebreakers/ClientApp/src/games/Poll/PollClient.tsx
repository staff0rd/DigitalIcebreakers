import React from "react";
import { useDispatch } from "react-redux";
import { clientMessage } from "../../store/lobby/actions";
import ContentContainer from "../../components/ContentContainer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { useSelector } from "../../store/useSelector";
import Typography from "@material-ui/core/Typography";
import Button from "../../layout/components/CustomButtons/Button";
import { makeStyles } from "@material-ui/core/styles";
import { selectAnswerAction, lockAnswerAction } from "./reducers/playerReducer";
import { infoColor } from "../../layout/assets/jss/material-dashboard-react";

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

export default () => {
  const dispatch = useDispatch();
  const {
    questionId,
    selectedAnswerId,
    answerLocked,
    canAnswer,
    question,
  } = useSelector((state) => state.games.poll.player);

  const answers = useSelector((state) => state.games.poll.player.answers);

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
            {answers.map((answer) => (
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
