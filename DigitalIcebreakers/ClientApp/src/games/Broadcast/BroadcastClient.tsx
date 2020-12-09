import React, { useState, useEffect } from 'react';
import Button from '../../layout/components/CustomButtons/Button';
import { useDispatch } from 'react-redux';
import Notifications from "@material-ui/icons/Notifications";
import { setGameMessageCallback } from '../../store/connection/actions';
import { clientMessage } from '../../store/lobby/actions';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    wrapper: {
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    button: {
        height: 100,
        width: 150,
    },
}));

export const BroadcastClient = () => {
    const classes = useStyles();
    const [clientText, setClientText] = useState<string>("");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setGameMessageCallback(setClientText));
    }, [dispatch]);

    const ding = () => {
        dispatch(clientMessage(1));
    }

    return (
        <div className={classes.wrapper}>
            <h1 data-testid='client-text'>{clientText}</h1>
            <Button className={classes.button} color="primary" onClick={ding}>
                <Notifications />
            </Button>
        </div>
    );
}
