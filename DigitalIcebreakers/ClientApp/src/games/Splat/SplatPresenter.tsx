import React, { useState, useEffect } from 'react';
import { Colors, ColorUtils } from '../../Colors';
import { between } from '../../Random';
import { Pixi } from '../pixi/Pixi';
import { useSelector } from '../../store/useSelector';

export default () => {
    const [app, setApp] = useState<PIXI.Application>();

    const splats = useSelector(state => state.games.splat.count);

    const draw = () => {
        if (app) {
            while(app.stage.children.length < splats) {
                const x = between(0, app.screen.width);
                const y = between(0, app.screen.height);
                const circle = new PIXI.Graphics()
                    .beginFill(ColorUtils.randomColor().shades[4].shade)
                    .drawCircle(x, y, between(30, 100))
                    .endFill();
                app.stage.addChild(circle);
            }
        }
    }

    useEffect(() => draw(), [app, splats]);
    
    return (
        <Pixi backgroundColor={Colors.White} onAppChange={(app) => setApp(app)} />
    );
}