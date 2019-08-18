import React from 'react';
import { Button, Glyphicon  } from 'react-bootstrap';
import { BaseGame, BaseGameProps } from '../BaseGame';

interface SlideshowClientState {
    value: string;
}

export class SlideshowClient extends BaseGame<BaseGameProps, SlideshowClientState>  {
    displayName = SlideshowClient.name

    constructor(props: BaseGameProps) {
        super(props);

        this.state = {
            value: ""
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (result) => {
            console.log(result);
            this.setState({
                value: result
            });
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
