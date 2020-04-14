import React, { Fragment } from 'react';
import { Button, Navbar, FormGroup } from 'react-bootstrap';
import { PixiView } from '../pixi/PixiView';
import { Colors } from '../../Colors';
import { Graph } from '../pixi/Graph';
import { BaseGameProps } from '../BaseGame';

export interface YesNoMaybeState {
    yes: number;
    no: number;
    maybe: number;
}

export class YesNoMaybePresenter extends PixiView<BaseGameProps, YesNoMaybeState> {
    displayName = YesNoMaybePresenter.name
    graph!: Graph;

    constructor(props: BaseGameProps) {
        super(0xFFFFFF, props);
        
        this.state = {
            yes: 0,
            no: 0,
            maybe: 0
        };

        this.init();
    }

    init() {
        var data = [
            {label: "Yes", value: this.state.yes, color: Colors.Red.C500},
            {label: "No", value: this.state.no, color: Colors.Blue.C500},
            {label: "Maybe", value: this.state.maybe, color: Colors.Grey.C500}
        ]

        this.graph = new Graph(this.app, data);

        this.setMenuItems();
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
            }, this.init);
        });
    }

    reset = () => {
        this.adminMessage("reset");
    }
}
