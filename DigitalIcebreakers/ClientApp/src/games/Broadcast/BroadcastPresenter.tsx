import React, {useState, useEffect} from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { BaseGameProps } from '../BaseGame';

export const BroadcastPresenter: React.FC<BaseGameProps> = (props) => {

    const [dingCount, setDingCount] = useState<number>(0);
    const [clientText, setClientText] = useState<string>("");

    useEffect(() => {
        props.connection.on("gameUpdate", (result) => {
            if (result === "d") {
                setDingCount(dingCount+1);
            }
        });
        return () => props.connection.off("gameUpdate");
    });

    const updateClientText = (e: React.FormEvent<FormControl>) => {
        const target = e.target as HTMLInputElement;
        setClientText(target.value);
        props.signalR.adminMessage(clientText);
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