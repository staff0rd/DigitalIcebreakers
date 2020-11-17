import React, { useEffect, useState } from 'react';
import { useSelector } from '../../store/useSelector';
import { makeStyles } from '@material-ui/core/styles';
import { adminMessage } from '../../store/lobby/actions'
import { useDispatch } from 'react-redux';
import ResponseChart from './components/ResponseChart';
import Button from '../../layout/components/CustomButtons/Button';
import { useHistory } from 'react-router-dom';
import PollButtons from './components/PollButtons';
import ScoreBoard from './components/ScoreBoard';
import QuestionAndResponseCount from './components/QuestionAndResponseCount';
import { currentQuestionSelector, setCurrentQuestionAction } from './reducers/presenterReducer';

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
}));

const PollPresenter = () => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const {
        currentQuestionId,
        question,
        questionIds,
        responseCount,
        nextQuestionId,
        previousQuestionId,
    } = useSelector(currentQuestionSelector);
    const {
        showResponses,
        showScoreBoard,
     } = useSelector(state => ({
         showResponses: state.games.poll.presenter.showResponses,
         showScoreBoard: state.games.poll.presenter.showScoreBoard
     }));
    
    // TODO: move this garbage to the reducer
    useEffect(() => {
        if (questionIds.length && !questionIds.find(f => currentQuestionId)) {
            dispatch(setCurrentQuestionAction(questionIds[0]));
        }
    }, [questionIds, currentQuestionId])

    const gotoNextQuestion = () => nextQuestionId && dispatch(setCurrentQuestionAction(nextQuestionId));
    const gotoPreviousQuestion = () => previousQuestionId && dispatch(setCurrentQuestionAction(previousQuestionId));
    
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
    }, [currentQuestionId]);

    const NoQuestions = () => {
        return (
            <>
                <h1 className={classes.question}>
                    No questions
                </h1>
                <Button color='primary' onClick={() => history.push('/questions')}>
                    Add some
                </Button>
            </>
        );
    }

    const QuestionDisplay = () => {
        if (showResponses) {
            return <ResponseChart />
        }
        else return (
            <QuestionAndResponseCount
                responseCount={responseCount}
                question={question!}
            />
        );
    }

    const QuestionOrScoreBoard = () => {
        if (showScoreBoard) {
            return <ScoreBoard />
        } 
        return (
            <div className={classes.root}>
                { question ? <QuestionDisplay /> : <NoQuestions /> }
            </div>
        )
    }

    return (
        <>
            <QuestionOrScoreBoard />  
            <PollButtons
                gotoNextQuestion={gotoNextQuestion}
                gotoPreviousQuestion={gotoPreviousQuestion}
                previousQuestionId={previousQuestionId}
                nextQuestionId={nextQuestionId}
            />
        </>
    )
}

export default PollPresenter;