import { Pixi } from '../pixi/Pixi';
import { Colors } from '../../Colors';
import { Graph } from '../pixi/Graph';
import React, { useState, useEffect } from 'react';
import { setGameMessageCallback } from '../../store/connection/actions';
import { GameMessage } from '../GameMessage';
import { useDispatch } from 'react-redux';
import { useResizeListener } from '../pixi/useResizeListener';

interface Payload {
    doggos: number;
    kittehs: number;
    undecided: number;
}

export default () => {
    const dispatch = useDispatch();
    const [app, setApp] = useState<PIXI.Application>();
    let graph: Graph;
    
    const [state, setState] = useState({
        yes: 0,
        no: 0,
        maybe: 0
    });

    const resize = () => {
        if (app) {
            var data = [
                {label: "Doggos", value: state.yes, color: Colors.Red.C500},
                {label: "Undecided", value: state.maybe, color: Colors.Grey.C500},
                {label: "Kittehs", value: state.no, color: Colors.Blue.C500}
            ]
            app.stage.removeChildren();
            console.log('set new graph');
            graph = new Graph(app, data);
        } else {
            console.log('no app');
        }
    }

    useEffect(() => resize(), [app, state]);

    useResizeListener(resize);

    const init = (newApp?: PIXI.Application) => {
        console.log('app init');
        if (newApp) {
            setApp(newApp);
            resize();
        }
    }

    useEffect(() => {
        dispatch(setGameMessageCallback(({ payload }: GameMessage<Payload>) => {
            setState({
                yes: payload.doggos,
                no: payload.kittehs,
                maybe: payload.undecided
            });
            init();
        }));
    }, []);

    return <Pixi onAppChange={(app) => init(app)} />
}
