import React, { useEffect, useState } from 'react';
import { useSelector } from '../../store/useSelector';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { adminMessage } from '../../store/lobby/actions'
import { useDispatch } from 'react-redux';
import ResponseChart from './components/ResponseChart';
import Button from '../../layout/components/CustomButtons/Button';
import { useHistory } from 'react-router-dom';
import PollButtons from './components/PollButtons';
import QuestionAndResponseCount from './components/QuestionAndResponseCount';
import { currentQuestionSelector, setCurrentQuestionAction } from './reducers/presenterReducer';

const ScoreBoard = () => {
    return <h1>The score</h1>
}

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
    const [showScoreBoard, setShowScoreBoard] = useState<boolean>(false);

    return showScoreBoard ? <ScoreBoard /> : <QuestionView />;
}

const QuestionView = () => {
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
    } = useSelector(state => ({
        showResponses: state.games.poll.presenter.showResponses,
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

    return (
        <>
            <div className={classes.root}>
                { question ? ( showResponses ? <ResponseChart /> : (
                    <QuestionAndResponseCount
                        responseCount={responseCount}
                        question={question!}
                    />
                ) ) : (
                    <>
                        <h1 className={classes.question}>
                            No questions
                        </h1>
                        <Button color='primary' onClick={() => history.push('/questions')}>
                            Add some
                        </Button>
                    </>
                )}
            </div>
            <PollButtons
                gotoNextQuestion={gotoNextQuestion}
                gotoPreviousQuestion={gotoPreviousQuestion}
                isShowingResponseChart={showResponses}
                previousQuestionId={previousQuestionId}
                nextQuestionId={nextQuestionId}
            />
        </>
    )
}

export default PollPresenter;