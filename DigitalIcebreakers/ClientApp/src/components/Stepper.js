import React, { Component } from 'react';
import {FormGroup, FormControl, Button, ControlLabel } from "react-bootstrap";
import './Stepper.css'

export class Stepper extends Component {
    displayName = Stepper.name

    increaseValue = () => {
        this.props.onChange(parseInt(this.props.value, 10) + this.props.step);
    }

    decreaseValue = () => {
        this.props.onChange(this.props.value - this.props.step);
    }

    updateValue = (e) => {
        this.props.onChange(e.target.value);
    }

    render() {
        return (
            <FormGroup>
                <ControlLabel>{this.props.label}</ControlLabel><br />
                <Button bsStyle="primary" onClick={this.decreaseValue}>&lt;</Button>
                {' '}<FormControl className="stepper" type="number" placeholder={this.props.label} value={this.props.value} onChange={this.updateValue} />{' '}
                <Button bsStyle="primary" onClick={this.increaseValue}>&gt;</Button>
            </FormGroup>
        )
    }
}