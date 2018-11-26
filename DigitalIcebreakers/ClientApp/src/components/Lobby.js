import React, { Component } from 'react';
import { Config } from '../config';
import { Grid, Row, Col, ListGroup, ListGroupItem  } from 'react-bootstrap';
import { LobbyContext } from '../contexts/LobbyContext';


var QRCode = require('qrcode.react');


export class Lobby extends Component {
    displayName = Lobby.name

    render() {
        console.log(this.context);
        const joinUrl = `${Config.baseUrl}/join/${this.context.id}`;
        const players = this.context.players.map((p, ix) => <ListGroupItem key={ix}>{p.name}</ListGroupItem>);
        return (
            <div>
                <h2>{this.context.name}</h2>
                
                    <Row>
                        <Col md={4}>
                            <p>{joinUrl}</p>
                            <QRCode value={joinUrl} size={256} renderAs="svg" />
                        </Col>
                        <Col md={8}>
                            <h1>Players</h1>
                            <ListGroup>
                                {players}
                            </ListGroup>
                        </Col>
                    </Row>
                
            </div>
        );
    }
}

Lobby.contextType = LobbyContext;
