import React from 'react';
import { Button  } from 'react-bootstrap';
import { BaseGame, BaseGameProps } from '../BaseGame';


interface YesNoMaybeState {
    choice: string | undefined;
}

export class YesNoMaybeClient extends BaseGame<BaseGameProps, YesNoMaybeState> {
    displayName = YesNoMaybeClient.name

    constructor(props: BaseGameProps) {
        super(props);

        this.state = {
            choice: undefined
        };
    }

    choose = (choice: string) => {
        this.setState({ choice: choice });
        this.clientMessage(choice);
    }

    render() {
        const style = { height: '100px', width: '300px' };
        return (
            <div>
                <br />
                <Button onClick={() => this.choose("0")} bsSize="large" style={style} active={this.state.choice === "0"}>
                    Yes
                </Button>
                <br />
                <br />
                <Button onClick={() => this.choose("1")} bsSize="large" style={style} active={this.state.choice === "1"}>
                    No
                </Button>
            </div>
        );
    }
}
