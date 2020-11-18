import React from 'react';
import { useDispatch } from "react-redux";
import IconButton from '@material-ui/core/IconButton';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';
import ScoreIcon from '@material-ui/icons/Score';
import CloseIcon from '@material-ui/icons/Close';
import BarChart from '@material-ui/icons/BarChart';
import LiveHelp from '@material-ui/icons/LiveHelp';
import { toggleShowResponsesAction, toggleShowScoreBoardAction } from '../reducers/presenterReducer';
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from '../../../store/useSelector';

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        bottom:0,
        right:0,
        padding: '16px',
    }
}));

type Props = {
    gotoNextQuestion: Function;
    gotoPreviousQuestion: Function;
    nextQuestionId: string | null;
    previousQuestionId: string | null;
    isTriviaMode: boolean;
}

const PollButtons = (props: Props) => {
    const dispatch = useDispatch();
    const {
        showResponses,
        showScoreBoard,
     } = useSelector(state => ({
         showResponses: state.games.poll.presenter.showResponses,
         showScoreBoard: state.games.poll.presenter.showScoreBoard
     }));
    const classes = useStyles();
    const {
        gotoNextQuestion,
        gotoPreviousQuestion,
        nextQuestionId,
        previousQuestionId,
        isTriviaMode,
    } = props;
    return (
        <div className={classes.root}>
            <IconButton disabled={!previousQuestionId || showScoreBoard} onClick={() => gotoPreviousQuestion()}>
                <NavigateBefore />
            </IconButton>
            <IconButton disabled={showScoreBoard} onClick={() => dispatch(toggleShowResponsesAction())}>
                { showResponses ? <LiveHelp /> : <BarChart /> }
            </IconButton>
            { isTriviaMode && 
                <IconButton onClick={() => dispatch(toggleShowScoreBoardAction())}>
                    { showScoreBoard ? <CloseIcon /> : <ScoreIcon /> }
                </IconButton>
            }
            <IconButton disabled={!nextQuestionId || showScoreBoard} onClick={() => gotoNextQuestion()}>
                <NavigateNext />
            </IconButton>
        </div>
    );
}

export default PollButtons;