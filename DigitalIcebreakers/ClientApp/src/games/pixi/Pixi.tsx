import { Events } from '../../Events';
import * as PIXI from "pixi.js";
import React, { useRef, useEffect } from 'react';

interface PixiProps {
    backgroundColor?: number;
    onAppChange: (app: PIXI.Application) => void;
}

export const Pixi: React.FC<PixiProps> = (props) => {
    let app: PIXI.Application;
    const pixiElement = useRef<HTMLDivElement>(null);

    const resize = () => {
        const parent = app.view.parentNode as HTMLElement;
        parent && app.renderer.resize(parent.clientWidth, parent.clientHeight);
    }

    useEffect(() => {
        app = new PIXI.Application({ autoResize: true, backgroundColor: props.backgroundColor || 0xFFFFFF });
        const element = pixiElement.current;
        if (element) {
            element.appendChild(app.view);
            app.renderer.resize(element.clientWidth, element.clientHeight);
        }  
        props.onAppChange(app);
    }, [props.backgroundColor, pixiElement.current]);

    useEffect(() => {
        Events.add('onresize', 'pixi', resize);
        return () => Events.remove('onresize', 'pixi');
    }, []);

    return <div className='main full-height' ref={pixiElement} />;
}