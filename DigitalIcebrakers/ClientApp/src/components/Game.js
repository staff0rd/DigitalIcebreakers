import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

export class Game extends Component {
    displayName = Game.name

    constructor(props) {
        super(props);
        this.state = { name: '' };
        this.join = this.join.bind(this);
    }

    join() {
        //this.setState({
        //    currentCount: this.state.currentCount + 1
        //});
    }

    getValidationState() {
        const length = this.state.value.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    render() {
        return (
            <div>
                <form>
                    <FormGroup
                        controlId="formBasicText"
                        validationState={this.getValidationState()}
                    >
                        <ControlLabel>Working example with validation</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.value}
                            placeholder="Enter text"
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>You must enter a name before you can join.</HelpBlock>
                    </FormGroup>
                </form>
            </div>
        );
    }
}
