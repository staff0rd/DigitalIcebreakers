import React, { Component } from 'react';
import { Config } from '../config';
import { Button, Grid, Row, Col, ListGroup, ListGroupItem  } from 'react-bootstrap';
import { HubConnectionBuilder } from '@aspnet/signalr';
var QRCode = require('qrcode.react');

export class Home extends Component {


    displayName = Home.name

    constructor(props, context) {
        super(props, context);

        this.state = {
            currentGame: undefined,
            players: []
        };

        this.handleClick = this.handleClick.bind(this);

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

    handleClick() {
        if (this.state.currentGame) {
            this.connection.invoke("stopgame")
                .then(() => {
                    this.setState({ currentGame: undefined, players: [] });
                });
        } else {
            const guid = Home.guid();
            this.connection.invoke("startgame", guid)
                .then(() => {
                    this.setState({ currentGame: guid });
                });
        }
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
        const buttonText = this.state.currentGame ? "Stop game" : "New game";
        
        const currentGame = this.state.currentGame ?
            this.renderGame()
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
