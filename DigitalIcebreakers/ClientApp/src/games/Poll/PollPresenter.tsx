import React, { useState, useEffect } from 'react';
import { useSelector } from '../../store/useSelector';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';
import BarChart from '@material-ui/icons/BarChart';
import { Question } from './Question';
import { Typography } from '@material-ui/core';
import { adminMessage } from '../../store/lobby/actions'
import { useDispatch } from 'react-redux';
import { setCurrentQuestionAction } from './PollReducer';

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    question: {
        margin: 0,
        padding: 0,
        textAlign: 'center',
    },
    responses: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 25,
    },
    buttons: {
        position: 'fixed',
        bottom:0,
        right:0,
        padding: '16px',
    }
}));

export default () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { questions, currentQuestionId } = useSelector(state => state.games.poll.presenter);
    const question = questions.find(q => q.id === currentQuestionId);
    useEffect(() => {
        if (questions.length && !currentQuestionId) {
            dispatch(setCurrentQuestionAction(questions[0].id));
        }
    })
    const responses = useSelector(state => {
        if (question) {
            const q = state.games.poll.presenter.questions.find(q => q.id === question.id);
            if (q) {
                return q.responses.length;
            }
        }
        return 0;
    })
    const getCurrentQuestionIndex = () => question ? questions.indexOf(question) : -1;
    const previousQuestionId = {

        if (question) {
            const ix = 
            if (ix > 0)
                return state.games.poll.presenter.questions[ix - 1];
        }
    })
    const nextQuestionId = useSelector(state => {
        if (question) {
            const ix = state.games.poll.presenter.questions.indexOf(question);
            return state.games.poll.presenter.questions[ix + 1];
        }
    })

    useEffect(() => {
        if (question) {
            dispatch(adminMessage({
                questionId: question.id,
                answers: question.answers,
            }));
        }
        else{
            dispatch(adminMessage(null))
        }
    }, [question]);

    return (
        <>
            <div className={classes.root}>
                <h1 className={classes.question}>
                    { question ? question.text : 'No questions' }
                </h1>
                <div className={classes.responses}>
                    <Typography variant='overline'>Responses</Typography>
                    <Typography>{responses}</Typography>
                </div>
            </div>
            <div className={classes.buttons}>
                <IconButton disabled={!previousQuestion} onClick={() => setQuestion(previousQuestion)}>
                    <NavigateBefore />
                </IconButton>
                <IconButton>
                    <BarChart />
                </IconButton>
                <IconButton disabled={!nextQuestion} onClick={() => setQuestion(nextQuestion)}>
                    <NavigateNext />
                </IconButton>
            </div>
        </>
    )
}