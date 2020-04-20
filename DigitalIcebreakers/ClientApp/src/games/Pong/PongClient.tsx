import React, { useState, useEffect } from 'react';
import { Button } from '../pixi/Button';
import { PongColors as Colors } from './PongColors'
import { Pixi } from '../pixi/Pixi';
import { useDispatch } from 'react-redux';
import { clientMessage } from '../../store/lobby/actions';
import { useResizeListener } from '../pixi/useResizeListener';
import { useSelector } from '../../store/useSelector';

export const PongClient = () =>  {
    const [app, setApp] = useState<PIXI.Application>();
    const teamColors = useSelector(state => state.games.pong.client); 
    const dispatch = useDispatch();
    
    const message = (action: string) => () => dispatch(clientMessage(action));

    const appHandler = (newApp?: PIXI.Application) => {
        if (newApp) {
            setApp(newApp);
        }
        resize();
    };

    useEffect(() => {
        dispatch(clientMessage("join"));
    }, [dispatch]);

    const resize = () => {
        if (app)
        {
            console.log('sizing buttons');
            app.stage.removeChildren();

            const topButton = new Button(message("release"), message("up"));
            const bottomButton = new Button(message("release"), message("down"));
            
            const width = app.screen.width / 2;

            topButton.x = app.screen.width / 4;
            topButton.y = app.screen.height / 8;
            topButton.render(teamColors.up, teamColors.down, 0, 0, width, app.screen.height / 16 * 5);
            
            bottomButton.x = app.screen.width / 4;
            bottomButton.y = app.screen.height / 16 * 9;
            bottomButton.render(teamColors.up, teamColors.down, 0, 0, width, app.screen.height / 16 * 5);
            
            app.stage.addChild(topButton, bottomButton);

            console.log('button width: ' + width);
        }
    }

    useEffect(resize, [app, teamColors])

    useResizeListener(resize);
    
    return (
        <Pixi backgroundColor={Colors.ClientBackground} onAppChange={appHandler}  />
    );
}
