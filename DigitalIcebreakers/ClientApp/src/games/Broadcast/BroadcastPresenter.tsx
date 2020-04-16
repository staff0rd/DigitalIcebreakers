import React, {useState, useEffect} from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setGameUpdateCallback, clearGameUpdateCallback } from '../../store/connection/actions';
import { adminMessage } from '../../store/lobby/actions';
import { GameUpdate } from '../GameUpdate';

export const BroadcastPresenter = () => {

    const [dingCount, setDingCount] = useState<number>(0);
    const [clientText, setClientText] = useState<string>("");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setGameUpdateCallback(({ payload }: GameUpdate<string>) => {
            if (payload === "d") {
                setDingCount(dingCount+1);
            }
        }));
        return () => { dispatch(clearGameUpdateCallback()); };
    });

    const updateClientText = (e: React.FormEvent<FormControl>) => {
        const target = e.target as HTMLInputElement;
        setClientText(target.value);
        dispatch(adminMessage(target.value));
    }

    return (
        <div className="vcenter">
            <div>
                <h1 style={{fontSize:"100px"}}>
                    Dings: {dingCount}
                </h1>
                <FormGroup>
                    <ControlLabel>Broadcast this</ControlLabel><br />
                    <FormControl type="text" value={clientText} onChange={updateClientText} />
                </FormGroup>
            </div>
        </div>
    );
}