import React, { useState } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { createLobby } from '../store/lobby/actions';

export const CreateLobby = () => {
    const [lobbyName, setLobbyName] = useState<string>("My Lobby");
    const dispatch = useDispatch();
    const validate = () => {
        const length = lobbyName.length;
        if (length > 2) return 'success';
        else if (length > 0) return 'error';
        return null;
    }

    const handleChange = (e: React.FormEvent<FormControl>) => {
        const target = e.target as HTMLInputElement;
        setLobbyName(target.value);
    }

    const onSubmit = (e:any) => {
        if (validate() === "success") {
            dispatch(createLobby(lobbyName));
        }      
        e.preventDefault();
    }

    return (
        <div>
            <h2>Create lobby</h2>
            <form onSubmit={onSubmit}>
                <FormGroup
                    controlId="formBasicText"
                    validationState={validate()}
                >
                    <ControlLabel>Give this lobby a name</ControlLabel>
                    <FormControl
                        type="text"
                        placeholder="Enter text"
                        name="name"
                        value={lobbyName}
                        onChange={handleChange}
                    />
                    <FormControl.Feedback />
                    <HelpBlock>You must enter a lobby name.</HelpBlock>
                </FormGroup>
                <Button bsStyle="primary" bsSize="large" onClick={onSubmit}>
                    Create
                </Button>
            </form>
        </div>
    );
}
