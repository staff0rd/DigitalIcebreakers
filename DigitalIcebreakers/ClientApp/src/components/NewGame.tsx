import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem  } from 'react-bootstrap';
import Games, { IGame } from '../games/Games';


interface NewGameProps {
    newGame: (name: string) => void;
}

export class NewGame extends Component<NewGameProps> {
    displayName = NewGame.name

    newGame = (name: string) => {
        this.props.newGame(name);
    }

    getListItems(items: IGame[]) {
        return items
            .filter((g: IGame) => !g.disabled)
            .map((g,ix) => {
            return (
                <ListGroupItem key={ix} onClick={() => this.newGame(g.name)}>{g.title}</ListGroupItem>
            );
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
                                {this.getListItems(Games(this.props).filter(g => g.isGame))}
                            </ListGroup>
                        </Col>
                        <Col md={6}>
                            <h3>Apps</h3>
                            <ListGroup>
                                {this.getListItems(Games(this.props).filter(g => !g.isGame))}
                            </ListGroup>
                        </Col>
                    </Row>
            </div>
        );
    }
}
