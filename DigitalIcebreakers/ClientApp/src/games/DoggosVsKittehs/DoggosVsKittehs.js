import React, { Component } from 'react';
import { Row, Col, ListGroup, ListGroupItem  } from 'react-bootstrap';
import doggo from './doggo.jpeg';
import kitteh from './kitteh.jpg';

export class DoggosVsKittehs extends Component {
    displayName = DoggosVsKittehs.name

    constructor(props, context) {
        super(props,context);
        this.choice = undefined;
        props.connection.on("gameUpdate", (result) => {
            console.log(result);
            this.setState({
                doggos: result.doggos,
                kittehs: result.kittehs,
                undecided: result.undecided
            });
        });
        console.log(props);
        this.state = {
            doggos: undefined,
            kittehs: undefined,
            undecided: undefined
        };
    }

    choose = (choice) => {
        if (choice !== this.choice) {
            this.choice = choice;
            console.log("congrats on making a choice");
            this.props.connection.invoke("gameMessage", choice);
        }
    }


    renderAdmin() {
        return (
            <div>
                <h2>Doggos vs Kittehs</h2>
                <Row>
                    <Col md={4}>
                        <h3>Doggos</h3>
                        {this.state.doggos}
                    </Col>
                    <Col md={4}>
                        <h3>Undecided</h3>
                        {this.state.undecided}
                    </Col>
                    <Col md={4}>
                        <h3>Kittehs</h3>
                        {this.state.kittehs}
                    </Col>
                </Row>
            </div>
        );
    }

    renderPlayer() {
        return (
            <div>
                <h2>Choose one</h2>
                <ListGroup>
                    <ListGroupItem onClick={() => this.choose("1")}>
                        <img src={kitteh} alt="kitteh" width={320} />
                    </ListGroupItem>
                    <ListGroupItem onClick={() => this.choose("0")}>
                        <img src={doggo} alt="doggo" width={320} />
                    </ListGroupItem>
                </ListGroup>
            </div>
        );
    }

    render() {
        return this.props.isAdmin ? this.renderAdmin() : this.renderPlayer();
    }
}
