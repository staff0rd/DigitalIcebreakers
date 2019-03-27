import React, { Fragment } from 'react';
import { Button, Navbar, FormGroup } from 'react-bootstrap';
import { PixiPresenter } from '../pixi/PixiPresenter';
import { Colors } from '../../Colors';
import { Graph } from '../pixi/Graph';

export class YesNoMaybePresenter extends PixiPresenter {
    displayName = YesNoMaybePresenter.name

    constructor(props, context) {
        super(0xFFFFFF, props,context);
        
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
        this.props.connection.invoke("gameMessage", "reset");
    }
}
