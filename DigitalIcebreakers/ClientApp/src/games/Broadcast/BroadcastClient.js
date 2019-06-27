import React from 'react';
import { Button, Glyphicon  } from 'react-bootstrap';
import { BaseGame } from '../BaseGame';

export class BroadcastClient extends BaseGame {
    displayName = BroadcastClient.name

    constructor(props, context) {
        super(props, context);

        this.state = {
            value: undefined
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (result) => {
            console.log(result);
            this.setState({
                value: result
            }, this.init);
        });
    }

    ding = () => {
        this.clientMessage(1);      
    }

    render() {
        const style = { height: '100px', width: '150px' };
        return (
            <div className="vcenter">
                <div style={{textAlign: "center"}}>
                    <h1>{this.state.value}</h1>
                    <Button bsStyle="primary" bsSize="large" style={style} onClick={this.ding}>
                        <Glyphicon glyph="bell" />
                    </Button>
                </div>
            </div>
        );
    }
}
