import React, { Component } from 'react';
import { Config } from '../config';
import { Row, Col, ListGroup, ListGroupItem  } from 'react-bootstrap';

var QRCode = require('qrcode.react');

export class Lobby extends Component {
    displayName = Lobby.name

    render() {
        const joinUrl = `${Config.baseUrl}/join/${this.props.id}`;
        const players = (this.props.players || []).map((p, ix) => <ListGroupItem key={ix}>{p.name}</ListGroupItem>);
        return (
            <div>
                <h2>{this.props.name}</h2>
                
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
