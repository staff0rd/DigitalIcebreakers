import React from 'react';
import { Button, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { BaseGame, BaseGameProps } from '../BaseGame';

const MAX_CHARACTERS = 50;

interface IdeaWallClientState {
    idea: string;
}

export class StartStopContinueClient extends BaseGame<BaseGameProps, IdeaWallClientState> {

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

    onClick = (lane: number) => {
        if (this.state.idea.length) {
            this.clientMessage({content: this.state.idea, lane: lane})
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
                <Button onClick={() => this.onClick(0)} bsStyle="primary" bsSize="large" style={{margin: "6px"}}>
                    Start
                </Button>
                <Button onClick={() => this.onClick(1)} bsStyle="primary" bsSize="large" style={{margin: "6px"}}>
                    Stop
                </Button>
                <Button onClick={() => this.onClick(2)} bsStyle="primary" bsSize="large" style={{margin: "6px"}}>
                    Continue
                </Button>
            </Form>
        );
    }
}
