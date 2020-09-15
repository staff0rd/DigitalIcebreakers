import React from 'react';
import { useSelector } from '../../../store/useSelector';
import { currentQuestionSelector } from '../reducers/presenterReducer';
import { makeStyles } from '@material-ui/core/styles';
import {
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer
  } from 'recharts';
import { primaryColor } from '../../../layout/assets/jss/material-dashboard-react'
import CustomisedAxisTick from './CustomisedAccessTick';

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(3),
        width: '80%',
        height: '80%',
    },
    paper: {
        height: '100%',
        padding: theme.spacing(3),
    },
    cardHeader: {
        height: '100%',
    },
    chart: {
        height: '100%',
        '& .ct-label': {
            fontSize: '20px',
        },
    },
    question: {
        margin: 0,
    },
}));

export default () => {
    const classes = useStyles();
    const {
        question
    } = useSelector(currentQuestionSelector)

    const answers = question ? question.answers.map(a => {
        const answer = a.correct ? `✅ ${a.text}` : a.text;
        const responses = (question ? question.responses : []).filter(r => r.answerId === a.id).length;
        return {
            answer,
            responses
        }
    }) : [];

    const data = answers.map(a => ({ name: a.answer, count: a.responses }));

    return (
        <>
            {question && (    
                <div className={classes.container}>
                    <ResponsiveContainer width="100%" height="80%" key={question?.id}>
                        <BarChart
                            layout='vertical'
                            data={data}
                            margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <XAxis type="number" />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={<CustomisedAxisTick maxLines={3} />}
                                width={100}
                                tickLine={false}
                            />
                            <Bar dataKey="count" fill={primaryColor[0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <h2 className={classes.question}>{question.text}</h2>
                </div>
            )}
        </>
    )
}