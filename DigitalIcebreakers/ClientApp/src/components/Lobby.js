import React, { Component } from 'react';
import { Config } from '../config';
import { Row, Col, ListGroup, ListGroupItem  } from 'react-bootstrap';
import { Changelog } from './Changelog';

export class Lobby extends Component {
    displayName = Lobby.name

    render() {
        const joinUrl = `${Config.baseUrl}/join/${this.props.id}`;
        const players = (this.props.players || []).map((p, ix) => <ListGroupItem key={ix}>{p.name}</ListGroupItem>);
        if (this.props.id)
            return (
                <div>
                    <h1>{this.props.name}</h1>

                    <Row>
                        <Col md={12}>
                            <a href={joinUrl}>{joinUrl}</a>
                            <h2>Players</h2>
                            <ListGroup>
                                {players}
                            </ListGroup>
                        </Col>
                    </Row>

                </div>
            ); else return (
                <div>
                    <h1>Digital Icebreakers</h1>
                    <p>feature requests, suggestions, bugs & feedback to <a href="mailto:stafford@atqu.in">stafford@atqu.in</a></p>
                    <Changelog />
                </div>
            );
    }
}
