import { Pixi } from '../pixi/Pixi';
import { Colors } from '../../Colors';
import { Graph } from '../pixi/Graph';
import { BaseGameProps, BaseGame } from '../BaseGame';
import { YesNoMaybeState } from '../YesNoMaybe/YesNoMaybePresenter';
import React from 'react';

export class DoggosVsKittehsPresenter extends BaseGame<BaseGameProps, YesNoMaybeState> {
    displayName = DoggosVsKittehsPresenter.name
    graph!: Graph;
    app?: PIXI.Application;
    
    constructor(props: BaseGameProps) {
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
        this.props.connection.on("gameUpdate", (result) => {
            this.setState({
                yes: result.doggos,
                no: result.kittehs,
                maybe: result.undecided
            }, () => this.init(this.app));
        });
    }

    render() {
        return <Pixi onAppChange={this.init} />
    }
}
