import React from 'react';
import { useDispatch } from "react-redux";
import IconButton from '@material-ui/core/IconButton';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';
import ScoreIcon from '@material-ui/icons/Score';
import BarChart from '@material-ui/icons/BarChart';
import LiveHelp from '@material-ui/icons/LiveHelp';
import { toggleResponsesAction } from '../reducers/presenterReducer';
import { makeStyles } from "@material-ui/core/styles";

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
    isShowingResponseChart: boolean;
}

const PollButtons = (props: Props) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const {
        gotoNextQuestion,
        gotoPreviousQuestion,
        nextQuestionId,
        previousQuestionId,
        isShowingResponseChart,
    } = props;
    return (
        <div className={classes.root}>
            <IconButton disabled={!previousQuestionId} onClick={() => gotoPreviousQuestion()}>
                <NavigateBefore />
            </IconButton>
            <IconButton onClick={() => dispatch(toggleResponsesAction())}>
                { isShowingResponseChart ? <LiveHelp /> : <BarChart /> }
            </IconButton>
            <IconButton disabled={!nextQuestionId} onClick={() => gotoNextQuestion()}>
                <NavigateNext />
            </IconButton>
        </div>
    );
}

export default PollButtons;