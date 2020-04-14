import React from 'react';
import { BaseGameProps } from '../BaseGame'
import { PixiView } from '../pixi/PixiView';
import { Colors, ColorUtils } from '../../Colors';
import { between } from '../../Random';

export class SplatPresenter extends PixiView<BaseGameProps, {}> {
    constructor(props: BaseGameProps) {
        super(Colors.White, props);

        this.state = {
            players: []
        };
    }

    init() { }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (id, name, state) => {
            this.setState(prevState => {
                switch (state) {
                    case "down": {
                        const x = between(0, this.app.screen.width);
                        const y = between(0, this.app.screen.height);
                        const circle = new PIXI.Graphics()
                            .beginFill(ColorUtils.randomColor().shades[4].shade)
                            .drawCircle(x, y, between(30, 100))
                            .endFill();
                        this.app.stage.addChild(circle);
                    }
                }
            });
        });
    }
}
