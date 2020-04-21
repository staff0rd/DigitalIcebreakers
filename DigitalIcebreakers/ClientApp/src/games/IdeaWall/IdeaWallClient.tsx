import React, { useState } from 'react';
import { Button, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { clientMessage } from '../../store/lobby/actions';

const MAX_CHARACTERS = 50;

export const IdeaWallClient = () => {
    const [idea, setIdea] = useState<string>("");
    const dispatch = useDispatch();

    const onChange = (e: React.FormEvent<FormControl>) => {
        const target = e.target as HTMLInputElement;
        if (target.value.split('\n').length <= 4)
            setIdea(target.value);
    }

    const onClick = (e: React.SyntheticEvent<EventTarget>) => {
        if (idea.length) {
            dispatch(clientMessage(idea));
            setIdea("");
        }
    }

    const characters = idea.length;
    const style = characters >= MAX_CHARACTERS - 5 ? { color: "#D32F2F" } : {};
    return (
        <Form>
            <FormGroup>
                <ControlLabel>Your idea <span style={style}>({characters}/{MAX_CHARACTERS})</span></ControlLabel>
                <FormControl maxLength={MAX_CHARACTERS} componentClass="textarea" rows={3} onChange={onChange} value={idea} />
            </FormGroup>
            <Button onClick={onClick} bsStyle="primary" bsSize="large" style={{margin: "6px"}}>
                Submit
            </Button>
        </Form>
    );
}
