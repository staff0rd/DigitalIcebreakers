import React, { useState, useEffect } from 'react';
import { Button, Glyphicon  } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setGameUpdateCallback, clearGameUpdateCallback } from '../../store/connection/actions';
import { clientMessage } from '../../store/lobby/actions';

export const BroadcastClient = () => {
    const [clientText, setClientText] = useState<string>("");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setGameUpdateCallback(setClientText));
        return () => {
            dispatch(clearGameUpdateCallback());
        }
    }, [clientText, dispatch]);

    const ding = () => {
        dispatch(clientMessage(1));
    }

    return (
        <div className="vcenter">
            <div style={{textAlign: "center"}}>
                <h1>{clientText}</h1>
                <Button bsStyle="primary" bsSize="large" style={{ height: '100px', width: '150px' }} onClick={ding}>
                    <Glyphicon glyph="bell" />
                </Button>
            </div>
        </div>
    );
}
