import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clientMessage } from '../../store/lobby/actions'
import ContentContainer from '../../components/ContentContainer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { useSelector } from '../../store/useSelector';
import Typography from '@material-ui/core/Typography';
import Button from '../../layout/components/CustomButtons/Button';
import { makeStyles } from '@material-ui/core/styles';
import { selectAnswerAction, lockAnswerAction } from './reducers/playerReducer';
import { infoColor } from '../../layout/assets/jss/material-dashboard-react';

const useStyles = makeStyles(theme => ({
    item: {
        background: 'white',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        '&.MuiListItem-button:hover': {
            backgroundColor: infoColor[0],
        },
        '&.MuiListItem-root.Mui-selected': {
            backgroundColor: `${infoColor[3]} !important`,
        },
    },
    text: {
        fontSize: '40px',
    },
    button: {
        width: '100%',
    }
}));
  
export default () => {
    const dispatch = useDispatch();
    const { questionId, answers, selectedAnswerId, answerLocked } = useSelector(state => state.games.poll.player);
    const classes = useStyles();
    const lockAnswer = () => {
        dispatch(clientMessage({
            questionId,
            selectedId: selectedAnswerId,
         }));
         dispatch(lockAnswerAction());
    }
    return (
        <ContentContainer>
            <List>    
                { answers.map(answer => (
                    <ListItem
                        button
                        disabled = {answerLocked}
                        className={classes.item}
                        onClick={() => dispatch(selectAnswerAction(answer.id))}
                        selected={selectedAnswerId === answer.id}
                    >
                        <Typography className={classes.text}>
                            { answer.text }
                        </Typography>
                    </ListItem>
                ))}
                <Button
                    className={classes.button}
                    color='primary'
                    size="lg"
                    disabled={answerLocked || !selectedAnswerId}
                    onClick={() => lockAnswer()}
                >
                    Lock In &amp; Send
                </Button>
            </List>
        </ContentContainer>
    )
}
