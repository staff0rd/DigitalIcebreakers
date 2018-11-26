import React, { Component } from 'react';
import { Config } from '../config';
import { Button, Grid, Row, Col, ListGroup, ListGroupItem  } from 'react-bootstrap';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { LobbyContext } from '../contexts/LobbyContext';


var QRCode = require('qrcode.react');


export class Lobby extends Component {


    displayName = Lobby.name

    constructor(props, context) {
        super(props, context);
        this.state = {
            currentGame: undefined,
            players: []
        };

        this.connection = new HubConnectionBuilder().withUrl("/gameHub").build();
        const component = this;
        this.connection.on("Joined", (user, count) => {
            component.state.players.push(user);
            component.setState({ players: component.state.players });
            console.log('join', user, count);
        });
        this.connection.on("left", (user, count) => {
            var players = component.state.players.filter(p => p.id !== user.id);
            component.setState({ players: players });

            console.log('left', user, count);
        });

        this.connection.start().catch((err) => {
            return console.error(err.toString());
        });
    }

    renderGame() {
        const gameUrl = `${Config.baseUrl}/game/${this.state.currentGame}`;
        const players = this.state.players.map((p, ix) => <ListGroupItem key={ix}>{p.name}</ListGroupItem>);

        return (
            <Grid>
                <Row>
                    <Col md={4}>
                        <p>{gameUrl}</p>
                        <QRCode value={gameUrl} size={256} renderAs="svg" />
                    </Col>
                    <Col md={8}>
                        <h1>Players</h1>
                        <ListGroup>
                            {players}
                        </ListGroup>
                    </Col>
                </Row>
            </Grid>
        );
    }


    render() {
        console.log(this.context);
        const buttonText = this.state.currentGame ? "Stop game" : "New game";
        
        const currentGame = this.state.currentGame ?
            this.renderGame()
            : "";
         
        return (
            <div>
                <h2>{this.context.name}</h2>
                {currentGame}
                <div>
                    <Button bsStyle="primary" bsSize="large">
                        {buttonText}
                    </Button>
                </div>
          </div>
        );
  }
}

Lobby.contextType = LobbyContext;
