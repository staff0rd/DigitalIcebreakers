import React from 'react';
import { ListGroup, ListGroupItem  } from 'react-bootstrap';
import doggo from './doggo.jpeg';
import kitteh from './kitteh.jpg';
import { BaseGame, BaseGameProps } from '../BaseGame'

interface DoggosVsKittehsState {
    choice: string | undefined;
}

export class DoggosVsKittehsClient extends BaseGame<BaseGameProps, DoggosVsKittehsState> {
    displayName = DoggosVsKittehsClient.name

    constructor(props: BaseGameProps) {
        super(props);
        
        this.state = {
            choice: undefined
        };
    }

    choose = (choice: string) => {
        if (choice !== this.state.choice) {
            this.setState({ choice: choice });
            this.props.connection.invoke("hubMessage", JSON.stringify({client: choice}));
        }
    }

    render() {
        return (
            <div>
                <h2>Choose one</h2>
                <ListGroup>
                    <ListGroupItem onClick={() => this.choose("1")} active={this.state.choice==="1"}>
                        <img src={kitteh} alt="kitteh" width={320} />
                    </ListGroupItem>
                    <ListGroupItem onClick={() => this.choose("0")} active={this.state.choice === "0"}>
                        <img src={doggo} alt="doggo" width={320} />
                    </ListGroupItem>
                </ListGroup>
            </div>
        );
    }
}
