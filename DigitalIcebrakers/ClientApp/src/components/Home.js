import React, { Component } from 'react';
import { Config } from '../config';
import { Button } from 'react-bootstrap';
var QRCode = require('qrcode.react');

export class Home extends Component {
    static guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    displayName = Home.name

    constructor(props, context) {
        super(props, context);

        this.state = {
            currentGame: undefined
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.state.currentGame) {
            fetch(`api/Game/${this.state.currentGame}`, { method: 'delete' })
                .then(response => response.json())
                .then(() => {
                    this.setState({ currentGame: undefined });
                });
            this.setState({ currentGame: undefined });
        } else {
            const guid = Home.guid();
            fetch(`api/Game/${guid}`, { method: 'post' })
                .then(response => response.json())
                .then(data => {
                    this.setState({ currentGame: guid });
                });
        }
    }


    render() {
        const buttonText = this.state.currentGame ? "Stop game" : "New game";
        const gameUrl = `${Config.baseUrl}/${this.state.currentGame}`;
        const currentGame = this.state.currentGame ?
            <div>
                <p>{gameUrl}</p>
                <QRCode value="{gameUrl}" size="512" /> 
            </div>
            : "";
         
        return (
            <div>
                {currentGame}
                <div>
                    <Button bsStyle="primary" bsSize="large" onClick={this.handleClick}>
                        {buttonText}
                    </Button>
                </div>
          </div>
        );
  }
}
