import React from 'react';
import Card from '../../../layout/components/Card/Card';
import CardTitle from '../../../layout/components/Card/CardTitle';
import CardFooter from '../../../layout/components/Card/CardFooter';
import CardBody from '../../../layout/components/Card/CardBody';
import Button from '../../../layout/components/CustomButtons/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
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
import { addQuestionAction } from '../PollingReducer';

const useStyles = makeStyles(theme => ({
    table: {

    },
}));

export default () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const questions = useSelector(state => state.games.polling.presenter.questions.sort((a,b) => a.order - b.order));
    const addQuestion = () => {
        const id = guid();
        dispatch(addQuestionAction(id));
        history.push(`/questions/${id}`)
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
                                    <TableCell><VisibilityIcon /></TableCell>
                                    <TableCell>Answers</TableCell>
                                    <TableCell>Responses</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {questions
                                .map((question) => (
                                <TableRow key={question.id}>
                                    <TableCell component="th" scope="row">
                                        {question.text}
                                    </TableCell>
                                    <TableCell>{question.isVisible}</TableCell>
                                    <TableCell>
                                        <ul>
                                            {question.answers.map(a => (
                                                <li>
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
                                        <IconButton>
                                            <ArrowUpward />
                                        </IconButton>
                                        <IconButton>
                                            <ArrowDownward />
                                        </IconButton>
                                        <IconButton>
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
                    <Button onClick={() => addQuestion()}>Add question</Button>
                    <Button>Clear all questions</Button>
                    <Button>Import questions</Button>
                    <Button>Export questions</Button>
                </CardFooter>
            </Card>
        </ContentContainer>
    )
}