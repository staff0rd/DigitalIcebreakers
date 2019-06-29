import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { BaseGame, BaseGameProps } from '../BaseGame'

interface Player {
    id: string;
    name: string;
    state: string;
}

interface BuzzerState {
    players: Player[];
}

export class BuzzerPresenter extends BaseGame<BaseGameProps, BuzzerState> {
    constructor(props: BaseGameProps) {
        super(props);

        this.state = {
            players: []
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (id, name, state) => {
            var user = {
                id: id,
                name: name,
                state: state
            };

            this.setState(prevState => {
                const players = prevState.players.map((p: Player) => p);
                if (!players.filter((p:Player) => p.id === user.id).length) {
                    players.push(user);
                }
                players.forEach((p: Player) => {
                    if (p.id === user.id)
                        p.state = user.state;
                });
                return { players: players };
            });
        });
    }

    render() {
      
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
}
