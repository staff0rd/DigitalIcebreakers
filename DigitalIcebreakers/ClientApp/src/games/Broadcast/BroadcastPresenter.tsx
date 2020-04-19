import React, {useState, useEffect, ChangeEvent} from 'react';
import { useDispatch } from 'react-redux';
import { setGameMessageCallback, clearGameMessageCallback } from '../../store/connection/actions';
import { adminMessage } from '../../store/lobby/actions';
import { GameMessage } from '../GameMessage';
import ContentContainer from '../../components/ContentContainer';
import { makeStyles, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    container: {
        textAlign: 'center',
        verticalAlign: 'middle',
    }
}));

export const BroadcastPresenter = () => {
    const classes = useStyles();
    const [dingCount, setDingCount] = useState<number>(0);
    const [clientText, setClientText] = useState<string>("");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setGameMessageCallback(({ payload }: GameMessage<string>) => {
            if (payload === "d") {
                setDingCount(dingCount+1);
            }
        }));
        return () => { dispatch(clearGameMessageCallback()); };
    });

    const updateClientText = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setClientText(target.value);
        dispatch(adminMessage(target.value));
    }

    return (
        <ContentContainer>
            <div className={classes.container}>
                <h1 style={{fontSize:"100px"}}>
                    Dings: {dingCount}
                </h1>
                <TextField
                
                    label="Broadcast this"
                    defaultValue="Default Value"
                    value={clientText}
                    onChange={updateClientText}
                    />
            </div>
        </ContentContainer>
    );
}