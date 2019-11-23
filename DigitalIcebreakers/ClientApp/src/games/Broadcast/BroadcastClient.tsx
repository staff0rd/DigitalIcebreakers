import React, { useState, useEffect } from 'react';
import { Button, Glyphicon  } from 'react-bootstrap';
import { BaseGameProps } from '../BaseGame';

export const BroadcastClient : React.FC<BaseGameProps> = (props) => {
    const [clientText, setClientText] = useState<string>("");

    useEffect(() => {
        props.connection.on("gameUpdate", setClientText);

        return () => props.connection.off("gameUpdate");
    });

    const ding = () => {
        props.clientMessage(1);      
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
