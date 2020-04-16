import React from 'react';
import { Button  } from 'react-bootstrap';
import { BaseGame, BaseGameProps } from '../BaseGame';
import { ConnectedProps, connect } from 'react-redux';
import { clientMessage } from '../../store/lobby/actions';

const connector = connect(
    null,
    { clientMessage }
);
  
type PropsFromRedux = ConnectedProps<typeof connector> & BaseGameProps;

interface YesNoMaybeState {
    choice: string | undefined;
}

class YesNoMaybeClient extends BaseGame<PropsFromRedux, YesNoMaybeState> {
    displayName = YesNoMaybeClient.name

    constructor(props: PropsFromRedux) {
        super(props);

        this.state = {
            choice: undefined
        };
    }

    choose = (choice: string) => {
        this.setState({ choice: choice });
        this.props.clientMessage(choice);
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

export default connector(YesNoMaybeClient);
