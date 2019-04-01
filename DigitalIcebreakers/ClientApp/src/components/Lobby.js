import React, { Component } from 'react';
import { Config } from '../config';
import { Row, Col, ListGroup, ListGroupItem  } from 'react-bootstrap';

export class Lobby extends Component {
    displayName = Lobby.name

    render() {
        const joinUrl = `${Config.baseUrl}/join/${this.props.id}`;
        const players = (this.props.players || []).map((p, ix) => <ListGroupItem key={ix}>{p.name}</ListGroupItem>);
        if (this.props.id)
            return (
                <div>
                    <h2>{this.props.name}</h2>

                    <Row>
                        <Col md={12}>
                            <a href={joinUrl}>{joinUrl}</a>
                            <h1>Players</h1>
                            <ListGroup>
                                {players}
                            </ListGroup>
                        </Col>
                    </Row>

                </div>
            ); else return (
                <div>
                    <h1>Digital Icebreakers</h1>
                    <h3><a href="mailto:stafford@atqu.in">stafford@atqu.in</a></h3>
                </div>
            );
    }
}
