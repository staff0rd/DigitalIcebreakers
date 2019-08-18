import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { BaseGame, BaseGameProps } from '../BaseGame';


interface SlideshowPresenterState {
    count: number;
    value: string;
}

export class SlideshowPresenter extends BaseGame<BaseGameProps, SlideshowPresenterState> {
    displayName = SlideshowPresenter.name

    constructor(props: BaseGameProps) {
        super(props);
        
        this.state = {
            count: 0,
            value: ""
        };
    }

    componentDidMount() {
        super.componentDidMount();
        // this.props.connection.on("gameUpdate", (result) => {
        //     if (result === "d") {
        //         this.setState(prevState => {
        //             return {count: prevState.count+1};
        //         });
        //     }
        // });
    }


    render() {
        return (
            <h2>Hi</h2>
        );
    }
}
