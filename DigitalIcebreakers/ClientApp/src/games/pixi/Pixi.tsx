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
        [theme.breakpoints.down("sm")]: {
            '& canvas': {
                marginTop: -50,
            },
        }
    },
}));

export const Pixi: React.FC<PixiProps> = (props) => {
    const classes = useStyles();
    const newPixi = () => {
        return new PIXI.Application({ autoResize: true, backgroundColor: props.backgroundColor || 0xFFFFFF })
    }

    const [app, setApp] = useState<PIXI.Application | null>(null);
    const pixiElement = useRef<HTMLDivElement>(null);
    
    const onResize = useCallback(() => {
        console.log('resize');
        if (app && pixiElement.current) {
            const size = { width: pixiElement.current!.clientWidth, height: pixiElement.current!.clientHeight };
            app.renderer.resize(size.width, size.height);
            console.log('resized', size);
        } else {
            console.log('no app to resize');
        }
        props.onAppChange();
    },  [app]);

    useEffect(() => {
        const pixi = newPixi();
        setApp(pixi);
    }, [])

    useEffect(() => {
        const element = pixiElement.current;
        if (element && app) {
            element.appendChild(app.view);
            onResize();
            props.onAppChange(app);
        }  
    }, [app, pixiElement.current]);

    useResizeListener(onResize);

    return <div id="pixi-root" className={classes.pixi} ref={pixiElement} />;
}