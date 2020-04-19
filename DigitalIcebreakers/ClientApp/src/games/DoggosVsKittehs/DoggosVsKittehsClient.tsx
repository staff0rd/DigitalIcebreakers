import React, { useState } from 'react';
import doggo from './doggo.jpeg';
import kitteh from './kitteh.jpg';
import { clientMessage } from '../../store/lobby/actions';
import { useDispatch } from 'react-redux';
import { List, ListItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
    },
    header: {
        margin: 0,
    },
    item: {
        width: 300,
        height: 200,
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
            <h2 className={classes.header}>Choose one</h2>
            <List>
                <ListItem
                    className={classes.item}
                    onClick={() => choose("1")}
                    selected={choice==="1"}
                    style={{
                        background: `url(${kitteh}) no-repeat`,
                        backgroundSize: 'contain',
                        backgroundOrigin: 'content-box',
                        border: `${choice === '1' ? 3 : 0}px solid`,
                    }}
                >
                </ListItem>
                <ListItem
                    className={classes.item}
                    onClick={() => choose("0")}
                    selected={choice==="0"}
                    style={{
                        background: `url(${doggo}) no-repeat`,
                        backgroundSize: 'contain',
                        backgroundOrigin: 'content-box',
                        border: `${choice === '0' ? 3 : 0}px solid`,
                    }}
                >
                </ListItem>
            </List>
        </div>
    );
    
}