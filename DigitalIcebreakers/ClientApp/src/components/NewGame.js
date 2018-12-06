import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem  } from 'react-bootstrap';
import Games from '../games/Games'

export class NewGame extends Component {
    displayName = NewGame.name

    newGame = (name) => {
        this.props.newGame(name);
    }

    getListItems(items) {
        return items.map((g,ix) => {
            return (
                <ListGroupItem key={ix} onClick={() => this.newGame(g.name)}>{g.title}</ListGroupItem>
            )
        });
    }

    render() {
        return (
            <div>
                <h2>New game</h2>
                
                    <Row>
                        <Col md={6}>
                            <h3>Games</h3>
                            <ListGroup>
                                {this.getListItems(Games(this.props).games)}
                            </ListGroup>
                        </Col>
                        <Col md={6}>
                            <h3>Apps</h3>
                            <ListGroup>
                                {this.getListItems(Games(this.props).apps)}
                            </ListGroup>
                        </Col>
                    </Row>
            </div>
        );
    }
}
