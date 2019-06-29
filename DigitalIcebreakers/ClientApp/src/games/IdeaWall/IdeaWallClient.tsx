import React, { SyntheticEvent } from 'react';
import { Button, Form, FormGroup, ControlLabel, FormControl, FormControlProps } from 'react-bootstrap';
import { BaseGame, BaseGameProps } from '../BaseGame';

const MAX_CHARACTERS = 50;

interface IdeaWallClientState {
    idea: string;
}

export class IdeaWallClient extends BaseGame<BaseGameProps, IdeaWallClientState> {
    displayName = IdeaWallClient.name

    constructor(props: BaseGameProps, context: IdeaWallClientState) {
        super(props);

        this.state = {
            idea: ""
        };
    }

    onChange = (e: React.FormEvent<FormControl>) => {
        const target = e.target as HTMLInputElement;
        if (target.value.split('\n').length <= 4)
            this.setState({ idea: target.value });
    }

    onClick = (e: React.SyntheticEvent<EventTarget>) => {
        if (this.state.idea.length) {

            const payload = JSON.stringify({
                idea: this.state.idea
            });
            this.props.connection.invoke("hubMessage", payload);
            this.setState({idea: ""});
        }
    }

    render() {
        const characters = this.state.idea.length;
        const style = characters >= MAX_CHARACTERS - 5 ? { color: "#D32F2F" } : {};
        return (
            <Form>
                <FormGroup>
                    <ControlLabel>Your idea <span style={style}>({characters}/{MAX_CHARACTERS})</span></ControlLabel>
                    <FormControl maxLength={MAX_CHARACTERS} componentClass="textarea" rows={3} onChange={this.onChange} value={this.state.idea} />
                </FormGroup>
                <Button onClick={this.onClick} bsStyle="primary" bsSize="large" style={{margin: "6px"}}>
                    Submit
                </Button>
            </Form>
        );
    }
}
