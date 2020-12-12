import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '../../../layout/components/CustomButtons/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CustomInput from 'layout/components/CustomInput/CustomInput';
import { useSelector } from 'store/useSelector';
import Alert from '@material-ui/lab/Alert';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

const useStyles = makeStyles((theme) => ({
    paper: {
        width: '50%',
    },
    instructions: {},
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

export const BulkEdit = (props: BulkEditProps) => {
    const classes = useStyles();
    const questionsFromState = useSelector(state => state.games.poll.presenter.questions.map(q => {
        const answers = q.answers.map(a => {
            if (a.correct)
                return `* ${a.text}`;
            return a.text;
        });
        return `- ${q.text}\n${answers.join('\n')}`;
    }).join('\n'));
    const [questions, setQuestions] = useState<string>(questionsFromState);
    const [error, setError] = useState<string>('');
    const {
        open,
        setOpen
    } = props;
    const handleOk =() => {
        setError(' an error ocurred');
    }
    const handleClose = () => {
        setOpen(false);
    }
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        setQuestions(target.value);
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
                <Alert severity='info' className={classes.instructions}>
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
                    value={questions}
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