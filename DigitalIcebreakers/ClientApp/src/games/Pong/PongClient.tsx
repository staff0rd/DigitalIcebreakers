import React, { useState, useEffect } from 'react';
import { Button } from '../pixi/Button';
import { PongColors as Colors } from './PongColors'
import { Pixi } from '../pixi/Pixi';
import { useDispatch } from 'react-redux';
import { clientMessage } from '../../store/lobby/actions';
import { setGameUpdateCallback, clearGameUpdateCallback } from '../../store/connection/actions';

export const PongClient = () =>  {
    const [teamColor, setTeamColor] = useState<number>(0xFFFFFF);
    const [app, setApp] = useState<PIXI.Application>();
    const dispatch = useDispatch();
    
    const message = (action: string) => () => dispatch(clientMessage(action));

    const topButton = new Button(message("release"), message("up"));
    const bottomButton = new Button(message("release"), message("down"));

    const appHandler = (app: PIXI.Application) => {
        app.stage.addChild(topButton);
        app.stage.addChild(bottomButton);
        setApp(app);
    };

    useEffect(() => {
        dispatch(setGameUpdateCallback((response: string) => {
            const result = response.split(":");
            if (result[0] === "team") {
                switch(result[1]) {
                    case "0": setTeamColor(Colors.LeftPaddleUp); break;
                    case "1": setTeamColor(Colors.RightPaddleUp); break;
                    default: console.log(`Unexpected response: ${response}`);
                }
            } else {
                console.log(`Unexpected response: ${response}`)
            }
        }));
        dispatch(clientMessage("join"));
        return () => { dispatch(clearGameUpdateCallback()); };
    }, []);

    if (app) {
        topButton.x = app.renderer.width / 4;
        topButton.y = app.renderer.height / 8;
        topButton.render(teamColor, teamColor, 0, 0, app.renderer.width / 2, app.renderer.height / 16 * 5);

        bottomButton.x = app.renderer.width / 4;
        bottomButton.y = app.renderer.height / 16 * 9;
        bottomButton.render(teamColor, teamColor, 0, 0, app.renderer.width / 2, app.renderer.height / 16 * 5);
    }
    
    return (
        <Pixi backgroundColor={Colors.ClientBackground} onAppChange={appHandler}  />
    );
}
