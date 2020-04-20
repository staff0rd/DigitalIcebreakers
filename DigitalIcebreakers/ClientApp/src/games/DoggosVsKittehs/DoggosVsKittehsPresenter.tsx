import { Pixi } from '../pixi/Pixi';
import { Colors } from '../../Colors';
import { Graph } from '../pixi/Graph';
import React, { useState, useEffect } from 'react';
import { useResizeListener } from '../pixi/useResizeListener';
import { useSelector } from '../../store/useSelector';

export default () => {
    const [app, setApp] = useState<PIXI.Application>();

    let graph: Graph;
    
    const state = useSelector(state => state.games.doggosVsKittehs);

    const draw = () => {
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

    useEffect(() => draw(), [app, state]);

    useResizeListener(draw);

    return <Pixi onAppChange={(app) => setApp(app)} />
}
