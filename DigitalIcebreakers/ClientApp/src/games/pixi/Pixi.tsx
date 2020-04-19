import { Events } from '../../Events';
import * as PIXI from "pixi.js";
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { makeStyles } from "@material-ui/core/styles"
import { useResizeListener } from './useResizeListener';

interface PixiProps {
    backgroundColor?: number;
    onAppChange: (app?: PIXI.Application) => void;
}

const useStyles = makeStyles(theme => ({
    pixi: {
        width: '100%',
        height: '100%',
    },
}));

export const Pixi: React.FC<PixiProps> = (props) => {
    const classes = useStyles();
    const [app, setApp] = useState<PIXI.Application | null>(null);
    const pixiElement = useRef<HTMLDivElement>(null);
    
    const onResize = useCallback(() => {
        if (app && pixiElement.current) {
            const size = { width: pixiElement.current!.clientWidth, height: pixiElement.current!.clientHeight };
            app.renderer.resize(size.width, size.height);
            console.log(`resized pixi to ${size.width}x${size.height}`);
        } else {
            console.log('no app to resize');
        }
    },  [app]);

    useEffect(() => {
        const pixi = new PIXI.Application({ autoResize: true, backgroundColor: props.backgroundColor || 0xFFFFFF });
        setApp(pixi);
        props.onAppChange(pixi);
    }, [])

    useEffect(() => {
        const element = pixiElement.current;
        if (element && app) {
            element.appendChild(app.view);
            onResize();
        }  
    }, [app, pixiElement.current]);

    useResizeListener(onResize);

    return <div id="pixi-root" className={classes.pixi} ref={pixiElement} />;
}