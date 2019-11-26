import React from 'react';
import { Row, Col, ListGroup, ListGroupItem  } from 'react-bootstrap';
import Games, { IGame } from '../games/Games';
import { startNewGame } from '../store/lobby/actions';
import { useDispatch } from 'react-redux';

export const NewGame = () => {
    const dispatch = useDispatch();
    
    const newGame = (name: string) => {
        dispatch(startNewGame(name));
    }

    const getListItems = (items: IGame[]) => {
        return items
            .filter((g: IGame) => !g.disabled)
            .map((g,ix) => {
            return (
                <ListGroupItem key={ix} onClick={() => newGame(g.name)}>{g.title}</ListGroupItem>
            );
        });
    };

    return (
        <div>
            <h2>New game</h2>
                <Row>
                    <Col md={6}>
                        <h3>Games</h3>
                        <ListGroup>
                            {getListItems(Games().filter(g => g.isGame))}
                        </ListGroup>
                    </Col>
                    <Col md={6}>
                        <h3>Apps</h3>
                        <ListGroup>
                            {getListItems(Games().filter(g => !g.isGame))}
                        </ListGroup>
                    </Col>
                </Row>
        </div>
    );
}
