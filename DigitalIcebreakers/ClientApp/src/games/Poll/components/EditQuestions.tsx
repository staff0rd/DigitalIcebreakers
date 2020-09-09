import React, { useRef } from 'react';
import Card from '../../../layout/components/Card/Card';
import CardTitle from '../../../layout/components/Card/CardTitle';
import CardFooter from '../../../layout/components/Card/CardFooter';
import CardBody from '../../../layout/components/Card/CardBody';
import Button from '../../../layout/components/CustomButtons/Button';
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import { useSelector } from '../../../store/useSelector';
import ContentContainer from '../../../components/ContentContainer';
import { makeStyles } from '@material-ui/core/styles';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory, NavLink } from 'react-router-dom';
import { guid } from '../../../util/guid';
import { useDispatch } from 'react-redux';
import { addQuestionAction, importQuestionsAction, deleteQuestionAction, clearResponsesAction } from '../reducers/PollReducer';
import array from '../../../util/array';
import { saveAs } from 'file-saver';

const useStyles = makeStyles(theme => ({
    table: {

    },
    answers: {
        paddingLeft: 15,
    },
    file: {
        display: 'none',
    },
}));

export default () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const questions = useSelector(state => state.games.poll.presenter.questions);
    const addQuestion = () => {
        const id = guid();
        dispatch(addQuestionAction(id));
        history.push(`/questions/${id}`)
    }
    const fileUpload = useRef<HTMLInputElement>(null);

    const exportQuestions = () => {
        const fileName = 'questions.json';
        const fileToSave = new Blob([JSON.stringify(questions, null, 4)], {
            type: 'application/json',
        });
        saveAs(fileToSave, fileName);
    }

    const importQuestions = () => {
        if (null !== fileUpload.current) {
            const file = fileUpload.current.files![0];
            if (file) {
                var reader = new FileReader();
                reader.readAsText(file, "UTF-8");
                reader.onload = (evt: ProgressEvent<FileReader>) => {
                    if (evt.target && typeof evt.target.result === "string") {
                        const questions = JSON.parse(evt.target.result);
                        dispatch(importQuestionsAction(questions));
                        if (fileUpload.current !== null) {
                            fileUpload.current.value = '';   
                        }
                    }
                }
            }
        }
    }
    return (
        <ContentContainer>
            <Card>
                <CardTitle title="Questions" subTitle="Edit and arrange your questions here" />
                <CardBody>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Question</TableCell>
                                    <TableCell>Answers</TableCell>
                                    <TableCell>Responses</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {questions
                                .map((question, ix) => (
                                <TableRow key={question.id}>
                                    <TableCell component="th" scope="row">
                                        {question.text}
                                    </TableCell>
                                    <TableCell>
                                        <ul className={classes.answers}>
                                            {question.answers.map((a, ix) => (
                                                <li key={ix.toString()}>
                                                    {a.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                    <TableCell>{question.responses.length}</TableCell>
                                    <TableCell>
                                        <NavLink
                                            to={`/questions/${question.id}`}
                                        >
                                            <IconButton>
                                                <Edit />
                                            </IconButton>
                                        </NavLink>
                                        <IconButton
                                            disabled={ix === 0}
                                            onClick={() => dispatch(importQuestionsAction(array.moveUp(questions, questions.indexOf(question))))}
                                        >
                                            <ArrowUpward />
                                        </IconButton>
                                        <IconButton
                                            disabled={ix === questions.length - 1}
                                            onClick={() => dispatch(importQuestionsAction(array.moveDown(questions, questions.indexOf(question))))}
                                        >
                                            <ArrowDownward />
                                        </IconButton>
                                        <IconButton disabled={questions.length === 1} onClick={() => dispatch(deleteQuestionAction(question))}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                </CardBody>
                <CardFooter>
                    <Button color='primary' onClick={() => addQuestion()}>Add question</Button>
                    <Button onClick={() => dispatch(importQuestionsAction([]))}>Clear all questions</Button>
                    <Button onClick={() => dispatch(clearResponsesAction())}>Clear all responses</Button>
                    <Button onClick={() => (fileUpload.current as any).click()}>Import questions</Button>
                    <Button onClick={() => exportQuestions()}>Export questions</Button>
                    <input
                        ref={fileUpload}
                        type="file"
                        id="file-upload"
                        accept="application/json"
                        className={classes.file}
                        onChange={() => importQuestions()}
                    />
                </CardFooter>
            </Card>
        </ContentContainer>
    )
}