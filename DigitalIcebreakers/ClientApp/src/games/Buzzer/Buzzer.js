import React, { Component } from 'react';
import { Button, ListGroup, ListGroupItem  } from 'react-bootstrap';

export class Buzzer extends Component {
    displayName = Buzzer.name

    constructor(props, context) {
        super(props,context);

        this.state = {
            players: []
        };

        this.props.connection.on("gameUpdate", (id, name, state) => {
            var user = {
                id: id,
                name: name,
                state: state
            };

            console.log(user);

            switch (state) {
                case "up": this.setState(prevState => { return { players: [...prevState.players.filter(p => p.id !== user.id), user] }; }); break;
                case "down": this.setState(prevState => { return { players: [user, ...prevState.players.filter(p => p.id !== user.id)] }; }); break;
                default: break;
            }
        });
    }

    down = () => {
        this.props.connection.invoke("gameMessage", "down");
    }

    up = () => {
        this.props.connection.invoke("gameMessage", "up");
    }

    renderAdmin() {
      
        const players = (this.state.players || []).map((p, ix) => {
            if (p.state === "down")
                return <ListGroupItem key={ix} active>{p.name}</ListGroupItem>;
            else
                return <ListGroupItem key={ix}>{p.name}</ListGroupItem>;
        });

        return (
            <div>
                <h2>Buzzer</h2>
                <ListGroup>
                    {players}
                </ListGroup>
            </div>
        );
    }

    renderPlayer() {
        return (
            <div>
                <br />
                <br />
                <br />
                <Button onPointerDown={() => this.down()} onPointerUp={() => this.up()} bsSize="large" touch-action="none">
                    Buzz
                </Button>
            </div>
        );
    }

    render() {
        return this.props.isAdmin ? this.renderAdmin() : this.renderPlayer();
    }
}
