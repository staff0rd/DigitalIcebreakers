import { Pixi } from '../pixi/Pixi';
import { Colors } from '../../Colors';
import { Graph } from '../pixi/Graph';
import { BaseGameProps, BaseGame } from '../BaseGame';
import { YesNoMaybeState } from '../YesNoMaybe/YesNoMaybePresenter';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { setGameMessageCallback } from '../../store/connection/actions';
import { GameMessage } from '../GameMessage';

interface Payload {
    doggos: number;
    kittehs: number;
    undecided: number;
}

const connector = connect(
    null,
    { setGameMessageCallback }
);
  
type PropsFromRedux = ConnectedProps<typeof connector> & BaseGameProps;

class DoggosVsKittehsPresenter extends BaseGame<PropsFromRedux, YesNoMaybeState> {
    displayName = DoggosVsKittehsPresenter.name
    graph!: Graph;
    app?: PIXI.Application;
    
    constructor(props: PropsFromRedux) {
        super(props);
        this.state = {
            yes: 0,
            no: 0,
            maybe: 0
        };
    }

    init(app?: PIXI.Application) {
        this.app = app;
        var data = [
            {label: "Doggos", value: this.state.yes, color: Colors.Red.C500},
            {label: "Undecided", value: this.state.maybe, color: Colors.Grey.C500},
            {label: "Kittehs", value: this.state.no, color: Colors.Blue.C500}
        ]

        if (this.app)
            this.graph = new Graph(this.app, data);
    }

    componentDidMount() {
        this.props.setGameMessageCallback(({ payload }: GameMessage<Payload>) => {
            this.setState({
                yes: payload.doggos,
                no: payload.kittehs,
                maybe: payload.undecided
            }, () => this.init(this.app));
        });
    }

    render() {
        return <Pixi onAppChange={(app) => this.init(app)} />
    }
}

export default connector(DoggosVsKittehsPresenter);