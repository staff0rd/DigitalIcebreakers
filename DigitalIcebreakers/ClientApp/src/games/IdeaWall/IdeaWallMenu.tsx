import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { useSelector } from '../../store/useSelector';
import ListItem from "@material-ui/core/ListItem";
import Button from "../../layout/components/CustomButtons/Button";
import { clearIdeasAction, arrangeIdeasAction, toggleNamesAction} from './IdeaWallReducer';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    modalContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '5px',
        padding: 20,
    },
}));

export default () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [action, setAction] = useState<any>();
    
    const handleClose = () => {
        setOpen(false);
    }

    const ok = () => {
        dispatch(action);
        setOpen(false);
    }

    const confirmClear = () => {
        setTitle("Clear all ideas?");
        setBody("All ideas will be removed!");
        setAction(clearIdeasAction());
        setOpen(true);
    }

    const confirmArrange = () => {
        setTitle("Arrange ideas?");
        setBody("This will re-arrange all ideas");
        setAction(arrangeIdeasAction(true));
        setOpen(true);
    }

    return (
        <>
            <ListItem>
                <Button onClick={() => dispatch(toggleNamesAction())}>Toggle Names</Button>
            </ListItem>
            <ListItem>
                <Button onClick={() => confirmArrange()}>Arrange</Button>
            </ListItem>
            <ListItem>
                <Button onClick={() => confirmClear()}>Clear</Button> 
            </ListItem>
            <Modal
                className={classes.modalContainer}
                open={open}
                onClose={handleClose}
            >
                    <div className={classes.modal}>
                        <h3>{title}</h3>
                        <p>{body}</p>
                        <Button color='primary' onClick={() => ok()}>Ok</Button>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                    </div>
            </Modal>
        </>
    );
}
