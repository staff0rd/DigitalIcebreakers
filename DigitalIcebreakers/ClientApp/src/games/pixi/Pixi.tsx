import { Events } from '../../Events';
import * as PIXI from "pixi.js";
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface PixiProps {
    backgroundColor?: number;
    onAppChange: (app: PIXI.Application) => void;
}

export const Pixi: React.FC<PixiProps> = (props) => {
   
    const newPixi = () => {
        return new PIXI.Application({ autoResize: true, backgroundColor: props.backgroundColor || 0xFFFFFF })
    }

    const [app, setApp] = useState<PIXI.Application | null>(null);
    const pixiElement = useRef<HTMLDivElement>(null);
    
    const resize = useCallback((element: HTMLElement) => {
        app && app.renderer.resize(element.clientWidth, element.clientHeight);
    }, [app]);
    
    const onResize = useCallback(() => {
        if (app) {
            const parent = app.view.parentNode as HTMLElement;
            parent && resize(parent);
        }
    }, [resize, app]);

    useEffect(() => {
        const pixi = newPixi();
        setApp(pixi);
        props.onAppChange(pixi);
    }, [props.onAppChange])

    useEffect(() => {
        const element = pixiElement.current;
        if (element && app) {
            element.appendChild(app.view);
            resize(element);
            props.onAppChange(app);
        }  
    }, [app, pixiElement.current]);

    useEffect(() => {
        Events.add('onresize', 'pixi', onResize);
        return () => Events.remove('onresize', 'pixi');
    }, [onResize]);

    return <div className='main full-height' ref={pixiElement} />;
}