import React, { useState, useEffect } from 'react';
import { Button } from '../pixi/Button';
import { PongColors as Colors } from './PongColors'
import { Pixi } from '../pixi/Pixi';
import { useDispatch } from 'react-redux';
import { clientMessage } from '../../store/lobby/actions';
import { setGameUpdateCallback, clearGameUpdateCallback } from '../../store/connection/actions';

interface TeamColors {
    up: number,
    down: number
}

export const PongClient = () =>  {
    const [teamColors, setTeamColors] = useState<TeamColors>({up: 0xFFFFFF, down: 0xFFFFFF});
    const [app, setApp] = useState<PIXI.Application>();
    const dispatch = useDispatch();
    
    const message = (action: string) => () => dispatch(clientMessage(action));

    const topButton = new Button(message("release"), message("up"));
    const bottomButton = new Button(message("release"), message("down"));

    const appHandler = (app: PIXI.Application) => {
        setApp(app);
    };

    useEffect(() => {
        dispatch(setGameUpdateCallback((response: string) => {
            const result = response.split(":");
            if (result[0] === "team") {
                switch(result[1]) {
                    case "0": setTeamColors({ up: Colors.LeftPaddleUp, down: Colors.LeftPaddleDown }); break;
                    case "1": setTeamColors({ up: Colors.RightPaddleUp, down: Colors.RightPaddleDown }); break;
                    default: console.log(`Unexpected response: ${response}`);
                }
            } else {
                console.log(`Unexpected response: ${response}`)
            }
        }));
        dispatch(clientMessage("join"));
        return () => { dispatch(clearGameUpdateCallback()); };
    }, [dispatch]);

    if (app) {
        topButton.x = app.renderer.width / 4;
        topButton.y = app.renderer.height / 8;
        topButton.render(teamColors.up, teamColors.down, 0, 0, app.renderer.width / 2, app.renderer.height / 16 * 5);
        
        bottomButton.x = app.renderer.width / 4;
        bottomButton.y = app.renderer.height / 16 * 9;
        bottomButton.render(teamColors.up, teamColors.down, 0, 0, app.renderer.width / 2, app.renderer.height / 16 * 5);
        
        app.stage.addChild(topButton, bottomButton);
    }

    
    return (
        <Pixi backgroundColor={Colors.ClientBackground} onAppChange={appHandler}  />
    );
}
