import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Answer } from '../Answer';
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete'
import array from '../../../util/array';

type Props = {
    answers: Answer[];
    setAnswers: (answers: Answer[]) => void;
}

export default ({ answers, setAnswers } : Props) => {
    return (
        <Table aria-label="answers">
            <TableBody>
            {answers
                .map((answer) => (
                <TableRow key={answer.id}>
                    <TableCell component="th" scope="row">
                        {answer.text}
                    </TableCell>
                    <TableCell>
                        <IconButton>
                            <ArrowUpward onClick={() => setAnswers(array.moveUp(answers, answers.indexOf(answer)))} />
                        </IconButton>
                        <IconButton>
                            <ArrowDownward onClick={() => setAnswers(array.moveDown(answers, answers.indexOf(answer)))} />
                        </IconButton>
                        <IconButton>
                            <Delete onClick={() => setAnswers(answers.filter(a => a.id !== answer.id))} />
                        </IconButton>
                    </TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    )
}