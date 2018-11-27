import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem  } from 'react-bootstrap';

export class NewGame extends Component {
    displayName = NewGame.name

    newGame = (gameName) => {
        console.log(gameName);
    }

    render() {
        return (
            <div>
                <h2>New game</h2>
                
                    <Row>
                        <Col md={6}>
                            <h3>Games</h3>
                            <ListGroup>
                                <ListGroupItem onClick={() => this.newGame("doggos-vs-kittehs")}>Doggos vs Kittehs</ListGroupItem>
                            </ListGroup>
                        </Col>
                        <Col md={6}>
                            <h3>Apps</h3>
                            <ListGroup>
                                <ListGroupItem onClick={() => this.newGame("yes-no-maybe")}>Yes, No, Maybe</ListGroupItem>
                            </ListGroup>
                        </Col>
                    </Row>
            </div>
        );
    }
}
