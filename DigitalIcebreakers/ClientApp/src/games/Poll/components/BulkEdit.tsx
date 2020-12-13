import React, { useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '../../../layout/components/CustomButtons/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CustomInput from 'layout/components/CustomInput/CustomInput';
import { useSelector } from 'store/useSelector';
import Alert from '@material-ui/lab/Alert';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { useDispatch } from 'react-redux';
import { importQuestionsAction } from '../reducers/presenterReducer';
import { Question } from '../types/Question';
import { guid } from 'util/guid';
import { RootState } from 'store/RootState';
import { createSelector } from '@reduxjs/toolkit';

const useStyles = makeStyles((theme) => ({
    paper: {
        width: '50%',
        [theme.breakpoints.down('sm')]: {
            width: '90%',
        }
    },
    form: {
        marginTop: theme.spacing(2),
    },
    input: {
        fontFamily: 'monospace',
        lineHeight: 1,
    },
}));

type BulkEditProps = {
    open: boolean,
    setOpen: (open: boolean) => void,
};

export enum ErrorMessages {
    FIRST_LINE_SHOULD_BE_QUESTION = 'First line should be a question, starting with a dash',
    ONLY_ONE_ANSWER_PER_QUESTION = 'A question may have maximum one answer',
}

type ValidateResponse = {
    isValid: boolean,
    questions: Question[],
    errorMessage: string | undefined,
    errorLine: number | undefined,
};

export const validate = (questionsAndAnswers: string) : ValidateResponse => {
    let questions: Question[] = [];
    let errorMessage: string | undefined;
    let errorLine: number | undefined;
    
    const lines = questionsAndAnswers
        .split('\n')
        .map(line => line.trim()) 
        .filter(line => line); // remove empty lines

    for (let i = 0; i < lines.length; i ++) {
        const line = lines[i];
        if (line.startsWith('-')) {
            const trimmed = line.substr(1).trim();
            questions.push({
                answers: [],
                id: guid(),
                responses: [],
                text: trimmed,
            });
        } else if (i === 0) {
            errorLine = 1;
            errorMessage = ErrorMessages.FIRST_LINE_SHOULD_BE_QUESTION;
            console.log('returning')
            break;
        } else if (line.startsWith('*')) {
            const trimmed = line.substr(1).trim();
            const currentAnswers = questions[questions.length-1].answers;
            if (currentAnswers.find(a => a.correct)) {
                errorMessage = ErrorMessages.ONLY_ONE_ANSWER_PER_QUESTION;
                errorLine = i + 1;
                break;
            }
            currentAnswers.push({
                correct: true,
                id: guid(),
                text: trimmed,
            });
        } else {
            const trimmed = line.trim();
            questions[questions.length-1].answers.push({
                correct: false,
                id: guid(),
                text: trimmed,
            });
        }
    }

    return {
        isValid: errorMessage === undefined,
        questions,
        errorMessage,
        errorLine,
    }
};

const questionsForBulkEdit = createSelector(
    (state: RootState) =>  state.games.poll.presenter.questions,
    (questions) => questions.map(q => {
        const answers = q.answers.map(a => {
            if (a.correct)
                return `* ${a.text}`;
            return a.text;
        });
        return `- ${q.text}\n${answers.join('\n')}`; 
    }).join('\n')
);


export const BulkEdit = (props: BulkEditProps) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const questionsFromRedux = useSelector(questionsForBulkEdit);
    const [questionLines, setQuestionLines] = useState<string>(questionsFromRedux);
    useEffect(() => {
        setQuestionLines(questionsFromRedux);
    }, [questionsFromRedux])
    const [error, setError] = useState<string>('');
    const {
        open,
        setOpen
    } = props;
    const handleOk =() => {
        const {
            errorLine,
            errorMessage,
            isValid,
            questions
        } = validate(questionLines);
        if (isValid) {
            setError('');
            dispatch(importQuestionsAction(questions));
            setOpen(false);
        } else {
            setError(`Line ${errorLine}: ${errorMessage}`);
        }
    }
    const handleClose = () => {
        setOpen(false);
    }
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        setQuestionLines(target.value);
    }
    return (
        <Dialog
            PaperProps={{
                className:classes.paper
            }}
            open={open}
            onClose={handleClose}
        >
            <DialogContent>
                <Typography variant='h4'>Bulk edit</Typography>
                <Alert severity='info'>
                    <Typography variant='body2'>First line should be a question</Typography>
                    <Typography variant='body2'>- Questions start with a dash</Typography>
                    <Typography variant='body2'>* Correct answers start with an asterix (zero or one per question)</Typography>
                    <Typography variant='body2' color='primary'>Using bulk edit will clear audience responses</Typography>
                </Alert>
                <CustomInput
                    multiline
                    id='bulk-edit'
                    rows={10}
                    labelText='Questions &amp; answers'
                    error={error.length > 0}
                    className={classes.input}
                    formControlProps={{
                        className: classes.form,
                        fullWidth: true,
                    }}
                    value={questionLines}
                    onChange={onChange}
                />
                { error.length > 0 && (
                    <Alert severity='error'>{error}</Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button color='primary' onClick={handleOk}>Ok</Button>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
            
        </Dialog>
    )
}