import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem  } from 'react-bootstrap';

export class Game extends Component {
    displayName = Game.name

    newGame = (gameName) => {
        
        console.log(gameName);
    }

    render() {
        return (
            <div>
                
            </div>
        );
    }
}
