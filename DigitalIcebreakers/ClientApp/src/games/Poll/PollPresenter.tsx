import React, { useState, useEffect } from 'react';
import ContentContainer from '../../components/ContentContainer';
import { useSelector } from '../../store/useSelector';
import { makeStyles } from '@material-ui/core/styles';
import classes from '*.module.css';
import Button from '../../layout/components/CustomButtons/Button';
import IconButton from '@material-ui/core/IconButton';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';
import BarChart from '@material-ui/icons/BarChart';
import { Question } from './Question';
import { Typography } from '@material-ui/core';

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
    const current = useSelector(state => state.games.poll.presenter);
    const [question, setQuestion] = useState<Question | undefined>(current.questions[0]);
    const previousQuestion = useSelector(state => {
        if (question) {
            const ix = current.questions.indexOf(question);
            if (ix > 0)
                return current.questions[ix - 1];
        }
    })
    const nextQuestion = useSelector(state => {
        if (question) {
            const ix = current.questions.indexOf(question);
            return current.questions[ix + 1];
        }
    })

    return (
        <>
            <div className={classes.root}>
                <h1 className={classes.question}>
                    { question ? question.text : 'No questions' }
                </h1>
                <div className={classes.responses}>
                    <Typography variant='overline'>Responses</Typography>
                    <Typography>{question ? question.responses.length : 0}</Typography>
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