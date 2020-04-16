import React from 'react';
import { BaseGame, BaseGameProps } from '../BaseGame'
import { connect, ConnectedProps } from 'react-redux';
import { setGameUpdateCallback } from '../../store/connection/actions';
import { Colors, ColorUtils } from '../../Colors';
import { between } from '../../Random';
import { Pixi } from '../pixi/Pixi';

const connector = connect(
    null,
    { setGameUpdateCallback }
);
  
type PropsFromRedux = ConnectedProps<typeof connector> & BaseGameProps;

class SplatPresenter extends BaseGame<PropsFromRedux, {}> {
    app?: PIXI.Application;
    constructor(props: PropsFromRedux) {
        super(props);

        this.state = {
            players: []
        };
    }

    init(app: PIXI.Application) {
        this.app = app;
    }

    componentDidMount() {
        this.props.setGameUpdateCallback((id: string, name:string , state: string) => {
            this.setState(prevState => {
                switch (state) {
                    case "down": {
                        const x = between(0, this.app!.screen.width);
                        const y = between(0, this.app!.screen.height);
                        const circle = new PIXI.Graphics()
                            .beginFill(ColorUtils.randomColor().shades[4].shade)
                            .drawCircle(x, y, between(30, 100))
                            .endFill();
                        this.app!.stage.addChild(circle);
                    }
                }
            });
        });
    }

    render() {
        return (
            <Pixi backgroundColor={Colors.White} onAppChange={(app) => this.init(app)} />
        );
    }
}

export default connector(SplatPresenter);