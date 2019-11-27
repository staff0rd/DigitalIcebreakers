import React, { Fragment } from 'react';
import { Button, Navbar, FormGroup } from 'react-bootstrap';
import { Colors } from '../../Colors';
import { Graph } from '../pixi/Graph';
import { BaseGameProps, BaseGame } from '../BaseGame';
import { Pixi } from '../pixi/Pixi';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../store/RootState';
import { adminMessage } from '../../store/lobby/actions';

export interface YesNoMaybeState {
    yes: number;
    no: number;
    maybe: number;
}
    
const connector = connect(
    null,
    { adminMessage }
);
  
type PropsFromRedux = ConnectedProps<typeof connector>
  
export class YesNoMaybePresenter extends BaseGame<BaseGameProps & PropsFromRedux, YesNoMaybeState> {
    displayName = YesNoMaybePresenter.name
    graph!: Graph;
    app?: PIXI.Application;

    constructor(props: BaseGameProps & PropsFromRedux) {
        super(props);
        
        this.state = {
            yes: 0,
            no: 0,
            maybe: 0
        };
    }

    init(app?: PIXI.Application) {
        this.app = app || this.app;
        var data = [
            {label: "Yes", value: this.state.yes, color: Colors.Red.C500},
            {label: "No", value: this.state.no, color: Colors.Blue.C500},
            {label: "Maybe", value: this.state.maybe, color: Colors.Grey.C500}
        ]
        this.setMenuItems();
        if (this.app)
            this.graph = new Graph(this.app, data);
    }

    setMenuItems() {
        const header = (
            <Fragment>
                <Navbar.Form>
                    <FormGroup>
                        <Button bsStyle="primary" onClick={this.reset}>Reset</Button>
                    </FormGroup>
                </Navbar.Form>
            </Fragment>
        );

        this.props.setMenuItems([header]);
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (result) => {
            this.setState({
                yes: result.yes,
                no: result.no,
                maybe: result.maybe
            }, () => this.init(this.app));
        });
    }

    reset = () => {
        this.props.adminMessage("reset");
    }

    render() {
        return <Pixi backgroundColor={0xFFFFFF} onAppChange={this.init} />
    }
}
