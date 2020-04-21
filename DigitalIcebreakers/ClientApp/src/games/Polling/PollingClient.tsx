import React, { useState, useEffect } from 'react';
import { Button } from '../pixi/Button';
import { Pixi } from '../pixi/Pixi';
import { Colors } from '../../Colors'
import { useDispatch } from 'react-redux';
import { clientMessage } from '../../store/lobby/actions'
import { useResizeListener } from '../pixi/useResizeListener';

  
export default () => {
    const [pixi, setPixi] = useState<PIXI.Application>();
    const dispatch = useDispatch();
    const [button] = useState(new Button(() => dispatch(clientMessage("up")), () => dispatch(clientMessage("down"))));
    
    const resize = () => {
        if (pixi)
        {
            pixi.stage.addChild(button);
            button.x = pixi.screen.width / 4;
            button.y = pixi.screen.height / 4;
            button.render(Colors.Blue.C400, Colors.Red.C400, 0, 0, pixi.screen.width / 2, pixi.screen.height / 2);
        }
    }

    useResizeListener(resize);
    useEffect(resize, [pixi]);

    return (
        <Pixi backgroundColor={Colors.BlueGrey.C400} onAppChange={(app) => setPixi(app)} />
    );
}
