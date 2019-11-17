import { BaseGame, BaseGameProps } from '../BaseGame'
import { Events } from '../../Events';
import * as PIXI from "pixi.js";
import React from 'react';

export abstract class PixiPresenter<T extends BaseGameProps, U> extends BaseGame<T, U> {
    app: PIXI.Application;
    pixiElement: HTMLDivElement | null;

    constructor(backgroundColor: number, props: T) {
        super(props);

        this.app = new PIXI.Application({ autoResize: true, backgroundColor: backgroundColor });
        this.pixiElement = null;
    }

    abstract init(): void;

    pixiUpdate = (element: HTMLDivElement) => {
        this.pixiElement = element;

        if (this.pixiElement && this.pixiElement.children.length <= 0) {
            this.pixiElement.appendChild(this.app.view);
            this.app.renderer.resize(element.clientWidth, element.clientHeight);

            this.init();    
        }
    }

    componentDidMount() {
        super.componentDidMount();

        const resize = () => {
            const parent = this.app.view.parentNode as HTMLElement;
            parent && this.app.renderer.resize(parent.clientWidth, parent.clientHeight);
            this.init();
        }

        Events.add('onresize', 'presenter', resize);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        Events.remove('onresize', 'presenter');
    }

    render() {
        return <div className='main full-height' ref={this.pixiUpdate} />;
    }
}