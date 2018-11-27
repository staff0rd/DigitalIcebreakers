import React, { Component } from 'react';
import { ListGroup, ListGroupItem  } from 'react-bootstrap';
import doggo from './doggo.jpeg';
import kitteh from './kitteh.jpg';

export class DoggosVsKittehs extends Component {
    displayName = DoggosVsKittehs.name

    constructor(props, context) {
        super(props,context);
        this.choice = undefined;
        console.log(props);
    }

    choose = (choice) => {
        if (choice !== this.choice) {
            console.log("chose", choice);
            this.choice = choice;
        }
    }

    render() {
        return (
            <div>
                <h2>Choose one</h2>
                <ListGroup>
                    <ListGroupItem onClick={() => this.choose("kitteh")}>
                        <img src={kitteh} alt="kitteh" width={320} />
                    </ListGroupItem>
                    <ListGroupItem onClick={() => this.choose("doggo")}>
                        <img src={doggo} alt="doggo" width={320} />
                    </ListGroupItem>
                </ListGroup>
            </div>
        );
    }
}
