import React, { useState } from 'react';
import Button from '../../layout/components/CustomButtons/Button';
import { clientMessage } from '../../store/lobby/actions';
import { makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
  
const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    button: {
        height: 100,
        width: 300,
        fontSize: 20,
    },
}));

export default () => {
    const [choice, setChoice] = useState(""); 
    const dispatch = useDispatch();
    const classes = useStyles();

    const choose = (newChoice: string) => {
        setChoice(newChoice);
        dispatch(clientMessage(newChoice));
    }

    return (
        <div className={classes.container}>
            <Button className={classes.button} onClick={() => choose("0")}>
                Yes
            </Button>
            <Button className={classes.button} onClick={() => choose("1")}>
                No
            </Button>
        </div>
    );
}
