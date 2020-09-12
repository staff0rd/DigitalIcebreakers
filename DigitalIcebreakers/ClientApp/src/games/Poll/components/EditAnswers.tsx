import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Answer } from '../types/Answer';
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete'
import array from '../../../util/array';
import CustomInput from '../../../layout/components/CustomInput/CustomInput';
import { makeStyles } from '@material-ui/core/styles';
import Check from "@material-ui/icons/Check";
import styles from "../../../layout/assets/jss/material-dashboard-react/components/tasksStyle";
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { toggleCorrectAnswer } from './toggleCorrectAnswer';

const useLayoutStyles = makeStyles(styles);

const useStyles = makeStyles(theme => ({
    cell: {
        '&.MuiTableCell-root': {
            borderBottom: 'none',
        },
        padding: '0 0 0 16px !important',
    },
    input: {
        '&.MuiInputBase-root': {
            margin: '0 !important',
        },
    },
    formControl: {
        margin: 0,
        padding: 0,
    },
    correctLabel: {
        verticalAlign: 'middle',
        display: 'inline',
    }
}));

type Props = {
    answers: Answer[];
    setAnswers: (answers: Answer[]) => void;
    questionId: string;
}

export default ({ answers, setAnswers, questionId } : Props) => {
    const classes = useStyles();
    const layoutClasses = useLayoutStyles();
    return (
        <Table aria-label="answers" size='small'>
            <TableBody>
            {answers
                .map((answer, ix) => (
                <TableRow key={answer.id}>
                    <TableCell className={classes.cell} component="th" scope="row">
                    <CustomInput
                        className={classes.input}
                        labelText=""
                        id={`question-text-${answer.id}`}
                        formControlProps={{
                            fullWidth: true,
                            className: classes.formControl,
                        }}
                        value={answer.text}
                        onChange={(e) => setAnswers(answers.map(a => a.id !== answer.id ? a : { ...answer, text: e.target.value }))}
                        error={answer.text.length < 1}
                    />
                    </TableCell>
                    <TableCell className={classes.cell}>
                    <Checkbox
                        checked={answer.correct}
                        onClick={() => setAnswers(toggleCorrectAnswer(answers, answer))}
                        checkedIcon={<Check className={layoutClasses.checkedIcon} />}
                        icon={<Check className={layoutClasses.uncheckedIcon} />}
                    />
                        <Typography className={classes.correctLabel}>
                            Correct
                        </Typography>

                    </TableCell>
                    <TableCell className={classes.cell} >
                        <IconButton onClick={() => setAnswers(array.moveUp(answers, answers.indexOf(answer)))} disabled={ix === 0}>
                            <ArrowUpward />
                        </IconButton>
                        <IconButton onClick={() => setAnswers(array.moveDown(answers, answers.indexOf(answer)))} disabled={ix === answers.length - 1}>
                            <ArrowDownward />
                        </IconButton>
                        <IconButton onClick={() => setAnswers(answers.filter(a => a.id !== answer.id))} disabled={answers.length < 2}>
                            <Delete />
                        </IconButton>
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    )
}