import React, { useState } from 'react';
import Card from '../../../layout/components/Card/Card';
import CardTitle from '../../../layout/components/Card/CardTitle';
import CardFooter from '../../../layout/components/Card/CardFooter';
import CardBody from '../../../layout/components/Card/CardBody';
import Button from '../../../layout/components/CustomButtons/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import { useSelector } from '../../../store/useSelector';
import ContentContainer from '../../../components/ContentContainer';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router';
import CustomInput from '../../../layout/components/CustomInput/CustomInput';
import SnackbarContent from '../../../layout/components/Snackbar/SnackbarContent';
import { Question } from '../Question';
import Check from "@material-ui/icons/Check";
import Checkbox from '@material-ui/core/Checkbox';
import styles from "../../../layout/assets/jss/material-dashboard-react/components/tasksStyle";
import Typography from '@material-ui/core/Typography';
import Table from '../../../layout/components/Table/Table';
import EditAnswers from './EditAnswers';
import { guid } from '../../../util/guid';

const useTaskStyles = makeStyles(styles);


type Props = {
    question: Question
}

const QuestionEditor = ({ question }: Props) => {
    const [text, setText] = useState(question.text);
    const [visibility, setVisibility] = useState(question.isVisible);
    const [answers, setAnswers] = useState(question.answers);
    const taskClasses = useTaskStyles();
    return (
        <ContentContainer>
            <Card>
                <CardTitle title="Edit question" />
                <CardBody>
                    <CustomInput
                        labelText="Question text"
                        id="question-text"
                        formControlProps={{
                            fullWidth: true
                        }}
                        value={question.text}
                        onChange={(e) => setText(e.target.value)}
                        error={text.length < 3}
                    />
                    <Typography>
                        Enabled
                    </Typography>
                    <Checkbox
                        checked={visibility}
                        onClick={() => setVisibility(!visibility)}
                        checkedIcon={<Check className={taskClasses.checkedIcon} />}
                        icon={<Check className={taskClasses.uncheckedIcon} />}
                        classes={{
                            checked: taskClasses.checked,
                            root: taskClasses.root
                        }}
                    />
                    <Typography>
                        Answers
                    </Typography>
                    <EditAnswers answers={answers} setAnswers={setAnswers} />
                    { answers.length < 3 && (
                        <Button onClick={() => setAnswers([...answers, {id: guid(), text: 'A new answer'}])}>Add answer</Button>
                    )}
                    <Typography>
                        Responses
                    </Typography>

                </CardBody>
                <CardFooter>
                    <Button>
                        Save
                    </Button>
                    <Button>
                        Delete
                    </Button>
                </CardFooter>
            </Card>
        </ContentContainer>
    )
}

export default () => {
    const questionId = useParams<{ id: string }>().id;
    const question = useSelector(state => state.games.polling.presenter.questions.find(q => q.id === questionId));

    return question ? (
        <QuestionEditor question={question} />
    ) : (
        <ContentContainer>
            <SnackbarContent
                message="No such question"
                color="danger"
            />
        </ContentContainer>
    );
}