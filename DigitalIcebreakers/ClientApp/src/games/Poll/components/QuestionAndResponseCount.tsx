import React from 'react';
import { Question } from '../types/Question';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
    question: {
        margin: 0,
        padding: 0,
        textAlign: 'center',
    },
    responseCount: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 25,
    }
}));

type Props = {
    question: Question;
    responseCount: number;
    playerCount: number;
}

const QuestionAndResponseCount = (props: Props) => {
    const {
        question,
        responseCount,
        playerCount
    } = props;
    const classes = useStyles();

    const countMessage = responseCount !== playerCount ?
        `${responseCount} out of possible ${playerCount}` :
        `All ${playerCount} player(s) have answered`;

    return (
        <>
            <h1 className={classes.question}>
                {question.text}
            </h1>
            <div className={classes.responseCount}>
                <Typography variant='overline'>Responses</Typography>
                <Typography>{countMessage}</Typography>
            </div>
        </>
    );
}

export default QuestionAndResponseCount;